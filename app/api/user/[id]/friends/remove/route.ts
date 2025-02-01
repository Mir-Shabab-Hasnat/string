import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { friendId } = await req.json();

    // Remove the friend relationship
    await prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: user.id, recipientId: friendId, status: "ACCEPTED" },
          { senderId: friendId, recipientId: user.id, status: "ACCEPTED" },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing friend:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 