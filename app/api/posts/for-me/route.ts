import {  NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
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
