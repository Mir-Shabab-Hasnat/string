"use client"

import PostFeed from "../PostFeed"
import { Card } from "../ui/card"
import CreatePost from "./FeedContent/CreatePost"

export default function Feed() {
  

  

  return (
    <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4 space-y-4">
      <CreatePost />
      <PostFeed />
      
    </Card>
  )
} 



