import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:3000/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    try {
      await axios.patch(`http://localhost:3000/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 shadow-xl z-50">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-bold">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b text-sm cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <p className="font-medium">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
