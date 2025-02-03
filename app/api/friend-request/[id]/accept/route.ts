import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update friend request status to ACCEPTED
    const friendRequest = await prisma.friendRequest.update({
      where: {
        id: id,
      },
      data: {
        status: "ACCEPTED",
        updatedAt: new Date(),
      },
      include: {
        User_FriendRequest_senderIdToUser: true,
      },
    });

    // Create a new conversation between the users
    await prisma.conversation.create({
      data: {
        participants: {
          connect: [
            { id: friendRequest.senderId },
            { id: friendRequest.recipientId },
          ],
        },
      },
    });

    // Create notification for the sender
    await prisma.notification.create({
      data: {
        id: `notif_${Date.now()}`,
        userId: friendRequest.senderId,
        type: "FRIEND_REQUEST_ACCEPTED",
        title: "Friend Request Accepted",
        content: `${user.firstName} ${user.lastName} accepted your friend request`,
        relatedId: friendRequest.id,
      },
    });

    return NextResponse.json(friendRequest);
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 