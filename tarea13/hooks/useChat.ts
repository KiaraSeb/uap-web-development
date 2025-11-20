/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";

import type { CustomMessage } from "@/types";
import type { LegacyMessage } from "@/types";
import type { Task, TaskStats } from "@/types";

const STORAGE_KEY = "chat_conversation_v1";

export function useEnhancedChat() {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("user_tasks")
          : null;
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<TaskStats | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("user_tasks", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // --------------------------------------
  // ENVÍO DEL MENSAJE → BACKEND STREAMING
  // --------------------------------------
  const sendMessage = useCallback(
    async (content: string) => {
      // 1) Crear el mensaje del usuario local
      const userMsg: CustomMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text: content }],
      };

      // 2) Agregarlo inmediatamente a estado
      setMessages((prev) => [...prev, userMsg]);

      // 3) Construir mensajes para OpenRouter SIN usar 'messages' viejo
      const formattedMessages = [
        ...messages.map((m) => ({
          role: m.role,
          content: m.parts
            ?.map((p) => (p.type === "text" ? p.text : ""))
            .join("") ?? "",
        })),
        {
          role: "user",
          content,
        },
      ];

      const abortController = new AbortController();
      abortRef.current = abortController;
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
          body: JSON.stringify({ messages: formattedMessages }),
        });

        if (!res.body) throw new Error("No stream response from backend");

        // Crear mensaje del assistant
        const assistantId = crypto.randomUUID();
        let accumText = "";

        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            parts: [{ type: "text", text: "" }],
          },
        ]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        // STREAMING
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumText += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, parts: [{ type: "text", text: accumText }] }
                : m
            )
          );
        }

        // Extraer tasks / stats si vienen
        try {
          if (accumText.includes('"tasks":')) {
            const match = accumText.match(/"tasks":\s*(\[.*?\])/);
            if (match) setTasks(JSON.parse(match[1]));
          }
          if (accumText.includes('"summary":')) {
            const match = accumText.match(/"summary":\s*({.*?})/);
            if (match) setStats(JSON.parse(match[1]));
          }
        } catch {}
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.warn("Streaming aborted");
        } else {
          console.error("Error in streaming:", err);
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages]
  );

  const onSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;

      const text = input;
      setInput("");
      await sendMessage(text);
    },
    [input, sendMessage]
  );

  const clear = useCallback(() => {
    setMessages([]);
    setTasks([]);
    setStats(null);
    setInput("");
    try {
      localStorage.removeItem("user_tasks");
    } catch {}
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    input,
    setInput,
    onSubmit,
    sendMessage,
    clear,
    stop,
    isLoading,
    tasks,
    stats,
  };
}

// ------------------------------------------
// HOOK LOCAL (igual que antes)
// ------------------------------------------
export function useLocalChat() {
  const [messages, setMessages] = useState<LegacyMessage[]>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? sessionStorage.getItem(STORAGE_KEY)
          : null;
      return raw ? (JSON.parse(raw) as LegacyMessage[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const addMessage = useCallback((m: LegacyMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const setLastMessageContent = useCallback(
    (id: string, content: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content } : m))
      );
    },
    []
  );

  const clear = useCallback(() => {
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { messages, addMessage, setLastMessageContent, clear };
}
