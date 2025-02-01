import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const friends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { recipientId: user.id, status: "ACCEPTED" },
        ],
      },
    });

    const results = await Promise.all(
      friends.map(async (friend) => {
        const friendId = friend.senderId === user.id ? friend.recipientId : friend.senderId;
        
        try {
          // Try to create the conversation
          const conversation = await prisma.conversation.upsert({
            where: {
              unique_participant_pairs: {
                participantIds: [user.id, friendId].sort(), // Sort to ensure consistent order
              },
            },
            create: {
              participants: {
                connect: [
                  { id: user.id },
                  { id: friendId },
                ],
              },
            },
            update: {}, // Do nothing if it exists
          });
          return { success: true, conversationId: conversation.id };
        } catch (error) {
          console.error(`Failed to ensure conversation with friend ${friendId}:`, error);
          return { success: false, friendId };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error ensuring conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 