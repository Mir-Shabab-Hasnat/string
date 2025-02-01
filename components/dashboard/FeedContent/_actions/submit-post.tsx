"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createPostSchema } from "@/schemas/post.schema";

export async function submitPost(data: z.infer<typeof createPostSchema>) {
  try {
    // Validate the incoming data
    const parsedData = createPostSchema.parse(data);

    // Get the current authenticated user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Unauthorized");
    }

    // Create a new post in the database
    const post = await prisma.post.create({
      data: {
        content: parsedData.content,
        imageUrl: parsedData.imageUrl || null,
        userId: clerkUser.id,
        tags: parsedData.tags,
      },
      include: {
        user: true,
      },
    });

    return { success: true, post };
  } catch (error) {
    console.error("Error submitting post:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation error", errors: error.flatten() };
    }

    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}



