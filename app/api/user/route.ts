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

    // Generate a unique username if none is provided
    const username = user.username || `user_${user.id}`;

    const dbUser = await prisma.user.create({
      data: {
        id: user.id,
        username: username,
        email: user.emailAddresses[0].emailAddress,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        birthDate: validatedData.birthDate,
        organisation: validatedData.organisation,
        role: validatedData.role,
        profilePicture: validatedData.profilePicture || "",
      },
    });

    return NextResponse.json(dbUser);
  } catch (error: any) {
    // Safe error logging
    console.error("Error creating user:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      details: error?.errors || error?.cause
    });

    // Handle Zod validation errors
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        error: 'Validation error',
        details: error.errors
      }, { status: 400 });
    }

    // Handle Prisma errors with more detail
    if (error?.name === 'PrismaClientKnownRequestError') {
      // P2002 is unique constraint violation
      if (error.code === 'P2002') {
        const field = error.meta?.target as string[];
        return NextResponse.json({
          error: 'Database error',
          message: `A user with this ${field?.[0]} already exists`,
          field: field?.[0]
        }, { status: 409 });
      }

      return NextResponse.json({
        error: 'Database error',
        message: 'Failed to create user',
        code: error.code
      }, { status: 500 });
    }

    // Generic error response
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Something went wrong'
    }, { status: 500 });
  }
}