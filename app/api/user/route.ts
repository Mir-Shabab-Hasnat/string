import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, birthDate, role, organisation } = body;

    const newUser = await prisma.user.create({
      data: {
        id: clerkUser.id,
        username: clerkUser.username || `user_${clerkUser.id}`, // Required field
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName,
        lastName,
        birthDate,
        role,
        organisation,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 