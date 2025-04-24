
-- Create storage bucket for voice messages
INSERT INTO storage.buckets (id, name, public)
VALUES ('messages', 'Voice Messages', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
UPDATE storage.buckets SET public = true WHERE id = 'messages';

-- Add policies for the bucket
INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
VALUES 
('Allow public read access to voice messages', 'messages', 'SELECT', '(true)', '{"select"}'),
('Allow authenticated users to upload', 'messages', 'INSERT', '(auth.uid() IS NOT NULL)', '{"insert"}')
ON CONFLICT ON CONSTRAINT policies_pkey DO NOTHING;
