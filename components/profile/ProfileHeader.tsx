"use client";

import { User, UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, MessageSquare, MapPin, Calendar, Mail, BookOpen, Microscope, GraduationCap, Users, UserPlus, UserCheck, UserX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/Badge"
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FriendRequestButton } from "./FriendRequestButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
}

// Temporary mock data for followers/following
const mockConnections = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePicture: "/default-avatar.png",
    role: "STUDENT",
    organisation: "MIT"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePicture: "/default-avatar.png",
    role: "PROFESSIONAL",
    organisation: "Google"
  },
  // Add more mock users as needed
]

type FriendStatus = {
  status: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestId: string | null;
  isOutgoing: boolean;
};

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string | null;
}

export default function ProfileHeader({ user, isOwner }: ProfileHeaderProps) {
  const roleColors = {
    STUDENT: "bg-blue-100 text-blue-800",
    PROFESSIONAL: "bg-purple-100 text-purple-800",
    ACADEMIC: "bg-emerald-100 text-emerald-800",
  }

  const roleConfig = {
    STUDENT: {
      icon: GraduationCap,
      text: "Student Portfolio",
      color: "text-blue-600 hover:text-blue-700",
    },
    PROFESSIONAL: {
      icon: BookOpen,
      text: "Professional Portfolio",
      color: "text-purple-600 hover:text-purple-700",
    },
    ACADEMIC: {
      icon: Microscope,
      text: "Academic Portfolio",
      color: "text-emerald-600 hover:text-emerald-700",
    },
  }

  const RoleIcon = roleConfig[user.role].icon;

  const { data: friendCount, isLoading, error } = useQuery({
    queryKey: ["friendCount", user.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/${user.id}/friends/count`);
      if (!res.ok) throw new Error("Failed to fetch friend count");
      const data = await res.json();
      return data.count;
    },
  });

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const queryClient = useQueryClient();

  const { data: friends, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends", user.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/${user.id}/friends`);
      if (!res.ok) throw new Error("Failed to fetch friends");
      return res.json();
    },
  });

  const { mutate: removeFriend } = useMutation({
    mutationFn: async (friendId: string) => {
      const res = await fetch(`/api/user/${user.id}/friends/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      });
      if (!res.ok) throw new Error("Failed to remove friend");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends", user.id] });
      toast.success("Friend removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove friend");
    },
  });

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Avatar & Quick Actions */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            {/* Avatar Container with Border */}
            <div className="relative group">
              {/* Profile Picture */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                <Image
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={`${user.firstName}'s profile picture`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
              
              {/* Status Indicator - Optional */}
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full ring-4 ring-white" />
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full space-y-2 min-w-[200px]">
              {isOwner ? (
                <>
                  <Link href={`/profile/${user.id}/edit`} className="w-full">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full font-semibold hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href={`/profile/${user.id}/portfolio`} className="w-full">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className={`w-full font-semibold ${roleConfig[user.role].color} hover:bg-gray-50`}
                    >
                      <RoleIcon className="w-4 h-4 mr-2" />
                      {roleConfig[user.role].text}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <FriendRequestButton userId={user.id} />
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </Button>
                  <Link href={`/profile/${user.id}/portfolio`} className="w-full">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className={`w-full flex items-center gap-2 ${roleConfig[user.role].color} hover:bg-gray-50`}
                    >
                      <RoleIcon className="w-4 h-4" />
                      View Portfolio
                    </Button>
                  </Link>
                </>
              )}
              {/* Friends Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full">
                    Friends ({friendCount || 0})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle>Friends</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-1 h-[50vh] pr-4">
                    {friendsLoading ? (
                      <div className="p-4 text-center text-gray-500">Loading...</div>
                    ) : (
                      <div className="space-y-2">
                        {friends?.map((friend: Friend) => (
                          <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Avatar>
                              <AvatarImage src={friend.profilePicture || "/default-avatar.png"} />
                              <AvatarFallback>
                                {friend.firstName[0]}
                                {friend.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">
                                {friend.firstName} {friend.lastName}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFriend(friend.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Right Column - User Info */}
          <div className="flex-1 space-y-6 lg:pt-4">
            {/* Name and Username */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-lg text-gray-500 font-medium">@{user.username}</p>
            </div>

            {/* Role and Organization */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${roleColors[user.role]}`}>
                {user.role}
              </span>
              {user.organisation && (
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 text-sm font-medium inline-flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {user.organisation}
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </span>
              <span className="inline-flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
