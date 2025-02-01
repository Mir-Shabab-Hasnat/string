import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isAuthentic } = await req.json();

    const authenticity = await prisma.commentAuthenticity.upsert({
      where: {
        commentId_userId: {
          commentId: params.commentId,
          userId: user.id,
        },
      },
      update: {
        isAuthentic,
      },
      create: {
        commentId: params.commentId,
        userId: user.id,
        isAuthentic,
      },
    });

    // Get updated counts
    const counts = await prisma.commentAuthenticity.groupBy({
      by: ['isAuthentic'],
      where: {
        commentId: params.commentId,
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
  { params }: { params: { commentId: string } }
) {
  try {
    const counts = await prisma.commentAuthenticity.groupBy({
      by: ['isAuthentic'],
      where: {
        commentId: params.commentId,
      },
      _count: true,
    });

    const user = await currentUser();
    let userVote = null;
    
    if (user) {
      const vote = await prisma.commentAuthenticity.findUnique({
        where: {
          commentId_userId: {
            commentId: params.commentId,
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