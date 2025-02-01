import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        // Include friend request status for FRIEND_REQUEST type notifications
        FriendRequest: {
          select: {
            status: true
          }
        }
      },
      take: 20,
    });

    // Transform the data to include friendRequestStatus
    const transformedNotifications = notifications.map(notification => ({
      ...notification,
      friendRequestStatus: notification.type === 'FRIEND_REQUEST' 
        ? notification.FriendRequest?.status 
        : undefined,
      FriendRequest: undefined // Remove the raw relation data
    }));

    return NextResponse.json(transformedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 

