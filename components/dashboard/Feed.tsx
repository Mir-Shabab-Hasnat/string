"use client"

import { Card } from "@/components/ui/card"
import CreatePost from "./FeedContent/CreatePost"

export default function Feed() {
  return (
    <Card className="h-[calc(100vh-7rem)] overflow-y-auto p-4">
      <CreatePost />
    </Card>
  )
} 