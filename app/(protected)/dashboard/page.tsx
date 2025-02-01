import prisma from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const DashboardPage = async () => {
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
    <div>dashboard</div>
  )
}

export default DashboardPage