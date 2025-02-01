import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get items from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingItems = await prisma.marketplaceItem.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        },
        sold: false
      },
      take: 5,
      include: {
        seller: {
          select: {
            firstName: true,
            lastName: true,
            profilePicture: true,
          }
        },
        _count: {
          select: {
            CartItem: true
          }
        }
      },
      orderBy: [
        { views: 'desc' },
        { clickCount: 'desc' }
      ]
    });

    if (!trendingItems || trendingItems.length === 0) {
      return NextResponse.json([]); // Return empty array if no items
    }

    const transformedItems = trendingItems.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      seller: {
        name: `${item.seller.firstName} ${item.seller.lastName}`,
        image: item.seller.profilePicture || '/default-avatar.png'
      },
      views: item.views,
      clickCount: item.clickCount
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('Trending items error:', error);
    return NextResponse.json([]); // Return empty array on error
  }
} 