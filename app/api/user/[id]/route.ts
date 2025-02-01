import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        profilePicture: true,
        organisation: true,
        role: true,
      }
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 