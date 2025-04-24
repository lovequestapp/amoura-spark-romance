
-- Create a new storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Allow public access to view photos
CREATE POLICY "Allow public to view photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');
