
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, MessageSquare, Users, TrendingUp, Star } from 'lucide-react';

const QuickStats = () => {
  // Mock data - in real app this would come from your backend
  const stats = [
    {
      icon: Heart,
      label: 'Total Likes',
      value: '247',
      change: '+12',
      changeType: 'positive' as const,
      color: 'from-pink-400 to-rose-500'
    },
    {
      icon: Eye,
      label: 'Profile Views',
      value: '1.2k',
      change: '+89',
      changeType: 'positive' as const,
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: '156',
      change: '+23',
      changeType: 'positive' as const,
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      label: 'Matches',
      value: '89',
      change: '+7',
      changeType: 'positive' as const,
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Match Rate',
      value: '36%',
      change: '+4%',
      changeType: 'positive' as const,
      color: 'from-orange-400 to-amber-500'
    },
    {
      icon: Star,
      label: 'Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'positive' as const,
      color: 'from-yellow-400 to-yellow-600'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Quick Stats</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-600 truncate">{stat.label}</p>
                  
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500">this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuickStats;
