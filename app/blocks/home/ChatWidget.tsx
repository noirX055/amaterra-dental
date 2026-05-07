"use client";

import { useEffect, useState, useRef } from "react";
import { chatService } from "@/services/chatService";
import type { ChatMessage } from "@/types/chat";
import type { Lang } from "./types";

interface Props {
  lang: Lang;
}

export function ChatWidget({ lang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [clientName, setClientName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const texts = {
    ru: {
      title: "Онлайн чат",
      placeholder: "Ваше имя",
      start: "Начать чат",
      messagePlaceholder: "Введите сообщение...",
      send: "Отправить",
    },
    ro: {
      title: "Chat online",
      placeholder: "Numele dvs.",
      start: "Începe chat",
      messagePlaceholder: "Introduceți mesajul...",
      send: "Trimite",
    },
    en: {
      title: "Online chat",
      placeholder: "Your name",
      start: "Start chat",
      messagePlaceholder: "Type a message...",
      send: "Send",
    },
  };

  const t = texts[lang];

  useEffect(() => {
    // Проверяем есть ли сохраненный ID диалога
    const savedId = localStorage.getItem("chat_conversation_id");
    if (savedId) {
      setConversationId(savedId);
      setIsStarted(true);
      loadMessages(savedId);
    }
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    // Подписываемся на новые сообщения
    const unsubscribe = chatService.subscribeToMessages(conversationId, (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return unsubscribe;
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadMessages(convId: string) {
    try {
      const msgs = await chatService.getMessages(convId);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  async function startChat() {
    if (!clientName.trim()) return;

    try {
      const conversation = await chatService.createConversation({
        client_name: clientName,
      });

      setConversationId(conversation.id);
      setIsStarted(true);
      localStorage.setItem("chat_conversation_id", conversation.id);
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert("Ошибка при создании чата");
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !conversationId) return;

    setIsSending(true);
    try {
      await chatService.sendMessage({
        conversation_id: conversationId,
        sender_type: "client",
        sender_name: clientName,
        message: newMessage.trim(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Ошибка при отправке сообщения");
    } finally {
      setIsSending(false);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStarted) {
        sendMessage();
      } else {
        startChat();
      }
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-500"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-emerald-600 px-4 py-3 text-white">
            <h3 className="font-semibold">{t.title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-emerald-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isStarted ? (
            /* Start Chat Form */
            <div className="flex flex-1 flex-col items-center justify-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="mb-4 w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
              />
              <button
                onClick={startChat}
                disabled={!clientName.trim()}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {t.start}
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 flex ${msg.sender_type === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        msg.sender_type === "client"
                          ? "bg-emerald-600 text-white"
                          : "bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      {msg.sender_type === "admin" && (
                        <p className="mb-1 text-xs font-semibold opacity-70">{msg.sender_name}</p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-zinc-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.messagePlaceholder}
                    className="flex-1 rounded-xl border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {t.send}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
