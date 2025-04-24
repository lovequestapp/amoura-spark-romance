
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const trendingTags = [
  { name: 'relationships', count: 256 },
  { name: 'dating', count: 189 },
  { name: 'advice', count: 147 },
  { name: 'stories', count: 94 },
  { name: 'success', count: 83 },
];

const CommunityTrending = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trending Tags</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Badge key={tag.name} variant="outline" className="cursor-pointer hover:bg-muted transition-colors px-2 py-1">
              #{tag.name}
              <span className="ml-1 text-xs text-muted-foreground">{tag.count}</span>
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm list-disc pl-5 space-y-2">
            <li>Be respectful to other community members</li>
            <li>No hate speech or harassment</li>
            <li>Keep content relevant and appropriate</li>
            <li>Protect your privacy and others'</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityTrending;
