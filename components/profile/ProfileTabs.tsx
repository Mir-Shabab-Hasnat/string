"use client"

import { User } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProfileTabsProps {
  user: User
  isOwner: boolean
}

export default function ProfileTabs({ user, isOwner }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts">
        {/* Posts content will go here */}
      </TabsContent>
      
      <TabsContent value="about">
        {/* About content will go here */}
      </TabsContent>
    </Tabs>
  )
} 