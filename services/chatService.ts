import { createClient } from "@/lib/supabase/client";
import type {
  ChatConversation,
  ChatMessage,
  ChatConversationCreate,
  ChatMessageCreate,
  ChatConversationWithLastMessage,
} from "@/types/chat";

class ChatService {
  // Создать новый диалог
  async createConversation(data: ChatConversationCreate): Promise<ChatConversation> {
    const supabase = createClient();
    const { data: conversation, error } = await supabase
      .from("chat_conversations")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return conversation;
  }

  // Получить все диалоги (для админа)
  async getAllConversations(): Promise<ChatConversationWithLastMessage[]> {
    const supabase = createClient();

    const { data: conversations, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error) throw error;

    // Получить последнее сообщение и количество непрочитанных для каждого диалога
    const conversationsWithData = await Promise.all(
      conversations.map(async (conv) => {
        const { data: lastMessage } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const { count: unreadCount } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("sender_type", "client")
          .eq("read", false);

        return {
          ...conv,
          last_message: lastMessage || undefined,
          unread_count: unreadCount || 0,
        };
      })
    );

    return conversationsWithData;
  }

  // Получить диалог по ID
  async getConversationById(id: string): Promise<ChatConversation | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  // Закрыть диалог
  async closeConversation(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_conversations")
      .update({ status: "closed" })
      .eq("id", id);

    if (error) throw error;
  }

  // Получить сообщения диалога
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }

  // Отправить сообщение
  async sendMessage(data: ChatMessageCreate): Promise<ChatMessage> {
    const supabase = createClient();
    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return message;
  }

  // Отметить сообщения как прочитанные
  async markMessagesAsRead(conversationId: string, senderType: "client" | "admin"): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .eq("sender_type", senderType)
      .eq("read", false);

    if (error) throw error;
  }

  // Подписаться на новые сообщения в диалоге
  subscribeToMessages(
    conversationId: string,
    callback: (message: ChatMessage) => void
  ) {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Подписаться на обновления диалогов (для админа)
  subscribeToConversations(callback: () => void) {
    const supabase = createClient();

    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_conversations",
        },
        () => {
          callback();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const chatService = new ChatService();
