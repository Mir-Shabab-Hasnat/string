

import { Hero } from "@/components/landing/Hero";
import Logo from "@/components/Logo";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";



export default async function Home() {
  

  const clerkUser = await currentUser()
   if (!clerkUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <Hero />
        <Logo  size={5}/>
      </div>
    );
   }


  const user = await prisma.user.findUnique({
    where: {
      id: clerkUser.id
    }
  })

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <Hero />
        <Logo  size={5}/>
      </div>
    );
  }

  redirect("/dashboard")






  
}
