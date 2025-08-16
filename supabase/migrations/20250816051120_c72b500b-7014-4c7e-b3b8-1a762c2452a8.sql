-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create analyses table for storing analysis results
CREATE TABLE public.analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  original_filename TEXT,
  analysis_results JSONB,
  confidence_threshold DECIMAL(3,2) DEFAULT 0.25,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for analyses
CREATE POLICY "Users can view their own analyses" 
ON public.analyses 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses" 
ON public.analyses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" 
ON public.analyses 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" 
ON public.analyses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for xray images
INSERT INTO storage.buckets (id, name, public) VALUES ('xrays', 'xrays', false);

-- Create storage policies for xray uploads
CREATE POLICY "Users can view their own xrays" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'xrays' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own xrays" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'xrays' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own xrays" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'xrays' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own xrays" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'xrays' AND auth.uid()::text = (storage.foldername(name))[1]);