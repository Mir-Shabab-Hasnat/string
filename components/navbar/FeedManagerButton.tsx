"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FeedManagerButton() {
  return (
    <Link href="/feed-manager">
      <Button variant="ghost" size="icon" className="relative">
        <Settings className="h-5 w-5" />
      </Button>
    </Link>
  );
} 