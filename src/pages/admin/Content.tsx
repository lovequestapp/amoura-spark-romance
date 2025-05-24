
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
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Image, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Content = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['contentReports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_moderation')
        .select(`
          *,
          profiles!content_moderation_reported_by_fkey(full_name, username)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: communityPosts } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles(full_name, username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const moderateContentMutation = useMutation({
    mutationFn: async ({ reportId, status, notes }: { reportId: string, status: string, notes: string }) => {
      const { error } = await supabase
        .from('content_moderation')
        .update({
          status,
          admin_notes: notes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);
      
      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        action_param: `moderate_content_${status}`,
        target_type_param: 'content_report',
        target_id_param: reportId,
        details_param: { notes }
      });
    },
    onSuccess: () => {
      toast({
        title: "Content moderated",
        description: "Content moderation action completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['contentReports'] });
      setSelectedReport(null);
      setAdminNotes('');
    },
  });

  if (isLoading) {
    return <div>Loading content reports...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Content Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reported Content</CardTitle>
            <CardDescription>Content flagged for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports?.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {report.content_type === 'post' && <MessageSquare className="w-4 h-4" />}
                      {report.content_type === 'photo' && <Image className="w-4 h-4" />}
                      {report.content_type === 'profile' && <User className="w-4 h-4" />}
                      <span className="font-medium capitalize">{report.content_type}</span>
                    </div>
                    <Badge variant={
                      report.status === 'pending' ? 'destructive' :
                      report.status === 'approved' ? 'default' :
                      report.status === 'rejected' ? 'secondary' : 'outline'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.reason}</p>
                  <p className="text-xs text-gray-500">
                    Reported by {report.profiles?.full_name || report.profiles?.username} • {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Community Posts</CardTitle>
            <CardDescription>Latest posts from the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {communityPosts?.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {post.profiles?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{post.profiles?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{post.content}</p>
                  {post.image_url && (
                    <img src={post.image_url} alt="Post" className="w-full h-32 object-cover rounded" />
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle>Moderate Content</CardTitle>
            <CardDescription>Review and take action on reported content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <p className="capitalize">{selectedReport.content_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Report Reason</label>
                  <p>{selectedReport.reason}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your moderation decision..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => moderateContentMutation.mutate({
                    reportId: selectedReport.id,
                    status: 'approved',
                    notes: adminNotes
                  })}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => moderateContentMutation.mutate({
                    reportId: selectedReport.id,
                    status: 'rejected',
                    notes: adminNotes
                  })}
                  variant="destructive"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => moderateContentMutation.mutate({
                    reportId: selectedReport.id,
                    status: 'escalated',
                    notes: adminNotes
                  })}
                  variant="outline"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Escalate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Content;
