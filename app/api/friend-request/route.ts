import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId } = await req.json();

    // Check if request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user.id, recipientId },
          { senderId: recipientId, recipientId: user.id },
        ],
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Friend request already exists" },
        { status: 400 }
      );
    }

    // Create friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        id: `fr_${Date.now()}`,
        senderId: user.id,
        recipientId,
        status: "PENDING",
        updatedAt: new Date(),
      },
    });

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        id: `notif_${Date.now()}`,
        userId: recipientId,
        type: "FRIEND_REQUEST",
        title: "New Friend Request",
        content: `${user.firstName} ${user.lastName} sent you a friend request`,
        relatedId: friendRequest.id,
      },
    });

    return NextResponse.json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 