import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's preferences
    const preferences = await prisma.userFeedPreferences.findUnique({
      where: { userId: user.id },
    });

    // Get user's friends IDs
    const friends = await prisma.friendRequest.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { recipientId: user.id, status: "ACCEPTED" },
        ],
      },
    });

    const friendIds = friends.map(friend => 
      friend.senderId === user.id ? friend.recipientId : friend.senderId
    );

    // Get preferred posts first
    const preferredPosts = await prisma.post.findMany({
      where: {
        AND: [
          {
            userId: {
              in: [user.id, ...friendIds],
            },
          },
          ...(preferences?.tags?.length ? [{
            tags: {
              hasSome: preferences.tags,
            },
          }] : []),
        ],
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
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

    // If showing other content, get remaining posts
    let otherPosts = [];
    if (preferences?.showOtherContent) {
      otherPosts = await prisma.post.findMany({
        where: {
          AND: [
            {
              userId: {
                in: [user.id, ...friendIds],
              },
            },
            {
              NOT: {
                tags: {
                  hasSome: preferences.tags || [],
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
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
    }

    // Combine posts, with preferred posts first
    const posts = [...preferredPosts, ...otherPosts];

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 