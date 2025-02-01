"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { User } from "@prisma/client"
import { cn } from "@/lib/utils"

import { User2 } from "lucide-react"
import Link from "next/link"

interface LinkUserAvatarProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string | null;
}

export default function LinkUserAvatar({ userId, size = "md", imageUrl }: LinkUserAvatarProps) {
  const { user } = useUser()
  const router = useRouter()

  const { data: dbUser } = useQuery({
    queryKey: ['user', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const res = await fetch(`/api/user/${user.id}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      return res.json()
    },
    enabled: !!user?.id
  })

  if (!user) return null

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  return (
    <Link href={`/profile/${userId}`}>
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarImage src={imageUrl || dbUser?.profilePicture || "/default-avatar.png"} alt={dbUser?.firstName || "User avatar"} />
        <AvatarFallback>{dbUser?.firstName?.[0] || "U"}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
