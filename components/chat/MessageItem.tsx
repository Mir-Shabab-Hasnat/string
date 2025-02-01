interface MessageProps {
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

export function MessageItem({ content, timestamp, isOwn }: MessageProps) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`rounded-lg px-4 py-2 max-w-[70%] ${
        isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <p>{content}</p>
        <span className="text-xs opacity-70">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
