"use client";

import { useEffect, useState } from 'react';
import { Post } from '@prisma/client';
import PostComponent from '@/components/dashboard/FeedContent/Post';

interface PostWithUser extends Post {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    username: string;
  };
  tags: string[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture: string | null;
    };
  }[];
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts/user-posts');
        if (!response.ok) {
          console.log(response)
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No posts found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-4">
        {posts.map((post) => (
          <PostComponent
            key={post.id}
            post={{
              id: post.id,
              content: post.content,
              imageUrl: post.imageUrl,
              createdAt: post.createdAt.toString(),
              user: {
                id: post.user.id,
                firstName: post.user.firstName,
                lastName: post.user.lastName,
                profilePicture: post.user.profilePicture,
              },
              tags: post.tags || [],
            }}
          />
        ))}
      </div>
    </div>
  );
} 