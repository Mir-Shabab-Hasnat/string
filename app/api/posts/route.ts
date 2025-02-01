import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/schemas/post.schema";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = createPostSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        content: validatedData.content,
        imageUrl: validatedData.files?.[0], // Store first image as main image
        userId: user.id,
        // Add any other fields you need
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 