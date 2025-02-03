import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const friendRequests = await prisma.friendRequest.count({
      where: {
        OR: [
          { senderId: id },
          { recipientId: id },
        ],
        status: "ACCEPTED",
      },
    });

    return NextResponse.json({ count: friendRequests });
  } catch (error) {
    console.error("Error getting friend count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 