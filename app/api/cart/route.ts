import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { itemId } = await request.json();

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Add item to cart
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_itemId: {
          cartId: cart.id,
          itemId: itemId,
        },
      },
      update: {
        quantity: { increment: 1 },
      },
      create: {
        cartId: cart.id,
        itemId: itemId,
        quantity: 1,
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            marketplaceItem: true,
          },
        },
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 