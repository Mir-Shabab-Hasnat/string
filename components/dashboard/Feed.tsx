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
  const { ref, inView } = useInView({
    threshold: 0.5,
  })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts-for-me"],
    queryFn: ({ pageParam }) =>
      fetch(
        `/api/posts/for-me${pageParam ? `?cursor=${pageParam}` : ""}`,
      ).then(res => {
        if (!res.ok) throw new Error("Failed to fetch posts")
        return res.json() as Promise<PostsPage>
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  const posts = data?.pages.flatMap((page) => page.posts) || []

  // if (status === "pending") {
  //   return (
  //     <Card className="h-[calc(100vh-7rem)] p-4">
  //       <div className="flex justify-center">
  //         <Loader2 className="h-6 w-6 animate-spin" />
  //       </div>
  //     </Card>
  //   )
  // }

  

  return (
    <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4 space-y-4">
      <CreatePost />
      
      <div className="space-y-4">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>

      {/* Loading trigger */}
      <div ref={ref} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
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



