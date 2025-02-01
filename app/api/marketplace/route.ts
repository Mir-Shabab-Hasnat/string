import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { ItemCategory } from "@prisma/client";
;

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      condition,
      location
    } = body;

    // Validate required fields
    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.marketplaceItem.create({
      data: {
        title,
        description,
        price: Number(price),
        category: category as ItemCategory,
        condition,
        location,
        sellerId: user.id,
        sold: false
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

interface ItemWithSeller {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ItemCategory;
  condition: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
  sold: boolean;
  seller: {
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query: any = {
      where: {},
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true
          }
        }
      }
    };

    if (category && category !== 'ALL') {
      query.where.category = category;
    }

    if (search) {
      query.where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const items = await prisma.marketplaceItem.findMany(query) as unknown as ItemWithSeller[];
    
    const transformedItems = items.map(item => ({
      ...item,
      seller: {
        name: `${item.seller?.firstName} ${item.seller?.lastName}`,
        image: item.seller?.profilePicture || '/default-avatar.png'
      }
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
} 