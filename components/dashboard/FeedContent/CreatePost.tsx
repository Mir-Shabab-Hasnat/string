"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { tags } from "@/lib/constants/tags";
import LinkUserAvatar from "@/components/LinkUserAvatar";

const CreatePost = () => {
  const { user } = useUser();
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <Card className="h-[10%]">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-3">
          <LinkUserAvatar size="sm" userId={user.id} />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="secondary">
                Create a Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-3">
                    <LinkUserAvatar size="sm" userId={user.id} />
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.fullName}</span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <Textarea
                  placeholder="What's on your mind?"
                  className="min-h-[100px] resize-none"
                />

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="files">Attachments</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    className="cursor-pointer"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files or click to select
                  </p>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label>Tags</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between"
                      >
                        {selectedTags.length === 0
                          ? "Select tags..."
                          : `${selectedTags.length} selected`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search tags..." />
                        <CommandEmpty>No tags found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            <ScrollArea className="h-72">
                              {tags.map((tag) => (
                                <CommandItem
                                  key={tag}
                                  onSelect={() => {
                                    setSelectedTags((prev) =>
                                      prev.includes(tag)
                                        ? prev.filter((t) => t !== tag)
                                        : [...prev, tag]
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedTags.includes(tag)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {tag}
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-1 text-xs"
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button>Post</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
      </div>
    </Card>
  );
};

export default CreatePost;
