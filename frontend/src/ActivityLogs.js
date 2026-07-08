import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:3000/activity-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="border-b pb-2">
              <p className="font-medium">{log.action}</p>
              <p className="text-sm text-muted-foreground">
                By User: {log.user_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
          {logs.length === 0 && <p className="text-muted-foreground">No logs found.</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
