import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, UserX, Loader2, UserCircleIcon } from "lucide-react";
import { toast } from "sonner";

type FriendStatus = {
  status: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestId: string | null;
  isOutgoing: boolean;
};

export function FriendRequestButton({ userId }: { userId: string }) {
  const [status, setStatus] = useState<FriendStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFriendStatus();
  }, [userId]);

  const fetchFriendStatus = async () => {
    try {
      const response = await fetch(`/api/friend-request/status?userId=${userId}`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching friend status:", error);
    }
  };

  const sendFriendRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      });

      if (!response.ok) throw new Error('Failed to send friend request');

      setStatus({
        status: 'PENDING',
        requestId: null,
        isOutgoing: true,
      });
      toast.success("Friend request sent successfully!");
    } catch (error) {
      toast.error("Failed to send friend request");
    } finally {
      setIsLoading(false);
    }
  };

  if (!status) {
    return (
      <Button size="lg" className="w-full" disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  if (status.status === 'ACCEPTED') {
    return (
      <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" disabled>
        <UserCheck className="w-4 h-4 mr-2" />
        Friends
      </Button>
    );
  }

  if (status.status === 'PENDING') {
    return (
      <Button size="lg" className="w-full" disabled>
        <UserCircleIcon className="w-4 h-4 mr-2" />
        {status.isOutgoing ? 'Request Sent' : 'Respond to Request'}
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={sendFriendRequest}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <UserPlus className="w-4 h-4 mr-2" />
      )}
      Add Friend
    </Button>
  );
} 