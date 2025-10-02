-- ========================================
-- SETUP SUPABASE STORAGE FOR VIDEO UPLOADS
-- ========================================
-- Run this in Supabase SQL Editor

-- ========================================
-- STEP 1: Create storage bucket
-- ========================================
-- Note: This is done via Supabase Dashboard, not SQL
-- Go to: Storage → Create Bucket → Name: "demo-videos" → Public: Yes

-- ========================================
-- STEP 2: Set up storage policies
-- ========================================

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view videos (public bucket)
CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'demo-videos');

-- Allow users to update their own videos
CREATE POLICY "Users can update own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'demo-videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ========================================
-- DONE!
-- ========================================

-- Verify policies
SELECT *
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';

