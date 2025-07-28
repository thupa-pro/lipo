import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChatBubble, TypingIndicator } from "@/components/messages/chat-bubble";
import { Send, MoreVertical, Video, Paperclip, Smile, Circle, Filter, ArrowDown, AlertCircle, Brain, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Conversation {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar: string;
  status: "online" | "offline" | "away";
  rating: number;
  isTyping: boolean;
  isVerified: boolean;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  type: "text" | "image" | "file" | "quote" | "system";
  isOwn: boolean;
  quotedMessage?: {
    id: string;
    content: string;
    senderName: string;
  };
}

export default function EnhancedMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Mitchell",
      role: "House Cleaner",
      lastMessage: "I'll be there at 2 PM tomorrow with all supplies",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      unreadCount: 2,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      rating: 4.9,
      isTyping: false,
      isVerified: true,
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      role: "Handyman",
      lastMessage: "The repair work is completed successfully!",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "offline",
      rating: 4.8,
      isTyping: false,
      isVerified: true,
    },
    {
      id: "3",
      name: "Emma Thompson",
      role: "Personal Trainer",
      lastMessage: "Looking forward to our Friday session!",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      rating: 5.0,
      isTyping: true,
      isVerified: true,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm confirming our cleaning appointment for tomorrow.",
      senderId: "sarah-1",
      senderName: "Sarah Mitchell",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "read",
      type: "text",
      isOwn: false,
    },
    {
      id: "2",
      content: "Perfect! What time will you arrive?",
      senderId: "me",
      senderName: "Me",
      timestamp: new Date(Date.now() - 28 * 60 * 1000),
      status: "read",
      type: "text",
      isOwn: true,
    },
    {
      id: "3",
      content:
        "I'll be there at 2 PM tomorrow with all my eco-friendly supplies.",
      senderId: "sarah-1",
      senderName: "Sarah Mitchell",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: "read",
      type: "text",
      isOwn: false,
    },
    {
      id: "4",
      content: "Excellent! I'll make sure someone is home to let you in.",
      senderId: "me",
      senderName: "Me",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: "delivered",
      type: "text",
      isOwn: true,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    return conversations.filter(
      (conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  // Get current conversation
  const currentConversation = useMemo(() => {
    return conversations.find((conv) => conv.id === selectedConversation);
  }, [conversations, selectedConversation]);

  // Scroll to bottom with performance optimization
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle scroll events with throttling
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setIsAtBottom(isNearBottom);
    setShowScrollButton(!isNearBottom);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate typing indicators
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          isTyping: Math.random() > 0.95 ? !conv.isTyping : conv.isTyping,
        })),
      );

      // Simulate message status updates
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          status:
            msg.isOwn && msg.status === "sent" && Math.random() > 0.8
              ? ("delivered" as const)
              : msg.status,
        })),
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: "me",
      senderName: "Me",
      timestamp: new Date(),
      status: "sending",
      type: "text",
      isOwn: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // Simulate message sending
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "sent" as const } : msg,
        ),
      );
    }, 1000);

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? { ...conv, lastMessage: newMessage, timestamp: new Date() }
          : conv,
      ),
    );
  }, [newMessage, selectedConversation]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleReply = useCallback((message: Message) => {
    setNewMessage(`@${message.senderName} `);
  }, []);

  const handleReact = useCallback(
    (messageId: string, reaction: string) => {
      // Handle message reactions
      toast({
        title: "Reaction sent",
        description: `You reacted with ${reaction}`,
      });
    },
    [toast],
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Circle className="w-3 h-3 fill-emerald-500 text-emerald-500" />;
      case "away":
        return <Circle className="w-3 h-3 fill-amber-500 text-amber-500" />;
      default:
        return <Circle className="w-3 h-3 fill-slate-400 text-slate-400" />;
    }
  };

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Messages
                  </span>
                </h1>
                {totalUnread > 0 && (
                  <Badge className="bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                    {totalUnread} unread
                  </Badge>
                )}
              </div>
              <p className="text-slate-600 dark:text-gray-400">
                Connect with your service providers in real-time
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                <OptimizedIcon name="Shield" className="w-4 h-4 text-emerald-500" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <OptimizedIcon name="MessageSquare" className="w-5 h-5 text-blue-600 dark:text-violet-400" />
                  Conversations
                </CardTitle>
                <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredConversations.length}
                </Badge>
              </div>
              <div className="relative">
                <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-2xl border-slate-200 dark:border-white/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto max-h-[calc(100vh-20rem)]">
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-white/5 ${
                      selectedConversation === conversation.id
                        ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500"
                        : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-white dark:border-white/20 shadow-lg">
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white font-bold">
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                          conversation.status === "online"
                            ? "bg-emerald-500"
                            : conversation.status === "away"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                        }`}
                      />
                      {conversation.isVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <UIIcons.CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {conversation.name}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <OptimizedIcon name="Star" className="w-3 h-3 text-amber-400 fill-current" />
                          <span className="text-xs text-slate-500 dark:text-gray-400">
                            {conversation.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1 font-medium">
                        {conversation.role}
                      </p>

                      <p className="text-sm text-slate-600 dark:text-gray-400 truncate">
                        {conversation.isTyping ? (
                          <span className="text-blue-600 dark:text-blue-400 italic">
                            typing...
                          </span>
                        ) : (
                          conversation.lastMessage
                        )}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
                          <OptimizedIcon name="Clock" className="w-3 h-3" />
                          {conversation.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs h-5 min-w-5 rounded-full flex items-center justify-center px-1">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 bg-white/90 dark:bg-white/5 backdrop-blur-xl border-blue-200/50 dark:border-white/10 rounded-3xl shadow-lg flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-slate-200/50 dark:border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12 border-2 border-white dark:border-white/20 shadow-lg">
                          <AvatarImage
                            src={currentConversation.avatar}
                            alt={currentConversation.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white font-bold">
                            {currentConversation.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {currentConversation.isVerified && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <UIIcons.CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {currentConversation.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(currentConversation.status)}
                          <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">
                            {currentConversation.isTyping
                              ? "typing..."
                              : currentConversation.status}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            {currentConversation.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl"
                      >
                        <OptimizedIcon name="Phone" className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl"
                      >
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    onScroll={handleScroll}
                  >
                    {messages.map((message) => (
                      <ChatBubble
                        key={message.id}
                        message={message}
                        onReply={handleReply}
                        onReact={handleReact}
                      />
                    ))}

                    {currentConversation.isTyping && (
                      <TypingIndicator
                        senderName={currentConversation.name}
                        senderAvatar={currentConversation.avatar}
                      />
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Scroll to Bottom Button */}
                  {showScrollButton && (
                    <div className="absolute bottom-20 right-8">
                      <Button
                        size="sm"
                        onClick={scrollToBottom}
                        className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="border-t border-slate-200/50 dark:border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-2xl flex-shrink-0"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>

                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pr-12 rounded-2xl border-slate-200 dark:border-white/20"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-xl"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg flex-shrink-0 px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <OptimizedIcon name="MessageSquare" className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-gray-400 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-500 dark:text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
