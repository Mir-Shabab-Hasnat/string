"use client";

import { useCallback, useEffect, useState } from 'react';
import { Post } from '@prisma/client';
import PostComponent from '@/components/dashboard/FeedContent/Post';
import { useInView } from 'react-intersection-observer';

interface PostWithUser extends Post {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
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

interface UserPostsFeedProps {
  userId: string;
}

export default function UserPostsFeed({ userId }: UserPostsFeedProps) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  
  const { ref, inView } = useInView();

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (isFetching || !hasMore) return;
    
    setIsFetching(true);
    try {
      const response = await fetch(`/api/posts/user-specific-posts?userId=${userId}&page=${pageNum}&limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      
      if (data.posts.length === 0 || data.posts.length < 5) {
        setHasMore(false);
      }
      
      setPosts(prev => {
        const newPosts = data.posts.filter(
          (newPost: PostWithUser) => !prev.some(existingPost => existingPost.id === newPost.id)
        );
        return [...prev, ...newPosts];
      });
      setPage(pageNum + 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [hasMore, isFetching, userId]);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1);
  }, [userId, fetchPosts]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isFetching) {
      fetchPosts(page);
    }
  }, [inView, hasMore, isLoading, isFetching, fetchPosts, page]);

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        {error}
      </div>
    );
  }

  if (posts.length === 0 && !isLoading) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No posts yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostComponent
          key={post.id}
          post={{
            id: post.id,
            content: post.content,
            imageUrl: post.imageUrl,
            createdAt: post.createdAt.toString(),
            userId: post.userId,
            user: {
              id: post.user.id,
              firstName: post.user.firstName,
              lastName: post.user.lastName,
              profilePicture: post.user.profilePicture || null,
            },
            tags: post.tags || [],
          }}
        />
      ))}
      
      <div ref={ref} className="py-4">
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center text-muted-foreground">
            No more posts to load
          </div>
        )}
      </div>
    </div>
  );
} 