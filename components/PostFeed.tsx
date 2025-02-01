"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Post } from '@prisma/client';
import PostComponent from '@/components/dashboard/FeedContent/Post';
import { useInView } from 'react-intersection-observer';

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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Setup intersection observer
  const { ref, inView } = useInView();

  const fetchPosts = async (pageNum: number) => {
    try {
      const response = await fetch(`/api/posts/user-posts?page=${pageNum}&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      
      if (data.posts.length < 5) {
        setHasMore(false);
      }
      
      setPosts(prev => pageNum === 1 ? data.posts : [...prev, ...data.posts]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage(prev => prev + 1);
      fetchPosts(page + 1);
    }
  }, [inView, hasMore, isLoading]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0 && !isLoading) {
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
        
        {/* Loading indicator */}
        <div ref={ref} className="py-4">
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 