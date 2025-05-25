
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Crown, Send } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';

interface PaidMessageDialogProps {
  open: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhoto: string;
  onSendMessage: (message: string) => Promise<boolean>;
}

const PaidMessageDialog = ({ 
  open, 
  onClose, 
  recipientName, 
  recipientPhoto, 
  onSendMessage 
}: PaidMessageDialogProps) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { hasItem, getItemQuantity, useItem } = useInventory();
  const { toast } = useToast();

  const messageCount = getItemQuantity('messages');
  const canSendMessage = hasItem('messages', 1);

  const handleSendMessage = async () => {
    if (!message.trim() || !canSendMessage) return;

    setSending(true);
    try {
      // First use the inventory item
      const itemUsed = await useItem('messages', 1);
      
      if (itemUsed) {
        // Then send the message
        const messageSent = await onSendMessage(message.trim());
        
        if (messageSent) {
          toast({
            title: "Message Sent!",
            description: `Your premium message has been sent to ${recipientName}.`,
          });
          setMessage('');
          onClose();
        }
      }
    } catch (error) {
      console.error('Error sending paid message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Send Premium Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img 
              src={recipientPhoto} 
              alt={recipientName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{recipientName}</p>
              <p className="text-sm text-gray-600">Will receive your message instantly</p>
            </div>
          </div>

          {/* Message Count */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Premium Messages</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {messageCount} remaining
            </Badge>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>

          {/* Premium Features */}
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-1">Premium Benefits:</p>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Message delivered instantly</li>
              <li>• Higher response rate</li>
              <li>• No matching required</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || !canSendMessage || sending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaidMessageDialog;
