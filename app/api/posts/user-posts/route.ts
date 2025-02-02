import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pagination parameters and userId
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const userId = searchParams.get('userId');
    const skip = (page - 1) * limit;

    // If userId is provided, fetch only that user's posts
    if (userId) {
      const posts = await prisma.post.findMany({
        where: {
          userId: userId,
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
        skip,
        take: limit,
      });

      return NextResponse.json({ posts });
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

    // Get preferred posts first with pagination
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
      skip,
      take: limit,
    });

    // If showing other content and we don't have enough preferred posts
    let otherPosts: typeof preferredPosts = [];
    if (preferences?.showOtherContent && preferredPosts.length < limit) {
      const remainingCount = limit - preferredPosts.length;
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
        take: remainingCount,
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