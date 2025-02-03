"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, UserCircle, MoreHorizontal, Trash2, Check, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [authenticityVote, setAuthenticityVote] = useState<boolean | null>(null);
  const [voteCounts, setVoteCounts] = useState({ authentic: 0, unauthentic: 0 });

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const response = await fetch(`/api/posts/${post.id}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: true,
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
      await queryClient.cancelQueries({ queryKey: ["comments", post.id] });
      const previousComments = queryClient.getQueryData(["comments", post.id]);

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

  const voteAuthenticity = useMutation({
    mutationFn: async (isAuthentic: boolean) => {
      const response = await fetch(`/api/posts/${post.id}/authenticity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAuthentic }),
      });
      if (!response.ok) throw new Error("Failed to vote");
      return response.json();
    },
    onSuccess: (data) => {
      setVoteCounts(data.counts);
      setAuthenticityVote(data.authenticity.isAuthentic);
      toast.success("Vote recorded successfully");
    },
    onError: () => {
      toast.error("Failed to record vote");
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
                src={post.imageUrl}
                alt="Post image"
                width={500}
                height={500}
                className="w-full h-full object-cover"
            />
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
        <div className="w-full flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground",
                  authenticityVote !== null && (
                    authenticityVote
                      ? "text-green-600"
                      : "text-red-600"
                  )
                )}
              >
                {authenticityVote === true && <Check className="h-4 w-4 mr-2" />}
                {authenticityVote === false && <X className="h-4 w-4 mr-2" />}
                Authenticity
                {(voteCounts.authentic > 0 || voteCounts.unauthentic > 0) && 
                  ` (${voteCounts.authentic}/${voteCounts.unauthentic})`
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => voteAuthenticity.mutate(true)}
                className="text-green-600"
              >
                <Check className="h-4 w-4 mr-2" />
                Authentic ({voteCounts.authentic})
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => voteAuthenticity.mutate(false)}
                className="text-red-600"
              >
                <X className="h-4 w-4 mr-2" />
                Unauthentic ({voteCounts.unauthentic})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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

