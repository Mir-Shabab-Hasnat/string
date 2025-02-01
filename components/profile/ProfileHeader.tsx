"use client";

import { User, UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { CalendarDays, MapPin, Mail, Building2 } from "lucide-react";
import { Badge } from "../ui/Badge";

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const router = useRouter();
  
  // Format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-xl p-6">
      <CardContent className="flex flex-col md:flex-row items-center gap-6">
        {/* Left Section - Avatar */}
        <div className="relative group">
          <Avatar className="w-32 h-32 border-4 border-primary/20 transition-all duration-300 group-hover:scale-105">
            <AvatarImage 
              src={user.profilePicture || "/default-avatar.png"} 
              alt={`${user.firstName}'s profile picture`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-2xl font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {isOwner && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs shadow-lg"
                onClick={() => router.push(`/profile/${user.id}/edit`)}
              >
                Change Photo
              </Button>
            </div>
          )}
        </div>

        {/* Right Section - User Info */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Name and Username */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-muted-foreground font-medium">@{user.username}</p>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {user.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            
            {user.organisation && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{user.organisation}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <Badge variant="secondary">Member</Badge>
            {user.role === UserRole.ACADEMIC && (
              <Badge variant="default" className="bg-primary">Academic</Badge>
            )}
            {user.role === UserRole.PROFESSIONAL && (
              <Badge variant="default" className="bg-blue-500">Professional</Badge>
            )}
            {user.role === UserRole.STUDENT && (
              <Badge variant="default" className="bg-green-500">Student</Badge>
            )}
          </div>

          {/* Edit Button for Owner */}
          {isOwner && (
            <Button
              variant="outline"
              className="w-full md:w-auto transition-all duration-300 hover:bg-primary hover:text-white"
              onClick={() => router.push(`/profile/${user.id}/edit`)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
