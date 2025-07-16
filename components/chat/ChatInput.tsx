"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Type your message...",
  maxLength = 1000,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // In a real implementation, you'd stop the recording and process the audio
    } else {
      // Start recording
      setIsRecording(true);
      // In a real implementation, you'd start voice recording
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-3 bg-white border border-gray-200 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-muted-foreground hover:text-gray-900"
          disabled={isLoading}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={isLoading}
          className="min-h-[20px] max-h-32 resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          rows={1}
        />

        {/* Voice recording button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "shrink-0",
            isRecording
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground hover:text-gray-900",
          )}
          onClick={handleVoiceRecording}
          disabled={isLoading}
        >
          {isRecording ? (
            <Square className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        {/* Send button */}
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!canSend}
          className={cn(
            "shrink-0 transition-all",
            canSend
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-100 text-gray-400",
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Character count */}
      {value.length > maxLength * 0.8 && (
        <div className="absolute -top-6 right-0 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute -top-8 left-0 flex items-center gap-2 text-sm text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Recording... Click to stop
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            AI is thinking...
          </div>
        </div>
      )}
    </div>
  );
}
