import { Message } from '@/types/chat';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          content={message.content}
          timestamp={message.timestamp}
          isOwn={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
}
