import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { userFormSchema } from "@/schemas/user.schema";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    
    // Convert birthDate string to Date object before validation
    const dataToValidate = {
      ...body,
      birthDate: new Date(body.birthDate),
    };

    const validatedData = userFormSchema.parse(dataToValidate);

    const dbUser = await prisma.user.create({
      data: {
        id: user.id,
        username: user.username || "",
        email: user.emailAddresses[0].emailAddress,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        birthDate: validatedData.birthDate,
        organisation: validatedData.organisation,
        role: validatedData.role,
        profilePicture: validatedData.profilePicture || null,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 