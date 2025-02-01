"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/nextjs";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: Participant;
}

interface Conversation {
  id: string;
  participants: Participant[];
  messages: Message[];
}

export default function ChatUI() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [ensureInitialized, setEnsureInitialized] = useState(false);

  // Replace the useEffect with this one
  useEffect(() => {
    if (user && !ensureInitialized) {
      setEnsureInitialized(true);
      fetch('/api/conversations/ensure', { method: 'POST' })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        })
        .catch(console.error);
    }
  }, [user, queryClient, ensureInitialized]);

  // Fetch conversations
  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
    enabled: !!user,
  });

  // Fetch messages for selected conversation
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["messages", selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const res = await fetch(`/api/conversations/${selectedConversation}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!selectedConversation,
    refetchInterval: 3000,
  });

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const res = await fetch(`/api/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageInput }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setMessageInput("");
      // Invalidate queries to refresh the messages
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <ScrollArea className="h-full">
          {conversations?.map((conversation) => {
            const otherParticipant = conversation.participants[0];
            return (
              <div
                key={conversation.id}
                className={`p-4 hover:bg-gray-100 cursor-pointer ${
                  selectedConversation === conversation.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={otherParticipant.profilePicture || undefined} />
                    <AvatarFallback>
                      {otherParticipant.firstName[0]}
                      {otherParticipant.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium">
                      {otherParticipant.firstName} {otherParticipant.lastName}
                    </p>
                    {conversation.messages?.[0] && (
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.messages[0].content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages?.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.senderId === user.id ? "justify-end" : ""
                    }`}
                  >
                    {message.senderId !== user.id && (
                      <Avatar>
                        <AvatarImage src={message.sender.profilePicture || undefined} />
                        <AvatarFallback>
                          {message.sender.firstName[0]}
                          {message.sender.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[70%] ${
                        message.senderId === user.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
} 