import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all accepted friends
    const friends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { recipientId: user.id, status: "ACCEPTED" },
        ],
      },
    });

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      for (const friend of friends) {
        const friendId = friend.senderId === user.id ? friend.recipientId : friend.senderId;

        // Check if conversation exists using count instead of findFirst
        const conversationCount = await tx.conversation.count({
          where: {
            AND: [
              { participants: { some: { id: user.id } } },
              { participants: { some: { id: friendId } } },
            ],
          },
        });

        // Only create if no conversation exists
        if (conversationCount === 0) {
          await tx.conversation.create({
            data: {
              participants: {
                connect: [
                  { id: user.id },
                  { id: friendId },
                ],
              },
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ensuring conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 