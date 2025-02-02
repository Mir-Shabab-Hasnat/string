
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
    const {postId} = await params
  try {
    const  user = await currentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = user.id
    const post = await prisma.post.findUnique({
      where: { id: params.postId },
      select: { userId: true },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    if (post.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prisma.post.delete({
      where: { id: params.postId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 