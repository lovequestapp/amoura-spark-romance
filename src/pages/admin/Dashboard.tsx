
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Users as UsersIcon, 
  UserCheck, 
  CreditCard,
  Eye,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      // Query the view directly since types aren't updated yet
      const { data, error } = await supabase
        .from('admin_dashboard_stats' as any)
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      // Get recent user signups
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('full_name, username, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent posts
      const { data: recentPosts } = await supabase
        .from('community_posts')
        .select('content, created_at, profiles(full_name, username)')
        .order('created_at', { ascending: false })
        .limit(5);

      return { recentUsers, recentPosts };
    },
  });

  const { data: weeklyData } = useQuery({
    queryKey: ['weeklyData'],
    queryFn: async () => {
      // Call the function directly via RPC since types aren't updated yet
      const { data, error } = await supabase.rpc('get_user_analytics' as any, { days_back: 7 });
      if (error) throw error;
      return data?.map((d: any) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })
      }));
    },
  });

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const mainStats = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      description: 'Total registered users',
      icon: UsersIcon,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      title: 'Completed Profiles',
      value: stats?.completed_profiles || 0,
      description: 'Users with completed profiles',
      icon: UserCheck,
      change: '+8%',
      changeType: 'positive' as const
    },
    {
      title: 'Paid Subscribers',
      value: stats?.paid_subscribers || 0,
      description: 'Active paid subscriptions',
      icon: CreditCard,
      change: '+23%',
      changeType: 'positive' as const
    },
    {
      title: 'Profile Views',
      value: stats?.total_profile_views || 0,
      description: 'Total profile views',
      icon: Eye,
      change: '+15%',
      changeType: 'positive' as const
    },
  ];

  const additionalStats = [
    {
      title: 'Messages Today',
      value: stats?.messages_today || 0,
      description: 'Messages sent in last 24h',
      icon: MessageSquare,
    },
    {
      title: 'Posts Today',
      value: stats?.posts_today || 0,
      description: 'Community posts created today',
      icon: TrendingUp,
    },
    {
      title: 'New Users (Week)',
      value: stats?.new_users_week || 0,
      description: 'Users joined this week',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className={`text-xs font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {additionalStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly User Growth</CardTitle>
            <CardDescription>New signups over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="new_signups" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="New Signups"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">New Users</h4>
                <div className="space-y-2">
                  {recentActivity?.recentUsers?.map((user: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{user.full_name || user.username || 'Anonymous'}</span>
                      <span className="text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recent Posts</h4>
                <div className="space-y-2">
                  {recentActivity?.recentPosts?.map((post: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {post.profiles?.full_name || post.profiles?.username || 'Anonymous'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 truncate">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
