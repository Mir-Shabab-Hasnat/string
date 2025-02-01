import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tags, showOtherContent } = await req.json();

    const preferences = await prisma.userFeedPreferences.upsert({
      where: { userId: user.id },
      update: { 
        tags,
        showOtherContent: showOtherContent || false
      },
      create: {
        userId: user.id,
        tags,
        showOtherContent: showOtherContent || false
      },
    });

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("Error saving feed preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 