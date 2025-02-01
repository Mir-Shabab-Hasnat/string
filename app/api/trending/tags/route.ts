import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all posts and their tags
    const posts = await prisma.post.findMany({
      select: {
        tags: true
      }
    });

    // Flatten all tags and count their occurrences
    const tagCounts = posts.reduce((acc: { [key: string]: number }, post) => {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    // Convert to array and sort by count
    const trendingTags = Object.entries(tagCounts)
      .map(([name, count]) => ({
        id: name, // Using tag name as ID since we don't have a Tag model
        name,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Get top 5 tags

    return NextResponse.json(trendingTags);
  } catch (error) {
    console.error('Error fetching trending tags:', error);
    return NextResponse.json({ error: 'Failed to fetch trending tags' }, { status: 500 });
  }
} 