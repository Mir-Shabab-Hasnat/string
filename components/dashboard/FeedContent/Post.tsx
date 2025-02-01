"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LinkUserAvatar from "@/components/LinkUserAvatar";

interface PostProps {
  post: {
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
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
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <LinkUserAvatar 
              userId={post.user.id} 
              size="sm" 
              imageUrl={post.user.profilePicture}
            />
            <div>
              <p className="text-sm font-medium">
                {post.user.firstName} {post.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{post.content}</p>
        {post.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt="Post image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    </Card>
  );
} 

