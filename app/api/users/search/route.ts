import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
      take: 10, // Limit results to 10 users
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Failed to search users:', error);
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
  }
} 