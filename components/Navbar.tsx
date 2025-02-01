"use client"

import Link from "next/link"
import { ThemeToggle } from "./landing/ThemeToggle"
import SearchField from "./SearchField"
import Logo from "./Logo"
import CustomUserButton from "./CustomUserButton"
import { NotificationBell } from "./navbar/NotificationBell"
import { ChatButton } from "./navbar/ChatButton"
import { FeedManagerButton } from "./navbar/FeedManagerButton"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 mb-4 mt-3">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            
              <Logo size={3}/>
            
            <div className="hidden w-[300px] md:block">
              <SearchField />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="block md:hidden">
              <SearchField />
            </div>
            <ThemeToggle />
            <NotificationBell />
            <ChatButton />
            <FeedManagerButton />
            <CustomUserButton />
          </div>
        </div>
      </div>
    </header>
  )
}

