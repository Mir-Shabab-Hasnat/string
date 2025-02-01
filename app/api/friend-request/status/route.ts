import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user ID is required" },
        { status: 400 }
      );
    }

    const friendRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user.id, recipientId: targetUserId },
          { senderId: targetUserId, recipientId: user.id },
        ],
      },
    });

    return NextResponse.json({
      status: friendRequest?.status || "NONE",
      requestId: friendRequest?.id,
      isOutgoing: friendRequest?.senderId === user.id,
    });
  } catch (error) {
    console.error("Error checking friend status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 