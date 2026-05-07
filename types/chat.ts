export type ChatSenderType = "client" | "admin";
export type ChatConversationStatus = "active" | "closed";

export interface ChatConversation {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  status: ChatConversationStatus;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: ChatSenderType;
  sender_name: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ChatConversationCreate {
  client_name: string;
  client_email?: string;
  client_phone?: string;
}

export interface ChatMessageCreate {
  conversation_id: string;
  sender_type: ChatSenderType;
  sender_name: string;
  message: string;
}

export interface ChatConversationWithLastMessage extends ChatConversation {
  last_message?: ChatMessage;
  unread_count?: number;
}
