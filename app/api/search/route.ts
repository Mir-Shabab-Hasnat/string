import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const filter = searchParams.get("filter") || "user"

    if (!query) {
      return NextResponse.json([])
    }

    switch (filter) {
      case "user":
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { firstName: { contains: query, mode: "insensitive" } },
              { lastName: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profilePicture: true,
          },
        })
        return NextResponse.json(users)
      
      default:
        return NextResponse.json([])
    }
  } catch (error) {
    console.error("Search error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 