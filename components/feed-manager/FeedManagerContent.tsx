"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { tags } from "@/lib/constants/tags";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FeedManagerContentProps {
  initialPreferences: {
    tags: string[];
    showOtherContent: boolean;
  } | null;
}

export default function FeedManagerContent({ initialPreferences }: FeedManagerContentProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialPreferences?.tags || []
  );
  const [showOtherContent, setShowOtherContent] = useState(
    initialPreferences?.showOtherContent || false
  );

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/feed-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tags: selectedTags,
          showOtherContent 
        }),
      });

      if (!response.ok) throw new Error("Failed to save preferences");

      toast.success("Feed preferences saved successfully");
      router.refresh();
      router.push("/dashboard")
    } catch (error) {
      toast.error("Failed to save preferences");
      console.error(error);
    }
  };

  const handleSelectAll = () => {
    setSelectedTags([...tags]);
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Feed Preferences</h2>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>
        </div>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Show Other Content</h3>
              <p className="text-sm text-muted-foreground">
                Display posts outside your selected tags with lower priority
              </p>
            </div>
            <Switch
              checked={showOtherContent}
              onCheckedChange={setShowOtherContent}
            />
          </div>
        </Card>

        <Separator />

        <div className="space-y-2">
          <h3 className="font-medium">Selected Tags</h3>
          <p className="text-sm text-muted-foreground">
            Choose the tags you&apos;re interested in to customize your feed content
          </p>
        </div>

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
      <Button onClick={handleSubmit} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
} 