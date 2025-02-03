"use client";

import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatUI from "@/components/chat/ChatUI";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ChatButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-full p-0 md:max-w-[500px]"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>
        <TooltipProvider>
          <ChatUI />
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
} 

