"use client"

import Link from "next/link"
import { ThemeToggle } from "./landing/ThemeToggle"
import SearchField from "./SearchField"
import Logo from "./Logo"
import CustomUserButton from "./CustomUserButton"
import { NotificationBell } from "./navbar/NotificationBell"
import { ChatButton } from "./navbar/ChatButton"
import { FeedManagerButton } from "./navbar/FeedManagerButton"
import { Menu, Store } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

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
            <Button variant="ghost" size="icon" asChild>
              <Link href="/marketplace">
                <Store className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Mobile dropdown menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex flex-col gap-2 p-2">
                    <div className="inline-flex justify-center">
                      <ThemeToggle />
                    </div>
                    <div className="inline-flex justify-center">
                      <NotificationBell />
                    </div>
                    <div className="inline-flex justify-center">
                      <ChatButton />
                    </div>
                    <div className="inline-flex justify-center">
                      <FeedManagerButton />
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop buttons */}
            <div className="hidden md:flex md:items-center md:gap-4">
              <ThemeToggle />
              <NotificationBell />
              <ChatButton />
              <FeedManagerButton />
            </div>
            
            <CustomUserButton />
          </div>
        </div>
      </div>
    </header>
  )
}



