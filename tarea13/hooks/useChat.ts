"use client";
import { useEffect, useState, useCallback } from "react";
import { Message } from "@/types";

const STORAGE_KEY = "chat_conversation_v1";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) as Message[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const addMessage = useCallback((m: Message) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const setLastMessageContent = useCallback((id: string, content: string) => {
    setMessages((prev) => prev.map(m => m.id === id ? { ...m, content } : m));
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { messages, addMessage, setLastMessageContent, clear };
}
