import Feed from "@/components/dashboard/Feed"
import LeftSidebar from "@/components/dashboard/LeftSidebar"
import RightSidebar from "@/components/dashboard/RightSidebar"
import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: clerkUser.id
    }
  })

  if (!user) {
    redirect("/wizard")
  }
  return (
    <div className="grid grid-cols-12 gap-6 h-full p-0 max-[1099px]:px-8">
      <aside className="hidden min-[1100px]:block min-[1100px]:col-span-2">
        <LeftSidebar />
      </aside>
      
      <main className="col-span-12 min-[900px]:col-span-8 min-[1100px]:col-span-7">
        <Feed />
      </main>
      
      <aside className="hidden min-[900px]:block min-[900px]:col-span-4 min-[1100px]:col-span-3">
        <RightSidebar />
      </aside>
    </div>
  )
}

