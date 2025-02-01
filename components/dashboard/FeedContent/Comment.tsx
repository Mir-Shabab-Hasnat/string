import { formatDistanceToNow } from "date-fns";
import LinkUserAvatar from "@/components/LinkUserAvatar";
import { UserCircle } from "lucide-react";

interface CommentProps {
  comment: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture: string | null;
    };
  };
}

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="flex space-x-2 py-2">
      <div className="flex-shrink-0">
        {comment.user.profilePicture ? (
          <LinkUserAvatar
            userId={comment.user.id}
            size="sm"
            imageUrl={comment.user.profilePicture}
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
            <UserCircle className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="bg-muted rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {comment.user.firstName} {comment.user.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.content}</p>
        </div>
      </div>
    </div>
  );
} 