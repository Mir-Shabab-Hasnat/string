"use client";

import { User, Post as PrismaPost } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Mail, Building2, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostComponent from "@/components/dashboard/FeedContent/Post";

interface PostWithUser extends PrismaPost {
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    username: string;
  };
  tags: string[];
}

interface ProfileTabsProps {
  user: User;
  isOwner: boolean;
}

export default function ProfileTabs({ user, isOwner }: ProfileTabsProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-6 bg-background border rounded-xl">
      <CardContent className="p-6">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            {isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="about">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  {user.organisation && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Organization</p>
                        <p className="font-medium">{user.organisation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Account Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium text-foreground capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium text-foreground">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <div className="min-h-[200px]">
              <UserPostFeed userId={user.id} />
            </div>
          </TabsContent>

          {isOwner && (
            <TabsContent value="settings">
              <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                <p>Account settings coming soon</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function UserPostFeed({ userId }: { userId: string }) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (isLoading && pageNum > 1) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${userId}/posts?page=${pageNum}&limit=5`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }
      
      const data = await response.json();
      
      if (data.posts.length === 0 || data.posts.length < 5) {
        setHasMore(false);
      }
      
      setPosts(prev => {
        if (pageNum === 1) return data.posts;
        const existingIds = new Set(prev.map((p: PostWithUser) => p.id));
        const newPosts = data.posts.filter((p: PostWithUser) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, userId]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [userId]);

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
              profilePicture: post.user.profilePicture,
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
        {!hasMore && !isLoading && posts.length > 0 && (
          <div className="text-center text-gray-500">
            No more posts
          </div>
        )}
      </div>
    </div>
  );
}