import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const friends = await prisma.user.findMany({
      where: {
        OR: [
          { FriendRequest_FriendRequest_recipientIdToUser: { some: { senderId: id, status: "ACCEPTED" } } },
          { FriendRequest_FriendRequest_senderIdToUser: { some: { recipientId: id, status: "ACCEPTED" } } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        profilePicture: true,
      },
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 