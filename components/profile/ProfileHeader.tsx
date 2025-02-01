"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md mx-auto shadow-md bg-background border rounded-xl p-6">
      <CardContent className="flex flex-col items-center gap-4">
        {/* Profile Picture with enhanced styling */}
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-primary/20 transition-all duration-300 group-hover:scale-105">
            <AvatarImage 
              src={user.profilePicture || "/default-avatar.png"} 
              alt={`${user.firstName}'s profile picture`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-xl font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {isOwner && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs"
                onClick={() => router.push(`/profile/${user.id}/edit`)}
              >
                Change Photo
              </Button>
            </div>
          )}
        </div>

        {/* User Info with enhanced styling */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">@{user.username}</p>
          {user.organisation && (
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
              {user.organisation}
            </div>
          )}
        </div>

        {/* Edit Button for Owner with enhanced styling */}
        {isOwner && (
          <Button
            variant="outline"
            className="mt-2 w-full transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2"
            onClick={() => router.push(`/profile/${user.id}/edit`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
