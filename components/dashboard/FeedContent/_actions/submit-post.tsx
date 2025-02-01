"use server"

import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { z } from "zod"
import { createPostSchema } from "@/schemas/post.schema"

export async function submitPost(data: z.infer<typeof createPostSchema>) {
  try {
    const parsedData = createPostSchema.parse(data)
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      throw new Error("Unauthorized")
    }

    const post = await prisma.post.create({
      data: {
        content: parsedData.content,
        imageUrl: parsedData.files?.[0],
        userId: clerkUser.id,
        tags: parsedData.tags
      },
      include: {
        user: true
      }
    })

    return post
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid data provided")
    }
    throw error
  }
}


