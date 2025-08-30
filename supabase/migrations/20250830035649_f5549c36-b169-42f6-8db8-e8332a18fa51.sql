-- Add indexes for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_analyses_feedback_submitted_at 
ON public.analyses (feedback_submitted_at DESC) 
WHERE feedback_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_analyses_user_id_feedback 
ON public.analyses (user_id) 
WHERE feedback_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id 
ON public.profiles (user_id);