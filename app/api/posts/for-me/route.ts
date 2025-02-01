import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface PostsPage {
  posts: PostWithUser[];
  nextCursor: string | null;
}

// Define the type for posts with included user data
type PostWithUser = Prisma.PostGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        profilePicture: true;
        username: true;
      };
    };
  };
}>;

// Function to get post data include configuration
function getPostDataInclude() {
  return {
    user: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        username: true,
      },
    },
  } as const;
}

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit")) || 2; // Default to 2 if not specified

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { userId: user.id },
          {
            userId: {
              in: await prisma.follow.findMany({
                where: { followerId: user.id },
                select: { followingId: true },
              }).then(follows => follows.map(f => f.followingId))
            }
          }
        ]
      },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // Skip the cursor item
      orderBy: { createdAt: "desc" },
      include: getPostDataInclude(),
    });

    const hasMore = posts.length > limit;
    const slicedPosts = hasMore ? posts.slice(0, -1) : posts;
    const nextCursor = hasMore ? posts[posts.length - 2].id : null;

    return NextResponse.json({
      posts: slicedPosts,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
