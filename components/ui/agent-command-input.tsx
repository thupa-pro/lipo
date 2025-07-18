"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff, 
  Loader2, 
  Zap, 
  Calendar,
  DollarSign,
  AlertTriangle,
  X,
  ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Command {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "booking" | "payment" | "support" | "general";
  requiresConfirmation?: boolean;
}

interface AgentCommandInputProps {
  onSendMessage: (message: string, command?: Command) => void;
  onCommandExecute: (command: string, args: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showVoiceInput?: boolean;
  showCommandSuggestions?: boolean;
  maxLength?: number;
}

const AVAILABLE_COMMANDS: Command[] = [
  {
    name: "book",
    description: "Book a service or appointment",
    icon: Calendar,
    category: "booking"
  },
  {
    name: "cancel",
    description: "Cancel an existing booking",
    icon: X,
    category: "booking",
    requiresConfirmation: true
  },
  {
    name: "tip",
    description: "Add a tip to your provider",
    icon: DollarSign,
    category: "payment"
  },
  {
    name: "escalate",
    description: "Escalate an issue to support",
    icon: AlertTriangle,
    category: "support",
    requiresConfirmation: true
  },
  {
    name: "reschedule",
    description: "Reschedule an existing booking",
    icon: Calendar,
    category: "booking"
  },
  {
    name: "review",
    description: "Leave a review for a service",
    icon: ArrowUp,
    category: "general"
  }
];

export function AgentCommandInput({
  onSendMessage,
  onCommandExecute,
  placeholder = "Type a message or use / for commands...",
  disabled = false,
  className,
  showVoiceInput = true,
  showCommandSuggestions = true,
  maxLength = 2000
}: AgentCommandInputProps) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse commands from input
  const parseCommand = useCallback((input: string): { command?: Command; args: string[] } => {
    if (!input.startsWith('/')) return { args: [] };
    
    const parts = input.slice(1).split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    const command = AVAILABLE_COMMANDS.find(cmd => cmd.name === commandName);
    return { command, args };
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setCursorPosition(e.target.selectionStart);

    // Show command suggestions when typing /
    if (newValue.startsWith('/') && showCommandSuggestions) {
      const commandPart = newValue.slice(1).toLowerCase();
      const filtered = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.name.toLowerCase().startsWith(commandPart)
      );
      setFilteredCommands(filtered);
      setShowCommands(filtered.length > 0);
    } else {
      setShowCommands(false);
      setSelectedCommand(null);
    }
  };

  // Handle command selection
  const selectCommand = (command: Command) => {
    setValue(`/${command.name} `);
    setSelectedCommand(command);
    setShowCommands(false);
    textareaRef.current?.focus();
  };

  // Handle sending message
  const handleSend = () => {
    if (!value.trim() || disabled) return;

    const { command, args } = parseCommand(value);
    
    if (command) {
      // Execute command
      onCommandExecute(command.name, args);
      if (command.requiresConfirmation) {
        // You could show a confirmation dialog here
      }
    } else {
      // Send regular message
      onSendMessage(value, selectedCommand);
    }

    setValue("");
    setSelectedCommand(null);
    setShowCommands(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setShowCommands(false);
      setSelectedCommand(null);
    } else if (e.key === 'ArrowDown' && showCommands && filteredCommands.length > 0) {
      e.preventDefault();
      // Handle command navigation
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.webkitSpeechRecognition) return;
    
    try {
      setIsRecording(true);
      // Implement voice recording logic here
      // This would integrate with Web Speech API or similar
    } catch (error) {
      console.error("Voice recording failed:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording and process speech
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const isCommand = value.startsWith('/');
  const { command } = parseCommand(value);

  return (
    <div className={cn("relative", className)}>
      {/* Command Suggestions */}
      {showCommands && filteredCommands.length > 0 && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
          <div className="p-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground">Commands</span>
          </div>
          {filteredCommands.map((cmd) => (
            <button
              key={cmd.name}
              onClick={() => selectCommand(cmd)}
              className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left transition-colors"
            >
              <cmd.icon className="w-4 h-4 text-primary" />
              <div className="flex-1">
                <div className="font-medium text-sm">/{cmd.name}</div>
                <div className="text-xs text-muted-foreground">{cmd.description}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                {cmd.category}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Selected Command Indicator */}
      {selectedCommand && (
        <div className="absolute -top-8 left-0 right-0">
          <Badge variant="secondary" className="gap-1">
            <selectedCommand.icon className="w-3 h-3" />
            Command: {selectedCommand.name}
          </Badge>
        </div>
      )}

      {/* Main Input Area */}
      <div className={cn(
        "flex items-end gap-2 p-3 bg-background border border-border rounded-lg",
        "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30",
        isCommand && "ring-2 ring-blue-500/20 border-blue-500/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        {/* Command Indicator */}
        {isCommand && (
          <div className="flex-shrink-0 mb-1">
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
        )}

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[40px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 p-0",
            "placeholder:text-muted-foreground"
          )}
          maxLength={maxLength}
        />

        {/* Voice Input Button */}
        {showVoiceInput && (
          <Button
            variant="ghost"
            size="sm"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            className={cn(
              "flex-shrink-0 h-8 w-8 p-0",
              isRecording && "bg-red-500 text-white hover:bg-red-600"
            )}
            disabled={disabled}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSend}
          size="sm"
          disabled={!value.trim() || disabled}
          className="flex-shrink-0 h-8 w-8 p-0"
        >
          {disabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Character Count */}
      {maxLength && (
        <div className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </div>
      )}

      {/* Command Help */}
      {isCommand && command && (
        <div className="absolute -bottom-16 left-0 right-0 p-2 bg-muted/50 border border-border rounded text-xs text-muted-foreground">
          <strong>/{command.name}</strong> - {command.description}
          {command.requiresConfirmation && (
            <span className="text-amber-600 ml-2">(requires confirmation)</span>
          )}
        </div>
      )}
    </div>
  );
}