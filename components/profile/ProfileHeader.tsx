"use client";

import { User, UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Edit, MessageSquare, MapPin, Calendar, Mail, BookOpen, Microscope, GraduationCap } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  isOwner: boolean;
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

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
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
                  <Button 
                    size="lg" 
                    className="w-full font-semibold bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Link href={`/profile/${user.id}/portfolio`} className="w-full">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className={`w-full font-semibold ${roleConfig[user.role].color} hover:bg-gray-50`}
                    >
                      <RoleIcon className="w-4 h-4 mr-2" />
                      View Portfolio
                    </Button>
                  </Link>
                </>
              )}
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
