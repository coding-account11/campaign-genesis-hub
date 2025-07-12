-- Add business_materials column to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN business_materials TEXT;