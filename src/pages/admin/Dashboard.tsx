
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
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      description: 'Total registered users',
      icon: UsersIcon,
    },
    {
      title: 'Completed Profiles',
      value: stats?.completed_profiles || 0,
      description: 'Users with completed profiles',
      icon: UserCheck,
    },
    {
      title: 'Paid Subscribers',
      value: stats?.paid_subscribers || 0,
      description: 'Active paid subscriptions',
      icon: CreditCard,
    },
    {
      title: 'Profile Views',
      value: stats?.total_profile_views || 0,
      description: 'Total profile views',
      icon: Eye,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
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
    </div>
  );
};

export default Dashboard;
