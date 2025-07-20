"use client";

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Bot, 
  Command,
  Lightbulb,
  MessageCircle,
  Search,
  Calendar,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AgentResponse {
  type: 'text' | 'action' | 'ui' | 'redirect' | 'form';
  content: string;
  data?: any;
  actions?: any[];
}

interface Command {
  command: string;
  description: string;
  example: string;
}

interface AgentCommandInputProps {
  placeholder?: string;
  className?: string;
  onResponse?: (response: AgentResponse) => void;
  currentPage?: string;
}

export default function AgentCommandInput({ 
  placeholder = "Ask me anything or use /commands...", 
  className = "",
  onResponse,
  currentPage = "unknown"
}: AgentCommandInputProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load suggestions and commands on mount
  useEffect(() => {
    loadSuggestions();
    loadCommands();
  }, [session]);

  // Show agent popup when user types slash
  useEffect(() => {
    if (input.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [input]);

  const loadSuggestions = async () => {
    if (!session) return;
    
    try {
      const response = await fetch(`/api/ai/agent?action=suggestions&page=${currentPage}`);
      if (response.ok) {
        const { suggestions } = await response.json();
        setSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const loadCommands = async () => {
    try {
      const response = await fetch('/api/ai/agent?action=commands');
      if (response.ok) {
        const { commands } = await response.json();
        setCommands(commands);
      }
    } catch (error) {
      console.error('Error loading commands:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setShowAgent(true);

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim(),
          context: {
            currentPage,
            location: 'New York', // In real app, get from geolocation
          },
        }),
      });

      if (response.ok) {
        const { response: agentResponse } = await response.json();
        setResponse(agentResponse);
        onResponse?.(agentResponse);
        
        // Clear input after successful response
        setInput('');
        
        // Reload suggestions after interaction
        setTimeout(loadSuggestions, 1000);
      } else {
        setResponse({
          type: 'text',
          content: 'Sorry, I encountered an error. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error sending to agent:', error);
      setResponse({
        type: 'text',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommandSelect = (command: Command) => {
    setInput(`/${command.command} `);
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const filteredCommands = commands.filter(cmd => 
    input.length > 1 ? cmd.command.toLowerCase().includes(input.slice(1).toLowerCase()) : true
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* Suggestions Row */}
      {suggestions.length > 0 && !input && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex flex-wrap gap-2"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 mb-1">
            <Lightbulb className="w-3 h-3" />
            Suggested:
          </div>
          {suggestions.map((suggestion, index) => (
            <Badge
              key={index}
              variant="outline"
              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Main Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : input.startsWith('/') ? (
              <Command className="w-4 h-4 text-purple-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600" />
            )}
          </div>
          
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-12 h-12 text-base bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-slate-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Slash Commands Dropdown */}
        <AnimatePresence>
          {showCommands && filteredCommands.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-slate-200 dark:border-gray-700 shadow-xl">
                <CardContent className="p-2">
                  <div className="flex items-center gap-2 px-2 py-1 mb-2 text-xs text-slate-600 dark:text-gray-400">
                    <Command className="w-3 h-3" />
                    Available Commands
                  </div>
                  <div className="space-y-1">
                    {filteredCommands.map((command) => (
                      <motion.div
                        key={command.command}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        className="px-3 py-2 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleCommandSelect(command)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">/{command.command}</div>
                            <div className="text-xs text-slate-500 dark:text-gray-400">
                              {command.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {command.example}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Agent Response */}
      <AnimatePresence>
        {showAgent && response && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-slate-800 dark:text-gray-200">
                        Loconomy Assistant
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAgent(false)}
                        className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="text-sm text-slate-700 dark:text-gray-300 whitespace-pre-wrap">
                      {response.content}
                    </div>
                    
                    {/* Action Buttons */}
                    {response.actions && response.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {response.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              // Handle action
                              console.log('Action:', action);
                            }}
                          >
                            {action.type === 'search' && <Search className="w-3 h-3 mr-1" />}
                            {action.type === 'book' && <Calendar className="w-3 h-3 mr-1" />}
                            {action.type === 'notification' && <MessageCircle className="w-3 h-3 mr-1" />}
                            {action.type.replace('_', ' ')}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}