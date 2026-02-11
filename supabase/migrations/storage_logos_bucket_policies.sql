-- =============================================================================
-- Storage: allow admins to upload/update/delete logo in "logos" bucket.
-- Run in Supabase Dashboard → SQL Editor.
--
-- 1. Create the bucket "logos" in Dashboard → Storage → New bucket:
--    - Name: logos
--    - Public: ON (so logo URLs work without auth)
-- 2. Then run this script to add RLS policies.
-- =============================================================================

-- Allow admins to INSERT (upload) into logos bucket
DROP POLICY IF EXISTS "Admin can upload logos" ON storage.objects;
CREATE POLICY "Admin can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos'
  AND public.get_my_profile_role() = 'admin'
);

-- Allow admins to SELECT (needed for upsert/overwrite)
DROP POLICY IF EXISTS "Admin can read logos" ON storage.objects;
CREATE POLICY "Admin can read logos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'logos'
  AND public.get_my_profile_role() = 'admin'
);

-- Allow admins to UPDATE (needed for upsert/overwrite)
DROP POLICY IF EXISTS "Admin can update logos" ON storage.objects;
CREATE POLICY "Admin can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos'
  AND public.get_my_profile_role() = 'admin'
)
WITH CHECK (bucket_id = 'logos');

-- Allow admins to DELETE logos
DROP POLICY IF EXISTS "Admin can delete logos" ON storage.objects;
CREATE POLICY "Admin can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos'
  AND public.get_my_profile_role() = 'admin'
);
