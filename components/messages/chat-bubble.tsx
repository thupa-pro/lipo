import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, CheckCheck, MoreVertical, Reply, Heart, Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast" // Import, useToast

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar?: string
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read"
  type: "text" | "image" | "file" | "quote" | "system"
  isOwn: boolean
  quotedMessage?: {
    id: string
    content: string
    senderName: string
  }
}

interface ChatBubbleProps {
  message: Message
  showAvatar?: boolean
  onReply?: (message: Message) => void
  onReact?: (messageId: string, reaction: string) => void
}

interface TypingIndicatorProps {
  senderName?: string
  senderAvatar?: string
}

export function ChatBubble({ message, showAvatar = true, onReply, onReact }: ChatBubbleProps) {
  const [showTimestamp, setShowTimestamp] = useState(false)
  const { toast } = useToast() // Initialize toast

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <OptimizedIcon name="Clock" className="w-3 h-3 text-gray-400" />
      case "sent":
        return <Check className="w-3 h-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click
    onReply?.(message)
    toast({
      title: "Reply Initiated",
      description: `You are replying to "${message.content.substring(0, 30)}..."`,
      variant: "default",
    })
  }

  const handleReactClick = (e: React.MouseEvent, reaction: string) => {
    e.stopPropagation() // Prevent parent click
    onReact?.(message.id, reaction)
    toast({
      title: "Reaction Sent",
      description: `You reacted with ${reaction} to the message.`,
      variant: "default",
    })
  }

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent parent click
    toast({
      title: "Report Submitted",
      description: "This message has been reported for review.",
      variant: "default",
    })
  }

  if (message.type === "system") {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 mb-4 ${message.isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {showAvatar && !message.isOwn && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      <div className={`flex flex-col max-w-[70%] ${message.isOwn ? "items-end" : "items-start"}`}>
        {!message.isOwn && showAvatar && <div className="text-xs text-gray-500 mb-1 px-1">{message.senderName}</div>}

        <Card
          className={`relative group cursor-pointer transition-all hover:shadow-md ${
            message.isOwn ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200"
          }`}
          onClick={() => setShowTimestamp(!showTimestamp)}
        >
          {message.quotedMessage && (
            <div
              className={`p-2 border-l-2 m-2 mb-0 text-xs ${
                message.isOwn ? "border-blue-300 bg-blue-400/20" : "border-gray-300 bg-gray-50"
              }`}
            >
              <div className="font-medium">{message.quotedMessage.senderName}</div>
              <div className="opacity-75">{message.quotedMessage.content}</div>
            </div>
          )}

          <CardContent className="p-3">
            <div className="text-sm leading-relaxed">{message.content}</div>
          </CardContent>

          {/* Message Actions */}
          <div
            className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity ${
              message.isOwn ? "left-1" : "right-1"
            }`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={message.isOwn ? "start" : "end"}>
                <DropdownMenuItem onClick={handleReplyClick}>
                  <Reply className="w-3 h-3 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleReactClick(e, "❤️")}>
                  <Heart className="w-3 h-3 mr-2" />
                  React
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReportClick}>
                  <Flag className="w-3 h-3 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center gap-1 mt-1 px-1 transition-all ${
            showTimestamp ? "opacity-100 max-h-4" : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <span className="text-xs text-gray-500">
            {formatDate(message.timestamp)} at {formatTime(message.timestamp)}
          </span>
          {message.isOwn && <div className="flex items-center">{getStatusIcon()}</div>}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator({ senderName = "Provider", senderAvatar }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage src={senderAvatar || "/placeholder.svg"} />
        <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1 px-1">{senderName}</div>

        <Card className="bg-white border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-gray-500 ml-2">typing...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChatBubble