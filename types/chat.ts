export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  conversationId: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  timestamp: Date;
} 