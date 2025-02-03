"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";

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
import { createPostSchema, type CreatePostData } from "@/schemas/post.schema";
import { UploadButton } from "@/components/ui/uploadthing";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CreatePost = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      imageUrl: null,
      tags: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreatePostData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post created successfully!");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Something went wrong. Please try again.");
      console.error("Error creating post:", error);
    },
  });

  const onSubmit = (data: CreatePostData) => {
    mutation.mutate(data);
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
      setPreviewUrl(null);
    }
  };

  if (!user) return null;

  return (
    <Card className="h-[10%]">
      <div className="flex flex-col gap-2 p-3">
        <div className="flex items-center gap-3">
          <LinkUserAvatar size="sm" userId={user.id} />
          <Dialog open={isOpen} onOpenChange={handleDialogChange}>
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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="What's on your mind?"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid w-full items-center gap-1.5">
                    <Label>Attachments</Label>
                    {previewUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                        <Avatar className="w-full h-full">
                          <AvatarImage
                            src={previewUrl}
                            alt="Upload preview"
                            className="object-cover"
                          />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPreviewUrl(null);
                            form.setValue("imageUrl", null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <UploadButton
                      endpoint="postImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          const url = res[0].url;
                          setPreviewUrl(url);
                          form.setValue("imageUrl", url);
                          toast.success("File uploaded successfully");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between"
                              >
                                {field.value.length === 0
                                  ? "Select tags..."
                                  : `${field.value.length} selected`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
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
                                          const newTags = field.value.includes(tag)
                                            ? field.value.filter((t) => t !== tag)
                                            : [...field.value, tag];
                                          form.setValue("tags", newTags);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value.includes(tag)
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
                        {field.value.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {field.value.map((tag) => (
                              <div
                                key={tag}
                                className="rounded-full bg-secondary px-2 py-1 text-xs"
                              >
                                {tag}
                              </div>
                            ))}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
      </div>
    </Card>
  );
};

export default CreatePost;
