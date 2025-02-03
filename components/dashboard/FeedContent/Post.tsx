"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, UserCircle, CheckCircle2, XCircle, MoreHorizontal, Trash2 } from "lucide-react";
import LinkUserAvatar from "@/components/LinkUserAvatar";
import Comment from "./Comment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostProps {
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture: string | null;
    };
    tags?: string[];
  };
}

export default function Post({ post }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const queryClient = useQueryClient();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { userId } = useAuth();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: true,
  });

  const { data: authenticity } = useQuery({
    queryKey: ["post-authenticity", post.id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/authenticity`);
      if (!response.ok) throw new Error("Failed to fetch authenticity");
      return response.json();
    },
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Failed to create comment");
      return response.json();
    },
    onMutate: async (newCommentContent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", post.id] });

      // Get current comments
      const previousComments = queryClient.getQueryData(["comments", post.id]);

      // Optimistically add new comment
      queryClient.setQueryData(["comments", post.id], (old: Comment[] | undefined) => [
        {
          id: "temp-" + Date.now(),
          content: newCommentContent,
          createdAt: new Date().toISOString(),
          user: {
            id: "loading",
            firstName: "Posting",
            lastName: "...",
            profilePicture: null,
          },
        },
        ...(old || []),
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments", post.id], context?.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
    },
    onSuccess: () => {
      setNewComment("");
      toast.success("Comment added successfully");
    },
  });

  const updateAuthenticity = useMutation({
    mutationFn: async (isAuthentic: boolean) => {
      const response = await fetch(`/api/posts/${post.id}/authenticity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAuthentic }),
      });
      if (!response.ok) throw new Error("Failed to update authenticity");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-authenticity", post.id],
      });
    },
  });

  const deletePost = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    createComment.mutate(newComment);
  };

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {post.user.profilePicture ? (
              <LinkUserAvatar 
                userId={post.user.id} 
                size="sm" 
                imageUrl={post.user.profilePicture}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="h-7 w-7 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {post.user.firstName} {post.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {post.userId === userId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteAlert(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    authenticity?.userVote === true && "text-green-500",
                    authenticity?.userVote === false && "text-red-500"
                  )}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => updateAuthenticity.mutate(true)}
                  className="text-green-500"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Authentic ({authenticity?.counts.authentic || 0})
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateAuthenticity.mutate(false)}
                  className="text-red-500"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Unauthentic ({authenticity?.counts.unauthentic || 0})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Avatar className="w-full h-full">
              <AvatarImage
                src={post.imageUrl}
                alt="Post image" 
                className="object-cover"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comments {comments.length > 0 && `(${comments.length})`}
          </Button>
        </div>
        
        {showComments && (
          <div className="w-full mt-4 space-y-4">
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
                rows={2}
              />
              <Button
                type="submit"
                size="sm"
                disabled={createComment.isPending || !newComment.trim()}
              >
                {createComment.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </form>
            
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center text-sm text-muted-foreground">
                  Loading comments...
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment: {
                  id: string;
                  content: string;
                  createdAt: string;
                  user: {
                    id: string;
                    firstName: string;
                    lastName: string;
                    profilePicture: string | null;
                  };
                }) => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No comments yet
                </div>
              )}
            </div>
          </div>
        )}
      </CardFooter>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePost.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
} 

