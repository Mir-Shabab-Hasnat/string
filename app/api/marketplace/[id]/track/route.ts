import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type } = body;
    const { id } = await params;

    if (!type || !['view', 'click'].includes(type)) {
      return NextResponse.json({ error: "Invalid tracking type" }, { status: 400 });
    }

    const updatedItem = await prisma.marketplaceItem.update({
      where: { id },
      data: {
        ...(type === 'view' ? { views: { increment: 1 } } : {}),
        ...(type === 'click' ? { clickCount: { increment: 1 } } : {})
      }
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 