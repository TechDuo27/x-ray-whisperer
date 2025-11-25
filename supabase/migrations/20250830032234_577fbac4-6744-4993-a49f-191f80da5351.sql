-- Add feedback columns to analyses table
ALTER TABLE public.analyses 
ADD COLUMN feedback_type text CHECK (feedback_type IN ('up', 'down')),
ADD COLUMN feedback_text text,
ADD COLUMN feedback_submitted_at timestamp with time zone;

-- Add a constraint to ensure feedback_text has at least 50 words when feedback is provided
CREATE OR REPLACE FUNCTION public.validate_feedback_text()
RETURNS trigger AS $$
BEGIN
  -- Only validate if feedback_type is provided
  IF NEW.feedback_type IS NOT NULL THEN
    -- Check if feedback_text has at least 50 words
    IF NEW.feedback_text IS NULL OR 
       array_length(string_to_array(trim(NEW.feedback_text), ' '), 1) < 50 THEN
      RAISE EXCEPTION 'Feedback text must contain at least 50 words when providing feedback';
    END IF;
    
    -- Set feedback_submitted_at if not already set
    IF NEW.feedback_submitted_at IS NULL THEN
      NEW.feedback_submitted_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for feedback validation
CREATE TRIGGER validate_feedback_trigger
  BEFORE INSERT OR UPDATE ON public.analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_feedback_text();