
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Interest {
  id: string;
  name: string;
  category: string;
}

interface InterestsEditDialogProps {
  open: boolean;
  onClose: () => void;
  currentInterests: string[];
  onInterestsUpdated: (interests: string[]) => void;
}

const InterestsEditDialog: React.FC<InterestsEditDialogProps> = ({
  open,
  onClose,
  currentInterests,
  onInterestsUpdated
}) => {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchInterests();
      setSelectedInterests(currentInterests);
    }
  }, [open, currentInterests]);

  const fetchInterests = async () => {
    try {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setAvailableInterests(data || []);
    } catch (error) {
      console.error('Error fetching interests:', error);
      toast({
        title: "Error",
        description: "Failed to load interests",
        variant: "destructive",
      });
    }
  };

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(prev => prev.filter(id => id !== interestId));
    } else {
      if (selectedInterests.length >= 10) {
        toast({
          title: "Maximum Interests",
          description: "You can select up to 10 interests",
          variant: "default",
        });
        return;
      }
      setSelectedInterests(prev => [...prev, interestId]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: userData, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!userData.user) throw new Error("User not authenticated");

      // Delete existing interests
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userData.user.id);

      // Insert new interests
      if (selectedInterests.length > 0) {
        const interestInserts = selectedInterests.map(interestId => ({
          user_id: userData.user.id,
          interest_id: interestId
        }));

        const { error: insertError } = await supabase
          .from('user_interests')
          .insert(interestInserts);

        if (insertError) throw insertError;
      }

      onInterestsUpdated(selectedInterests);
      toast({
        title: "Success",
        description: "Your interests have been updated",
      });
      onClose();
    } catch (error) {
      console.error('Error updating interests:', error);
      toast({
        title: "Error",
        description: "Failed to update interests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredInterests = availableInterests.filter(interest =>
    interest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const interestsByCategory = filteredInterests.reduce((acc: Record<string, Interest[]>, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Your Interests</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="text-sm text-gray-600">
            Selected: {selectedInterests.length} / 10
          </div>

          {Object.entries(interestsByCategory).map(([category, interests]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <Badge
                      key={interest.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "bg-amoura-deep-pink text-white hover:bg-amoura-deep-pink/90"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleInterest(interest.id)}
                    >
                      {interest.name}
                      {isSelected && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InterestsEditDialog;
