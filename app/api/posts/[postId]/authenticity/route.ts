import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const {postId} = await params
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isAuthentic } = await req.json();

    const authenticity = await prisma.postAuthenticity.upsert({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
      update: {
        isAuthentic,
      },
      create: {
        postId: postId,
        userId: user.id,
        isAuthentic,
      },
    });

    // Get updated counts
    const counts = await prisma.postAuthenticity.groupBy({
      by: ['isAuthentic'],
      where: {
        postId: postId,
      },
      _count: true,
    });

    return NextResponse.json({
      authenticity,
      counts: {
        authentic: counts.find(c => c.isAuthentic)?._count || 0,
        unauthentic: counts.find(c => !c.isAuthentic)?._count || 0,
      },
    });
  } catch (error) {
    console.error("Error updating authenticity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const {postId} = await params
    const counts = await prisma.postAuthenticity.groupBy({
      by: ['isAuthentic'],
      where: {
        postId: postId,
      },
      _count: true,
    });

    const user = await currentUser();
    let userVote = null;
    
    if (user) {
      const vote = await prisma.postAuthenticity.findUnique({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id,
          },
        },
      });
      userVote = vote?.isAuthentic;
    }

    return NextResponse.json({
      counts: {
        authentic: counts.find(c => c.isAuthentic)?._count || 0,
        unauthentic: counts.find(c => !c.isAuthentic)?._count || 0,
      },
      userVote,
    });
  } catch (error) {
    console.error("Error fetching authenticity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 