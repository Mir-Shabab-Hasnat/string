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
    const pageSize = 10;

    const posts = await prisma.post.findMany({
      where: {
        userId: user.id
      },
      include: getPostDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    return NextResponse.json({
      posts: posts.slice(0, pageSize),
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
