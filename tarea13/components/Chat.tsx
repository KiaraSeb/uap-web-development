// components/Chat.tsx
"use client";
import React, { useRef, useEffect, useCallback } from "react";
import { useEnhancedChat } from "@/hooks/useChat";
import MessageItem from "./Mensaje";
import InputBox from "./InputBox";
import { TaskList } from "./TaskList";
import { StatsDisplay } from "./StatsDisplay";
import type { CustomMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Square, MessageSquare } from "lucide-react";

export default function Chat() {
  const {
    messages,
    input,
    setInput,
    onSubmit,
    isLoading,
    tasks,
    stats,
    clear,
    stop
  } = useEnhancedChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, tasks, stats, isLoading]);

  // Limpiar conversación
  function handleClear() {
    clear();
  }

  // Detener streaming
  function handleStop() {
    stop();
  }

  // Enviar mensaje manual
  const handleSend = useCallback(() => {
    if (input.trim()) {
      onSubmit();
    }
  }, [input, onSubmit]);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-4 border-b bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-lg">Tu AI Todo Manager</h2>
          </div>

          <div className="flex gap-2">
            {isLoading && (
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
          {/* Estado inicial */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Empieza a gestionar tus tareas</p>
              <p className="text-sm mt-2">Escribe un mensaje como: Agrega tarea comprar leche</p>
            </div>
          )}

          {/* Mensajes */}
          {messages.map((m: CustomMessage) => (
            <MessageItem key={m.id} m={m} />
          ))}

          {/* Lista de tareas */}
          {tasks.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Tareas Actuales:</h3>
              <TaskList tasks={tasks} />
            </div>
          )}

          {/* Estadísticas */}
          {stats && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-2">Estadísticas:</h3>
              <StatsDisplay stats={stats} />
            </div>
          )}

          {/* Loader */}
          {isLoading && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 flex-shrink-0">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
              <span className="text-sm text-slate-400">Pensando...</span>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-900">
          <InputBox
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSend={handleSend}
            disabled={isLoading}
          />
        </div>
      </Card>
    </div>
  );
}
