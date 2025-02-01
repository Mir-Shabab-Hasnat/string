"use client"

import { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ProfileHeaderProps {
  user: User
  isOwner: boolean
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        <Image
          src={user.profilePicture || "/default-avatar.png"}
          alt={`${user.firstName}'s profile picture`}
          fill
          className="rounded-full object-cover"
        />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-muted-foreground">@{user.username}</p>
      </div>

      {isOwner && (
        <Button
          variant="outline"
          onClick={() => router.push(`/profile/${user.id}/edit`)}
        >
          Edit Profile
        </Button>
      )}
    </div>
  )
} 