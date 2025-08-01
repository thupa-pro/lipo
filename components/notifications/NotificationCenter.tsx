import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X, Filter, AlertCircle, Info, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'alert' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Sarah Wilson regarding your booking.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      actionUrl: '/messages'
    },
    {
      id: '2',
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your booking for house cleaning service has been confirmed for tomorrow at 2:00 PM.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false
    },
    {
      id: '3',
      type: 'alert',
      title: 'Payment Required',
      message: 'Your payment for the plumbing service is pending. Please complete the payment to confirm your booking.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      actionUrl: '/payments'
    },
    {
      id: '4',
      type: 'info',
      title: 'Service Update',
      message: 'Your gardening service has been rescheduled to next week due to weather conditions.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'message' | 'alert'>('all');

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return MessageSquare;
      case 'alert':
        return AlertCircle;
      case 'info':
        return Info;
      case 'success':
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'text-blue-500';
      case 'alert':
        return 'text-red-500';
      case 'info':
        return 'text-gray-500';
      case 'success':
        return 'text-emerald-500';
      default:
        return 'text-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-slate-700 dark:text-white" />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Notifications
            </h2>
            <p className="text-slate-600 dark:text-gray-300">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          >
            <option value="all">All notifications</option>
            <option value="unread">Unread only</option>
            <option value="message">Messages</option>
            <option value="alert">Alerts</option>
          </select>
          
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
          
          <Button variant="outline" size="sm">
            <NavigationIcons.Settings className="w-4 h-4" / />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredNotifications.map((notification) => {
                  const IconComponent = getIcon(notification.type);
                  const iconColor = getIconColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${iconColor}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <OptimizedIcon name="Clock" className="w-4 h-4 text-slate-400" />
                                <span className="text-xs text-slate-500">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => window.location.href = notification.actionUrl!}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No notifications
                </h3>
                <p className="text-slate-600 dark:text-gray-400">
                  You're all caught up! Check back later for new updates.
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
