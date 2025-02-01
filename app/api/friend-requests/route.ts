import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipientId } = await req.json();
    const senderId = userId;

    // Check if request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        recipientId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Friend request already sent' },
        { status: 400 }
      );
    }

    // Create the friend request
    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        recipientId,
        status: 'PENDING',
      },
    });

    // Create notification for the recipient
    await prisma.notification.create({
      data: {
        userId: recipientId,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        content: `You have a new friend request`,
        relatedId: friendRequest.id,
      },
    });

    // Create notification for the sender
    await prisma.notification.create({
      data: {
        userId: senderId,
        type: 'FRIEND_REQUEST_SENT',
        title: 'Friend Request Sent',
        content: `Your friend request has been sent`,
        relatedId: friendRequest.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to process friend request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 