import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import EditProfileForm from "@/components/profile/EditProfileForm"

export default async function EditProfilePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params
  const clerkUser = await currentUser()
  
  if (!clerkUser || clerkUser.id !== id) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: id }
  })

  if (!user) {
    redirect("/")
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>
      <EditProfileForm user={user} />
    </div>
  )
} 