-- Add admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN admin boolean NOT NULL DEFAULT false;