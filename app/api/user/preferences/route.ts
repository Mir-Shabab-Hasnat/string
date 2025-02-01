import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Get user's feed preferences
    const feedPreferences = await prisma.userFeedPreferences.findUnique({
      where: {
        userId: userId,
      }
    });

    // Format the response to match the expected structure
    const response = {
      interests: feedPreferences?.tags || [],
      theme: 'light', // You might want to add this to your schema if needed
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch user preferences' }, { status: 500 });
  }
} 