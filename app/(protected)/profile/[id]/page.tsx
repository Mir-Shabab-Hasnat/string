import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs from "@/components/profile/ProfileTabs"

export default async function ProfilePage({
  params
}: {
  params: { id: string }
}) {
  const {id} = await params
  const [profile, viewer] = await Promise.all([
    prisma.user.findUnique({
      where: { id: id }
    }),
    currentUser()
  ])

  if (!profile) {
    notFound()
  }

  const isOwner = viewer?.id === profile.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Banner */}
        <div className="absolute inset-0 h-[300px] bg-gradient-to-br from-blue-600 to-purple-700" />
        
        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="pt-16 pb-24">
            <ProfileHeader 
              user={profile}
              isOwner={isOwner}
            />
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="bg-white rounded-xl shadow-sm">
          <ProfileTabs 
            user={profile}
            isOwner={isOwner} 
          />
        </div>
      </div>
    </div>
  )
} 

