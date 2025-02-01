import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Add validation to ensure body contains required fields
    if (!body || !body.senderId || !body.recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: body.senderId,
        recipientId: body.recipientId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, data: friendRequest });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to create friend request:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 