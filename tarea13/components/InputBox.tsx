// components/InputBox.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface InputBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (text: string) => void; // Recibe string, no event
  disabled: boolean;
}

export default function InputBox({ value, onChange, onSend, disabled }: InputBoxProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value); // Envía el value como string
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder="Escribe tu mensaje..."
        disabled={disabled}
        className="flex-1"
      />
      <Button onClick={() => onSend(value)} disabled={disabled || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}