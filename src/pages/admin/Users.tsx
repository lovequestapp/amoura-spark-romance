
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  UserX, 
  UserCheck, 
  Mail, 
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          subscribers(subscribed, subscription_tier),
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'all') {
        if (statusFilter === 'premium') {
          query = query.eq('subscribers.subscribed', true);
        } else if (statusFilter === 'incomplete') {
          query = query.eq('onboarding_completed', false);
        } else if (statusFilter === 'admin') {
          query = query.eq('user_roles.role', 'admin');
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.rpc('log_admin_activity', {
        action_param: 'suspend_user',
        target_type_param: 'user',
        target_id_param: userId
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "User suspended",
        description: "User has been suspended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const exportUsersMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, created_at, onboarding_completed')
        .csv();
      
      if (error) throw error;
      
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    },
    onSuccess: () => {
      toast({
        title: "Export completed",
        description: "Users data has been exported successfully.",
      });
    },
  });

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => exportUsersMutation.mutate()}>
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
          <CardDescription>Find and manage platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Users</option>
              <option value="premium">Premium Users</option>
              <option value="incomplete">Incomplete Profiles</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Badge variant={user.onboarding_completed ? "default" : "secondary"}>
                      {user.onboarding_completed ? 'Complete' : 'Incomplete'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.subscribers?.[0]?.subscribed && (
                        <Badge variant="outline">Premium</Badge>
                      )}
                      {user.user_roles?.[0]?.role === 'admin' && (
                        <Badge>Admin</Badge>
                      )}
                      {!user.subscribers?.[0]?.subscribed && user.user_roles?.[0]?.role !== 'admin' && (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => suspendUserMutation.mutate(user.id)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
