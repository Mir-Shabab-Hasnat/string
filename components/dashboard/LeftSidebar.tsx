"use client"

import { Card } from "@/components/ui/card"
import { useUser } from "@clerk/nextjs"
import { MessageSquare, Settings, Store, TagsIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function LeftSidebar() {
  const { user } = useUser()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "Feed Manager",
      href: "/feed-manager",
      icon: <TagsIcon className="w-4 h-4" />
    },
    {
      label: "Chat",
      href: "/chat",
      icon: <MessageSquare className="w-4 h-4" />
    },
    {
      label: "Marketplace",
      href: "/marketplace",
      icon: <Store className="w-4 h-4" />
    },
    
  ]

  return (
    <Card className="h-[calc(100vh-7rem)] p-4">
      {/* User Profile Section */}
      <div className="flex flex-col items-center space-y-4 pb-6 border-b">
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            src={user?.imageUrl || '/default-avatar.png'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h2 className="font-semibold text-lg">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-sm text-muted-foreground">@{user?.username}</p>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link href={item.href} key={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-2"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </Card>
  )
}