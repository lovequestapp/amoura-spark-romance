
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Heart,
  MessageCircle,
  Calendar
} from 'lucide-react';

const Analytics = () => {
  const { data: userAnalytics } = useQuery({
    queryKey: ['userAnalytics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_analytics', { days_back: 30 });
      if (error) throw error;
      return data;
    },
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: engagementData } = useQuery({
    queryKey: ['engagementData'],
    queryFn: async () => {
      const { data: messages } = await supabase
        .from('messages')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
      const { data: posts } = await supabase
        .from('community_posts')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: views } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Group by day
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return date.toISOString().split('T')[0];
      }).reverse();

      return last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        messages: messages?.filter(m => m.created_at.startsWith(date)).length || 0,
        posts: posts?.filter(p => p.created_at.startsWith(date)).length || 0,
        views: views?.filter(v => v.viewed_at.startsWith(date)).length || 0,
      }));
    },
  });

  const userTypeData = [
    { name: 'Free Users', value: (dashboardStats?.total_users || 0) - (dashboardStats?.paid_subscribers || 0), color: '#8884d8' },
    { name: 'Premium Users', value: dashboardStats?.paid_subscribers || 0, color: '#82ca9d' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.new_users_week || 0}</div>
            <p className="text-xs text-muted-foreground">New users this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.messages_today || 0}</div>
            <p className="text-xs text-muted-foreground">Messages sent today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.total_profile_views || 0}</div>
            <p className="text-xs text-muted-foreground">Total profile views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Onboarding</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.avg_onboarding_time_hours 
                ? `${Math.round(dashboardStats.avg_onboarding_time_hours)}h`
                : '0h'
              }
            </div>
            <p className="text-xs text-muted-foreground">Average completion time</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth (30 Days)</CardTitle>
            <CardDescription>Daily new user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="new_signups" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="New Signups"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed_profiles" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Completed Profiles"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Types</CardTitle>
            <CardDescription>Distribution of free vs premium users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Engagement</CardTitle>
            <CardDescription>Messages, posts, and profile views over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="messages" fill="#8884d8" name="Messages" />
                <Bar dataKey="posts" fill="#82ca9d" name="Posts" />
                <Bar dataKey="views" fill="#ffc658" name="Profile Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
