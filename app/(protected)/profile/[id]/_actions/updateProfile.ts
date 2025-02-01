"use server"

import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { z } from "zod"
import { updateProfileSchema } from "@/schemas/profile.schema"

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const parsedData = updateProfileSchema.parse(data)
    const clerkUser = await currentUser()
    
    if (!clerkUser || clerkUser.id !== parsedData.userId) {
      throw new Error("Unauthorized")
    }

    const updatedUser = await prisma.user.update({
      where: { id: parsedData.userId },
      data: {
        firstName: parsedData.firstName,
        lastName: parsedData.lastName,
        organisation: parsedData.organisation,
        profilePicture: parsedData.profilePicture,
      },
    })

    return updatedUser
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid data provided")
    }
    throw error
  }
} 
