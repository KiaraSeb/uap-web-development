"use client";
import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import MessageItem from "./Mensaje";
import InputBox from "./InputBox";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Square, MessageSquare } from "lucide-react";

export default function Chat() {
  const { messages, addMessage, setLastMessageContent, clear } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    const safeText = text.slice(0, 2000);
    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: safeText,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);

    const assistantId = uuidv4();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };
    addMessage(assistantMsg);

    setIsTyping(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: userMsg.role, content: userMsg.content },
          ],
        }),
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error en la API del servidor");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No hay stream disponible");

      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const jsonStr = part.replace(/^data:\s*/, "").trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);
            const delta = data?.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setLastMessageContent(assistantId, assistantText);
            }
          } catch {
          }
        }
      }

      setIsTyping(false);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      setIsTyping(false);
      const errorMessage = err instanceof Error ? err.message : "unknown";
      setLastMessageContent(assistantId, `⚠️ Error: ${errorMessage}`);
    } finally {
      abortRef.current = null;
    }
  }

  function handleClear() {
    clear();
    abortRef.current?.abort();
  }

  function handleStop() {
    abortRef.current?.abort();
    setIsTyping(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Tu amigo el Chat</h2>
          </div>
          <div className="flex gap-2">
            {isTyping && (
              <Button
                onClick={handleStop}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Detener
              </Button>
            )}
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Empieza una conversación</p>
              <p className="text-sm mt-2">Escribe un mensaje para comenzar</p>
            </div>
          )}
          {messages.map((m) => (
            <MessageItem key={m.id} m={m} />
          ))}
          {isTyping && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 flex-shrink-0">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t bg-slate-50 dark:bg-slate-900">
          <InputBox onSend={sendMessage} disabled={isTyping} />
        </div>
      </Card>
    </div>
  );
}
