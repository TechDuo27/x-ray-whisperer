-- Create policy for admins to view all analyses
CREATE POLICY "Admins can view all analyses" 
ON public.analyses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.admin = true
  )
);