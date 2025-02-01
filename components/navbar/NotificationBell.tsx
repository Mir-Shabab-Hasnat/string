import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
  relatedId: string | null;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
      });
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handlePopoverChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      markNotificationsAsRead();
    }
  };

  const handleFriendRequest = async (notificationId: string, requestId: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/friend-request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error('Failed to process friend request');

      // Mark notification as read
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      toast.success(`Friend request ${action}ed successfully!`);
      fetchNotifications();
    } catch (error) {
      toast.error(`Failed to ${action} friend request`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-64">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50",
                    !notification.read && "bg-blue-50"
                  )}
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500">
                        {notification.content}
                      </p>
                    </div>
                  </div>
                  {notification.type === 'FRIEND_REQUEST' && !notification.read && (
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleFriendRequest(notification.id, notification.relatedId!, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFriendRequest(notification.id, notification.relatedId!, 'reject')}
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 