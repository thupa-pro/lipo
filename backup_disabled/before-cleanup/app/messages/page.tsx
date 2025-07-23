"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Star,
  MapPin,
  Calendar,
  Image as ImageIcon,
  File,
  Download,
  Check,
  CheckCheck,
  Circle,
  Smile,
  Shield,
  Users,
  Archive,
  Trash2,
  Flag,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  timestamp: Date;
  type: "text" | "image" | "file" | "booking_update" | "system";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  readBy: string[];
  bookingId?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantImage?: string;
  participantRole: "customer" | "provider";
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isTyping: boolean;
  bookingId?: string;
  serviceTitle?: string;
  messages: Message[];
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const mockConversations: Conversation[] = [
    {
      id: "1",
      participantId: "customer-1",
      participantName: "Jessica Thompson",
      participantImage: "/api/placeholder/40/40",
      participantRole: "customer",
      lastMessage: "Thank you for the excellent cleaning service!",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 0,
      isOnline: true,
      isTyping: false,
      bookingId: "booking-1",
      serviceTitle: "Professional House Cleaning",
      messages: [
        {
          id: "msg-1",
          content: "Hi! I have a question about the cleaning service I booked.",
          senderId: "customer-1",
          senderName: "Jessica Thompson",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: "text",
          readBy: ["provider-1"],
        },
        {
          id: "msg-2",
          content: "Hi Jessica! I'd be happy to help. What would you like to know?",
          senderId: "provider-1",
          senderName: "Sarah Johnson",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
          type: "text",
          readBy: ["customer-1"],
        },
        {
          id: "msg-3",
          content: "Your booking for Professional House Cleaning has been confirmed for Jan 16, 2024 at 10:00 AM",
          senderId: "system",
          senderName: "Loconomy",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          type: "booking_update",
          readBy: ["customer-1", "provider-1"],
          bookingId: "booking-1",
        },
        {
          id: "msg-4",
          content: "Thank you for the excellent cleaning service!",
          senderId: "customer-1",
          senderName: "Jessica Thompson",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: "text",
          readBy: [],
        },
      ],
    },
    {
      id: "2",
      participantId: "customer-2",
      participantName: "Michael Rodriguez",
      participantImage: "/api/placeholder/40/40",
      participantRole: "customer",
      lastMessage: "What time works best for you tomorrow?",
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 2,
      isOnline: false,
      isTyping: false,
      bookingId: "booking-2",
      serviceTitle: "Deep House Cleaning",
      messages: [
        {
          id: "msg-5",
          content: "Hi! I'd like to reschedule our appointment.",
          senderId: "customer-2",
          senderName: "Michael Rodriguez",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          type: "text",
          readBy: ["provider-1"],
        },
        {
          id: "msg-6",
          content: "What time works best for you tomorrow?",
          senderId: "customer-2",
          senderName: "Michael Rodriguez",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: "text",
          readBy: [],
        },
      ],
    },
    {
      id: "3",
      participantId: "customer-3",
      participantName: "Tech Startup Inc.",
      participantImage: "/api/placeholder/40/40",
      participantRole: "customer",
      lastMessage: "Perfect! See you at 2 PM.",
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
      bookingId: "booking-3",
      serviceTitle: "Office Deep Clean",
      messages: [
        {
          id: "msg-7",
          content: "We're confirmed for the office cleaning tomorrow at 2 PM, correct?",
          senderId: "customer-3",
          senderName: "Tech Startup Inc.",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          type: "text",
          readBy: ["provider-1"],
        },
        {
          id: "msg-8",
          content: "Yes, that's correct! I'll bring all the necessary equipment.",
          senderId: "provider-1",
          senderName: "Sarah Johnson",
          senderImage: "/api/placeholder/40/40",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 30 * 60 * 1000),
          type: "text",
          readBy: ["customer-3"],
        },
        {
          id: "msg-9",
          content: "Perfect! See you at 2 PM.",
          senderId: "customer-3",
          senderName: "Tech Startup Inc.",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: "text",
          readBy: ["provider-1"],
        },
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading and real-time updates
    setTimeout(() => {
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0].id);
      }
      setIsLoading(false);
    }, 1000);

    // Simulate typing indicators
    const typingInterval = setInterval(() => {
      const randomConv = mockConversations[Math.floor(Math.random() * mockConversations.length)];
      if (Math.random() > 0.7) {
        setTypingUsers(prev => {
          const newTyping = [...prev];
          if (!newTyping.includes(randomConv.participantId)) {
            newTyping.push(randomConv.participantId);
          }
          return newTyping;
        });
        
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== randomConv.participantId));
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation, conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: session?.user?.id || "current-user",
      senderName: session?.user?.name || "You",
      senderImage: session?.user?.image,
      timestamp: new Date(),
      type: "text",
      readBy: [],
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, newMsg],
          lastMessage: newMessage,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));

    setNewMessage("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeConversation) return;

    const fileMsg: Message = {
      id: `msg-${Date.now()}`,
      content: `Sent ${file.name}`,
      senderId: session?.user?.id || "current-user",
      senderName: session?.user?.name || "You",
      senderImage: session?.user?.image,
      timestamp: new Date(),
      type: file.type.startsWith('image/') ? "image" : "file",
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      readBy: [],
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [...conv.messages, fileMsg],
          lastMessage: `Sent ${file.name}`,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));
  };

  const formatMessageTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId === session?.user?.id) {
      if (message.readBy.length === 0) {
        return <Circle className="w-3 h-3 text-gray-400" fill="currentColor" />;
      } else {
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      }
    }
    return null;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.serviceTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-2xl mx-auto p-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="lg:col-span-2 h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-screen-2xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with your customers and providers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    All
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Unread
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Archived
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        activeConversation === conversation.id
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={conversation.participantImage} />
                            <AvatarFallback>
                              {conversation.participantName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                              conversation.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {conversation.participantName}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.lastMessageTime)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1 truncate">
                            {conversation.serviceTitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.isTyping || typingUsers.includes(conversation.participantId)
                                ? "Typing..."
                                : conversation.lastMessage}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2 h-5 px-2 text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {activeConv ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={activeConv.participantImage} />
                          <AvatarFallback>
                            {activeConv.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            activeConv.isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{activeConv.participantName}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className={activeConv.isOnline ? "text-green-600" : ""}>
                            {activeConv.isOnline ? "Online" : "Offline"}
                          </span>
                          {activeConv.serviceTitle && (
                            <>
                              <span>•</span>
                              <span>{activeConv.serviceTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive Chat
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="w-4 h-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {activeConv.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.senderId === session?.user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.type === "booking_update" ? (
                          <div className="flex justify-center w-full">
                            <div className="bg-muted rounded-lg p-3 max-w-md text-center">
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Booking Update</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{message.content}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className={`flex gap-2 max-w-md ${
                            message.senderId === session?.user?.id ? "flex-row-reverse" : ""
                          }`}>
                            {message.senderId !== session?.user?.id && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={message.senderImage} />
                                <AvatarFallback>
                                  {message.senderName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`rounded-lg p-3 ${
                              message.senderId === session?.user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}>
                              {message.type === "image" ? (
                                <div>
                                  <img
                                    src={message.fileUrl}
                                    alt={message.fileName}
                                    className="rounded-lg max-w-64 max-h-64 object-cover mb-2"
                                  />
                                  <p className="text-sm">{message.fileName}</p>
                                </div>
                              ) : message.type === "file" ? (
                                <div className="flex items-center gap-2">
                                  <File className="w-8 h-8 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{message.fileName}</p>
                                    <p className="text-xs opacity-70">
                                      {message.fileSize && (message.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-sm">{message.content}</p>
                              )}
                              <div className="flex items-center justify-between mt-1 gap-2">
                                <span className="text-xs opacity-70">
                                  {formatMessageTime(message.timestamp)}
                                </span>
                                {getMessageStatus(message)}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    {(activeConv.isTyping || typingUsers.includes(activeConv.participantId)) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={activeConv.participantImage} />
                          <AvatarFallback>
                            {activeConv.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-muted-foreground rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[60px] resize-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,application/pdf,.doc,.docx"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Security Notice */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>End-to-end encrypted • Messages are secure</span>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
