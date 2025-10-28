"use client";
import React from "react";
import { Message } from "@/types";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  m: Message;
}

export default function MessageItem({ m }: MessageItemProps) {
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

      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm"
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MessageContent content={m.content} />
          </div>
        </div>
        <span className="text-xs text-slate-500 mt-1 px-1">
          {new Date(m.createdAt).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.trim().startsWith("```")) {
          return null;
        }

        if (line.trim().startsWith("- ")) {
          return (
            <li key={i} className="ml-4">
              {line.substring(2)}
            </li>
          );
        }

        if (line.match(/^\d+\./)) {
          return (
            <li key={i} className="ml-4 list-decimal">
              {line.substring(line.indexOf(".") + 1).trim()}
            </li>
          );
        }

        const boldText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        const italicText = boldText.replace(/\*(.*?)\*/g, "<em>$1</em>");
        const codeText = italicText.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-slate-700 px-1 rounded">$1</code>');

        if (line.trim() === "") {
          return <br key={i} />;
        }

        return (
          <p
            key={i}
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: codeText }}
          />
        );
      })}
    </div>
  );
}
