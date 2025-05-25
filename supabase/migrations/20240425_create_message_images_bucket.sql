
-- Create storage bucket for message images
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-images', 'message-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload message images
CREATE POLICY "Allow authenticated users to upload message images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message-images');

-- Allow users to view message images
CREATE POLICY "Allow users to view message images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'message-images');

-- Allow users to delete their own message images
CREATE POLICY "Allow users to delete their own message images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'message-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for messages table to sync image messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
