"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import CreatePost from "./FeedContent/CreatePost"
import { Loader2 } from "lucide-react"

import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import Post from "./FeedContent/Post"

interface PostsPage {
  posts: PostData[]
  nextCursor: string | null
}

interface PostData {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  userId: string
  likes: number
  tags: string[]
  user: {
    id: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string | null
  }
}

export default function Feed() {
  // Create ref for infinite scroll
  const { ref, inView } = useInView()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const response = await fetch(
        `/api/posts?cursor=${pageParam || ""}`,
        {
          method: "GET",
        }
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }
      
      return response.json() as Promise<PostsPage>
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 60, // Keep unused data in cache for 1 hour
  })

  // Load more posts when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (status === "pending") {
    return (
      <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4">
        <CreatePost />
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4">
        <CreatePost />
        <div className="text-center text-red-500 p-4">
          Error loading posts. Please try again later.
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4 space-y-4">
      <CreatePost />
      
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin" />
        )}
      </div>

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center text-muted-foreground">
          No more posts to load
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center text-muted-foreground">
          No posts yet. Be the first to post!
        </div>
      )}
    </Card>
  )
} 

