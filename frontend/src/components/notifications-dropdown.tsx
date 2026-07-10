import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Info, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  time: string;
  isRead: boolean;
}

const TypeIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    case 'WARNING': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'INFO': return <Info className="h-4 w-4 text-blue-500" />;
    default: return <Clock className="h-4 w-4 text-slate-500" />;
  }
};

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const session = await supabase.auth.getSession();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${session.data.session?.access_token}` }
      });
      // Map backend schema to UI component schema
      const mapped = res.data.map((n: any) => ({
        id: n.id,
        title: n.type.toUpperCase(),
        message: n.message,
        type: n.type === 'system' ? 'INFO' : 'SUCCESS',
        time: new Date(n.created_at).toLocaleTimeString(),
        isRead: n.read
      }));
      setNotifications(mapped);
      setUnreadCount(mapped.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <span className="font-bold">Notifications</span>
          <Button variant="ghost" className="h-auto p-0 text-xs text-primary hover:bg-transparent">Mark all as read</Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-[350px]">
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="p-4 focus:bg-slate-50 cursor-pointer flex gap-3 items-start border-b last:border-0 border-slate-100">
              <div className="mt-1">
                <TypeIcon type={n.type} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none">{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                <p className="text-[10px] text-slate-400">{n.time}</p>
              </div>
              {!n.isRead && (
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-1" />
              )}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" className="w-full text-xs font-medium h-9">View all notifications</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
