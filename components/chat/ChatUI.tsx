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
import { Card } from "@/components/ui/card";

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

  useEffect(() => {
    if (user) {
      fetch('/api/conversations/ensure', { method: 'POST' })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        })
        .catch(console.error);
    }
  }, [user, queryClient]);

  const { data: conversations } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return res.json();
    },
    enabled: !!user,
  });

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
      queryClient.invalidateQueries({ queryKey: ["messages", selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
      {/* Conversations List */}
      <Card className="w-[350px] border-r flex flex-col shrink-0 md:block hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
          {conversations?.map((conversation) => {
            const otherParticipant = conversation.participants[0];
            return (
              <div
                key={conversation.id}
                className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                  selectedConversation === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={otherParticipant.profilePicture || undefined} />
                    <AvatarFallback>
                      {otherParticipant.firstName[0]}
                      {otherParticipant.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {otherParticipant.firstName} {otherParticipant.lastName}
                    </p>
                    {conversation.messages?.[0] && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.messages[0].content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-background min-w-0">
        {selectedConversation ? (
          <>
            <div className="border-b p-4">
              {conversations?.find(c => c.id === selectedConversation)?.participants[0] && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={conversations.find(c => c.id === selectedConversation)?.participants[0].profilePicture || undefined} 
                    />
                    <AvatarFallback>
                      {conversations.find(c => c.id === selectedConversation)?.participants[0].firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {conversations.find(c => c.id === selectedConversation)?.participants[0].firstName}{' '}
                      {conversations.find(c => c.id === selectedConversation)?.participants[0].lastName}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-6xl mx-auto">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderId !== user.id && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={message.sender.profilePicture || undefined} />
                        <AvatarFallback>
                          {message.sender.firstName[0]}
                          {message.sender.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[60%] ${
                        message.senderId === user.id
                          ? "bg-primary text-primary-foreground ml-12"
                          : "bg-accent mr-12"
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                      <p className="text-[10px] mt-1 opacity-70">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2 max-w-6xl mx-auto"
              >
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
