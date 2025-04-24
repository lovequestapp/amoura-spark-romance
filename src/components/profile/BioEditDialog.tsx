
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { updateProfileBio } from '@/services/profile';
import { useToast } from '@/hooks/use-toast';

interface BioEditDialogProps {
  open: boolean;
  onClose: () => void;
  currentBio: string;
  onBioUpdated: (newBio: string) => void;
}

const BioEditDialog = ({ open, onClose, currentBio, onBioUpdated }: BioEditDialogProps) => {
  const [bio, setBio] = useState(currentBio);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const success = await updateProfileBio(bio);
    setIsUpdating(false);

    if (success) {
      onBioUpdated(bio);
      onClose();
      toast({
        title: "Bio updated",
        description: "Your bio has been successfully updated.",
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your bio. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BioEditDialog;
