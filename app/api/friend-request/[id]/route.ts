import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json();
    const requestId = params.id;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
      include: { User_FriendRequest_senderIdToUser: true },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { error: "Friend request not found" },
        { status: 404 }
      );
    }

    if (friendRequest.recipientId !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to respond to this request" },
        { status: 403 }
      );
    }

    const updatedRequest = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { 
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
        updatedAt: new Date(),
      },
    });

    // If accepted, create a notification for the sender
    if (action === 'accept') {
      await prisma.notification.create({
        data: {
          id: `notif_${Date.now()}`,
          userId: friendRequest.senderId,
          type: "FRIEND_REQUEST_ACCEPTED",
          title: "Friend Request Accepted",
          content: `${user.firstName} ${user.lastName} accepted your friend request`,
          relatedId: requestId,
        },
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error handling friend request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 