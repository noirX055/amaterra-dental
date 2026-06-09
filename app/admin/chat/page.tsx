"use client";

import { useEffect, useState, useRef } from "react";
import { chatService } from "@/services/chatService";
import type { ChatConversationWithLastMessage, ChatMessage } from "@/types/chat";
import { useAdminLang } from "../_components/admin-lang-context";

export default function AdminChatPage() {
  const { t } = useAdminLang();
  const [conversations, setConversations] = useState<ChatConversationWithLastMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    cleanupOldConversations();
  }, []);

  useEffect(() => {
    // Подписываемся на обновления диалогов
    const unsubscribe = chatService.subscribeToConversations(() => {
      loadConversations();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(selectedConversation);

    // Подписываемся на новые сообщения
    const unsubscribe = chatService.subscribeToMessages(selectedConversation, (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();

      // Отмечаем сообщения клиента как прочитанные
      if (message.sender_type === "client") {
        chatService.markMessagesAsRead(selectedConversation, "client");
      }
    });

    // Отмечаем существующие сообщения как прочитанные
    chatService.markMessagesAsRead(selectedConversation, "client");

    return unsubscribe;
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function cleanupOldConversations() {
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase
        .from("chat_conversations")
        .delete()
        .lt("created_at", cutoff);
    } catch (err) {
      console.error("[chat-cleanup] Failed:", err);
    }
  }

  async function loadConversations() {
    try {
      const data = await chatService.getAllConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMessages(conversationId: string) {
    try {
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      await chatService.sendMessage({
        conversation_id: selectedConversation,
        sender_type: "admin",
        sender_name: t("chat.admin"),
        message: newMessage.trim(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(t("chat.sendError"));
    } finally {
      setIsSending(false);
    }
  }

  async function closeConversation(id: string) {
    if (!confirm(t("chat.closeConfirm"))) return;

    try {
      await chatService.closeConversation(id);
      loadConversations();
      if (selectedConversation === id) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to close conversation:", error);
      alert(t("chat.closeError"));
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("chat.justNow");
    if (minutes < 60) return t("chat.minutesAgo").replace("{n}", String(minutes));
    if (hours < 24) return t("chat.hoursAgo").replace("{n}", String(hours));
    if (days < 7) return t("chat.daysAgo").replace("{n}", String(days));

    return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col text-slate-100">
      <div className="flex flex-1 overflow-hidden rounded-2xl md:rounded-[28px] border border-slate-800 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1220] shadow-[0_24px_60px_rgba(2,6,23,0.6)]">
        {/* Conversations List */}
        <div className={`${selectedConversation ? "hidden md:flex" : "flex"} w-full md:w-80 flex-col border-r border-slate-800`}>
          {/* Header */}
          <div className="border-b border-slate-800/80 p-4 sm:p-6">
            <p className="text-sm font-medium text-emerald-400">{t("chat.support")}</p>
            <h1 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">{t("chat.title")}</h1>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                {t("chat.noConversations")}
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`w-full border-b border-slate-800/50 p-4 text-left transition hover:bg-slate-800/30 ${
                    selectedConversation === conv.id ? "bg-slate-800/50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{conv.client_name}</p>
                        {conv.unread_count! > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      {conv.last_message && (
                        <p className="mt-1 truncate text-sm text-slate-400">
                          {conv.last_message.message}
                        </p>
                      )}
                    </div>
                    <span className="ml-2 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(conv.last_message_at)}
                    </span>
                  </div>
                  {conv.status === "closed" && (
                    <span className="mt-2 inline-block rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                      {t("chat.closed")}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className={`flex flex-1 flex-col ${!selectedConversation ? "hidden md:flex" : "flex"}`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden -ml-2 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title={t("chat.back")}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                    {conversations.find((c) => c.id === selectedConversation)?.client_name}
                  </h2>
                  {conversations.find((c) => c.id === selectedConversation)?.client_email && (
                    <p className="text-xs sm:text-sm text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                      {conversations.find((c) => c.id === selectedConversation)?.client_email}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => closeConversation(selectedConversation)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-200 transition hover:bg-slate-700"
              >
                {t("chat.closeConv")}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender_type === "admin"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {msg.sender_type === "client" && (
                      <p className="mb-1 text-xs font-semibold text-slate-400">{msg.sender_name}</p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString("ru-RU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-800/80 p-4 sm:p-6 bg-slate-900/50">
              <div className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat.placeholder")}
                  className="flex-1 min-w-0 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 sm:px-4 sm:py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="rounded-xl bg-emerald-600 px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <span className="hidden sm:inline">{t("chat.send")}</span>
                  <svg className="sm:hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 mx-auto">
                <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-300">{t("chat.selectConv")}</p>
              <p className="mt-2 text-sm text-slate-400">
                {t("chat.selectConvDesc")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
