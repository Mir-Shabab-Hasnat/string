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

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id, // Only fetch the current user's posts
      },
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({
      posts: posts || [],
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error", posts: [] },
      { status: 500 }
    );
  }
}
