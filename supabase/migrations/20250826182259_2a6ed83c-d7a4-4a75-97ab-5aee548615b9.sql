-- Remove avatar_url column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;