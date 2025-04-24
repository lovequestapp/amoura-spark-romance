
-- Function to get profile views (avoiding TypeScript issues)
CREATE OR REPLACE FUNCTION public.get_profile_views()
RETURNS SETOF public.profile_views
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.profile_views;
$$;

-- Function to get subscriber data
CREATE OR REPLACE FUNCTION public.get_subscriber_data(user_id_param UUID)
RETURNS TABLE (
  remaining_rewinds INTEGER,
  remaining_super_likes INTEGER,
  boost_until TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    remaining_rewinds,
    remaining_super_likes,
    boost_until
  FROM public.subscribers
  WHERE user_id = user_id_param;
$$;

-- Function to update remaining rewinds
CREATE OR REPLACE FUNCTION public.update_remaining_rewinds(user_id_param UUID, new_value INTEGER)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.subscribers
  SET remaining_rewinds = new_value
  WHERE user_id = user_id_param;
$$;

-- Function to update remaining super likes
CREATE OR REPLACE FUNCTION public.update_remaining_super_likes(user_id_param UUID, new_value INTEGER)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.subscribers
  SET remaining_super_likes = new_value
  WHERE user_id = user_id_param;
$$;

-- Function to update boost until
CREATE OR REPLACE FUNCTION public.update_boost_until(user_id_param UUID, boost_until_param TIMESTAMPTZ)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.subscribers
  SET boost_until = boost_until_param
  WHERE user_id = user_id_param;
$$;

