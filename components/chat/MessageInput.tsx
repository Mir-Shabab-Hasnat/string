import { useState } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background"
        />
        <button 
          type="submit"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Send
        </button>
      </div>
    </form>
  );
}
