"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { User } from "@prisma/client"

interface LinkUserAvatarProps {
  size?: "sm" | "default" | "lg"
  className?: string
  userId: string
}

export default function LinkUserAvatar({ size = "default", className, userId }: LinkUserAvatarProps) {
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
    default: "h-10 w-10",
    lg: "h-12 w-12"
  }

  return (
    <Button
      variant="ghost"
      className="p-0 h-auto"
      onClick={() => router.push(`/profile/${user.id}`)}
    >
      <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
        <AvatarImage src={dbUser?.profilePicture || "/default-avatar.png"} alt={dbUser?.firstName || "User avatar"} />
        <AvatarFallback>{dbUser?.firstName?.[0] || "U"}</AvatarFallback>
      </Avatar>
    </Button>
  )
}
