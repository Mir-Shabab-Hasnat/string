import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser()
    
    if (!clerkUser || clerkUser.id !== params.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, organisation, profilePicture } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        organisation,
        profilePicture,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 