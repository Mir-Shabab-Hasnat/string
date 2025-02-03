import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { type } = await request.json();

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