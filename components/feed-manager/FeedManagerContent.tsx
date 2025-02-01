"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { tags } from "@/lib/constants/tags";

interface FeedManagerContentProps {
  initialPreferences: {
    tags: string[];
  } | null;
}

export default function FeedManagerContent({ initialPreferences }: FeedManagerContentProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialPreferences?.tags || []
  );

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/feed-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: selectedTags }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      toast.success("Feed preferences saved successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Select Tags to Filter Your Feed</h2>
        <p className="text-sm text-muted-foreground">
          Choose the tags you're interested in to customize your feed content.
        </p>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedTags([...selectedTags, tag]);
                    } else {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }
                  }}
                />
                <label htmlFor={tag} className="text-sm font-medium cursor-pointer">
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <Button onClick={handleSubmit}>Save Preferences</Button>
    </div>
  );
} 