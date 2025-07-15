-- Create listing-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- RLS policies for listing-images bucket
CREATE POLICY "Anyone can view listing images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated users can upload listing images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own listing images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own listing images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Function to clean up listing images when listing is deleted
CREATE OR REPLACE FUNCTION cleanup_listing_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all images for the listing from storage
  DELETE FROM storage.objects 
  WHERE bucket_id = 'listing-images' 
  AND name LIKE OLD.id::text || '/%';
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to cleanup images when listing is deleted
CREATE TRIGGER cleanup_listing_images_trigger
  AFTER DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION cleanup_listing_images();
