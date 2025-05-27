
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BasicInfoEditProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  onProfileUpdated: (updatedInfo: any) => void;
}

const relationshipTypes = [
  { value: 'long_term', label: 'Long-term relationship' },
  { value: 'short_term', label: 'Short-term relationship' },
  { value: 'casual', label: 'Something casual' },
  { value: 'friendship', label: 'New friends' },
  { value: 'figuring_out', label: 'Still figuring it out' }
];

const BasicInfoEdit = ({ open, onClose, profile, onProfileUpdated }: BasicInfoEditProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    birth_date: profile?.birth_date || '',
    education: profile?.education || '',
    relationship_type: profile?.relationship_type || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      onProfileUpdated(formData);
      onClose();
      toast({
        title: "Profile updated",
        description: "Your basic information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Basic Information</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700">Birth Date</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange('birth_date', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="education" className="text-sm font-medium text-gray-700">Education</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="e.g., University of California, Berkeley"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="relationship_type" className="text-sm font-medium text-gray-700">Looking For</Label>
            <Select
              value={formData.relationship_type}
              onValueChange={(value) => handleInputChange('relationship_type', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="What are you looking for?" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating}
              className="bg-amoura-deep-pink hover:bg-amoura-deep-pink/90"
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BasicInfoEdit;
