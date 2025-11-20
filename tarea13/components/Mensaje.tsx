/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import type { CustomMessage } from "@/types";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  m: CustomMessage;
}

export default function MessageItem({ m }: MessageItemProps) {
  const content =
    m.parts
      ?.filter((p) => p.type === "text")
      .map((p: any) => p.text)
      .join("") ?? "";

  const toolResults =
    m.parts
      ?.filter((p) => p.type === "tool-result")
      .map((p: any) => JSON.stringify(p.content, null, 2)) ?? [];

  const createdAt = (m as any).createdAt || new Date().toISOString();
  const isUser = m.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 mb-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
          isUser ? "bg-blue-600" : "bg-slate-700"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>

      <div className={cn("flex flex-col max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MessageContent content={content} />

            {toolResults.length > 0 && (
              <div className="mt-2 p-2 bg-slate-200 dark:bg-slate-700 rounded text-xs overflow-auto">
                <strong>Tool Results:</strong>
                <pre>{toolResults.join("\n\n")}</pre>
              </div>
            )}
          </div>
        </div>

        <span className="text-xs text-slate-500 mt-1 px-1">
          {new Date(createdAt).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // 🟢 Dividimos entre bloques normales y bloques de código
  const blocks = content.split(/```/g);

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        // 🟣 Si el índice es impar → bloque de código
        const isCode = i % 2 === 1;

        if (isCode) {
          return (
            <pre
              key={i}
              className="bg-slate-200 dark:bg-slate-700 p-3 rounded text-xs overflow-auto"
            >
              <code>{block}</code>
            </pre>
          );
        }

        // 🔵 Texto normal
        return block
          .split("\n")
          .filter((line) => line.trim() !== "")
          .map((line, j) => <p key={`${i}-${j}`}>{line}</p>);
      })}
    </div>
  );
}
