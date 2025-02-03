import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const friends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: id },
          { recipientId: id },
        ],
        status: "ACCEPTED",
      },
      include: {
        User_FriendRequest_senderIdToUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            username: true,
          },
        },
        User_FriendRequest_recipientIdToUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePicture: true,
            username: true,
          },
        },
      },
    });

    // Transform the data to get a clean friends list
    const friendsList = friends.map(friend => {
      const friendData = friend.senderId === id 
        ? friend.User_FriendRequest_recipientIdToUser 
        : friend.User_FriendRequest_senderIdToUser;
      
      return {
        id: friendData.id,
        firstName: friendData.firstName,
        lastName: friendData.lastName,
        profilePicture: friendData.profilePicture,
        username: friendData.username,
      };
    });

    return NextResponse.json(friendsList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 