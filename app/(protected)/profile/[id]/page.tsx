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

  const { id: userId } = await Promise.resolve(params)

  const [profile, viewer] = await Promise.all([
    // Get profile user
    prisma.user.findUnique({
      where: { id: userId }
    }),
    // Get current user
    currentUser()
  ])

  if (!profile) {
    notFound()
  }

  const isOwner = viewer?.id === profile.id

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <ProfileHeader 
        user={profile}
        isOwner={isOwner}
      />
      <ProfileTabs 
        user={profile}
        isOwner={isOwner} 
      />
    </div>
  )
} 

