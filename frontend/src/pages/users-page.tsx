import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ShieldCheck, UserPlus, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', roleId: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle paginated response { data: [...], total: ... }
      setUsers(res.data?.data || (Array.isArray(res.data) ? res.data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddingUser(false);
      setNewUser({ email: '', roleId: '' });
      fetchUsers();
      alert('User added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users, Roles & Permissions</h2>
          <p className="text-muted-foreground">Manage system users, assign roles, and define granular permissions.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddingUser(true)}>
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {isAddingUser && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Email Address</Label>
              <Input
                placeholder="email@example.com"
                value={newUser.email}
                onChange={e => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            <div className="space-y-2 w-48">
              <Label>Initial Role ID</Label>
              <Input
                placeholder="UUID of role"
                value={newUser.roleId}
                onChange={e => setNewUser({...newUser, roleId: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>Save User</Button>
              <Button variant="ghost" onClick={() => setIsAddingUser(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            User Directory
          </CardTitle>
          <CardDescription>View all users and their respective roles and creators.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading users...</TableCell>
                </TableRow>
              ) : (!users || !Array.isArray(users) || users.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No users found.</TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.email}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{user.id.split('-')[0]}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {user.creator?.email || 'System'}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
