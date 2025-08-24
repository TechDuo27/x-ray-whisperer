-- Fix security issue in handle_new_user function by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, which is fine
    RETURN NEW;
END;
$$;