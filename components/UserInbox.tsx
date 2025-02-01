"use client";

import * as React from "react";
import { useState, JSX } from "react";
import { 
  Mail, 
  UserPlus, 
  X, 
  Bell, 
  MessageSquare, 
  Users, 
  Search,
  Plus,
  Check 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageList } from './chat/MessageList';
import { MessageInput } from './chat/MessageInput';
import { useUser } from "@clerk/nextjs";

type Notification = {
  id: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
};

export default function UserInbox() {
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSearchingFriends, setIsSearchingFriends] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string | null;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'search' | 'notifications' | 'chats' | 'communities'>('search');
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useUser();
  const currentUserId = user?.id;

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Searching for:', query); // Debug log
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log('Search results:', data); // Debug log
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    if (!currentUserId) {
      alert('Please log in to send friend requests');
      return;
    }

    try {
      // Send friend request
      const response = await fetch('/api/friend-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: currentUserId,
          recipientId: recipientId
        }),
      });

      if (response.ok) {
        // Create notification for recipient
        const notificationResponse = await fetch('/api/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipientId: recipientId,
            title: 'New Friend Request',
            content: `${user?.firstName} ${user?.lastName} sent you a friend request`,
            type: 'FRIEND_REQUEST'
          }),
        });

        if (notificationResponse.ok) {
          setPendingRequests([...pendingRequests, recipientId]);
          alert('Friend request sent successfully!');
        } else {
          console.error('Failed to create notification');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  React.useEffect(() => {
    if (activeSection === 'notifications') {
      fetchNotifications();
    }
  }, [activeSection]);

  const renderContent = () => {
    if (isSearchingFriends) {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <input
              type="search"
              placeholder="Search for friends..."
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchUsers(e.target.value);
              }}
            />
            <button
              onClick={() => setIsSearchingFriends(false)}
              className="ml-2 p-2 hover:bg-accent rounded-md"
              aria-label="Close friend search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-3 hover:bg-accent rounded-md cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex-shrink-0">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                          {user.firstName[0]}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{user.username}
                      </div>
                    </div>
                    {user.id !== currentUserId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendFriendRequest(user.id);
                        }}
                        className="p-2 hover:bg-accent rounded-full"
                        disabled={pendingRequests.includes(user.id)}
                      >
                        {pendingRequests.includes(user.id) ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Plus className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-muted-foreground text-center mt-4">
                No users found
              </div>
            ) : (
              <div className="text-muted-foreground text-center mt-4">
                Start typing to search for users
              </div>
            )}
          </div>
        </div>
      );
    }

    const sectionContent: Record<typeof activeSection, JSX.Element> = {
      search: (
        <div className="flex flex-col h-full">
          <div className="mt-2">
            <input
              type="search"
              placeholder="Search across everything..."
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>
          <div className="text-muted-foreground text-center mt-4">
            Enter a search term to find messages, notifications, or communities
          </div>
        </div>
      ),
      notifications: (
        <div className="flex flex-col h-full">
          <h3 className="font-medium mb-4">Notifications</h3>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.read ? 'bg-background' : 'bg-accent'
                  }`}
                >
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {notification.content}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-center mt-4">
              No new notifications
            </div>
          )}
        </div>
      ),
      chats: (
        <div className="flex flex-col h-full">
          <div className="mt-2">
            <input
              type="search"
              placeholder="Search messages..."
              className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
            />
          </div>
          {selectedConversation && currentUserId ? (
            <div className="flex flex-col h-[calc(100vh-150px)]">
              <MessageList messages={messages} currentUserId={currentUserId} />
              <MessageInput onSend={(content) => {/* Handle sending message */}} />
            </div>
          ) : (
            <div className="text-muted-foreground text-center mt-4">
              {currentUserId ? "Select a conversation to start chatting" : "Please log in to chat"}
            </div>
          )}
        </div>
      ),
      communities: (
        <div className="flex flex-col h-full">
          <h3 className="font-medium mb-4">Communities</h3>
          {/* Community items will go here */}
          <div className="text-muted-foreground text-center mt-4">
            No communities joined yet
          </div>
        </div>
      ),
    };

    return (
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="flex flex-col items-center justify-start py-4 border-r border-border w-10">
          <button
            onClick={() => setActiveSection('search')}
            className={`p-3 mb-4 rounded-md hover:bg-accent transition ${
              activeSection === 'search' ? 'bg-accent' : ''
            }`}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`p-3 mb-4 rounded-md hover:bg-accent transition ${
              activeSection === 'notifications' ? 'bg-accent' : ''
            }`}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveSection('chats')}
            className={`p-3 mb-4 rounded-md hover:bg-accent transition ${
              activeSection === 'chats' ? 'bg-accent' : ''
            }`}
            aria-label="Chats"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveSection('communities')}
            className={`p-3 rounded-md hover:bg-accent transition ${
              activeSection === 'communities' ? 'bg-accent' : ''
            }`}
            aria-label="Communities"
          >
            <Users className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 relative">
          {sectionContent[activeSection]}
          
          {/* Add Friend FAB */}
          <button
            onClick={() => setIsSearchingFriends(true)}
            className="absolute bottom-20 right-4 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition"
            aria-label="Add friend"
          >
            <UserPlus className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-accent transition"
          aria-label="Inbox"
        >
          <Mail className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className={`${isExpanded ? 'w-full' : 'w-[600px] sm:w-[800px]'} transition-all duration-300`}
      >
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>
              {isSearchingFriends ? "Find Friends" : 
                activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </SheetTitle>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-md hover:bg-accent transition"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? "↙" : "↗"}
            </button>
          </div>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}