-- Fix critical security issues first

-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_profile_views()
RETURNS TABLE(id uuid, viewer_id uuid, viewed_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT id, viewer_id, viewed_at 
  FROM public.profile_views 
  WHERE viewed_id = auth.uid()
  ORDER BY viewed_at DESC
  LIMIT 20;
$function$;

CREATE OR REPLACE FUNCTION public.add_to_inventory(user_id_param uuid, item_type_param text, quantity_param integer, expires_at_param timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_inventory (user_id, item_type, quantity, expires_at)
  VALUES (user_id_param, item_type_param, quantity_param, expires_at_param)
  ON CONFLICT (user_id, item_type)
  DO UPDATE SET 
    quantity = user_inventory.quantity + quantity_param,
    updated_at = now();
    
  -- Log the addition
  INSERT INTO public.usage_log (user_id, item_type, action, quantity_changed, remaining_quantity)
  VALUES (
    user_id_param, 
    item_type_param, 
    'purchased', 
    quantity_param,
    (SELECT quantity FROM public.user_inventory WHERE user_id = user_id_param AND item_type = item_type_param)
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = _role
  );
$function$;

CREATE OR REPLACE FUNCTION public.like_post(post_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  likes_count INTEGER;
BEGIN
  -- Insert the like if it doesn't exist
  INSERT INTO public.post_likes (post_id, user_id)
  VALUES (post_id_param, auth.uid())
  ON CONFLICT (post_id, user_id) DO NOTHING;
  
  -- Update the likes count on the post
  UPDATE public.community_posts
  SET likes = (SELECT COUNT(*) FROM public.post_likes WHERE post_id = post_id_param)
  WHERE id = post_id_param
  RETURNING likes INTO likes_count;
  
  RETURN json_build_object('likes', likes_count);
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_inventory_item(user_id_param uuid, item_type_param text, min_quantity_param integer DEFAULT 1)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT COALESCE(
    (SELECT quantity >= min_quantity_param 
     FROM public.user_inventory 
     WHERE user_id = user_id_param AND item_type = item_type_param),
    FALSE
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.has_liked_post(post_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.post_likes
    WHERE post_id = post_id_param AND user_id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_remaining_super_likes(user_id_param uuid, new_value integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  UPDATE public.subscribers
  SET remaining_super_likes = new_value
  WHERE user_id = user_id_param;
$function$;

CREATE OR REPLACE FUNCTION public.update_boost_until(user_id_param uuid, boost_until_param timestamp with time zone)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  UPDATE public.subscribers
  SET boost_until = boost_until_param
  WHERE user_id = user_id_param;
$function$;

CREATE OR REPLACE FUNCTION public.assign_admin_role(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id_param, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE id = auth.uid()
  );
$function$;

CREATE OR REPLACE FUNCTION public.create_admin_user(email text, user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Insert into profiles with is_admin_account flag
  INSERT INTO public.profiles (id, username, full_name, onboarding_completed, is_admin_account)
  VALUES (
    user_id,
    LOWER(SPLIT_PART(email, '@', 1)),
    'Admin User',
    true,
    true
  );

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'admin');
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_subscriber_data(user_id_param uuid)
RETURNS TABLE(remaining_rewinds integer, remaining_super_likes integer, boost_until timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    remaining_rewinds, 
    remaining_super_likes, 
    boost_until
  FROM public.subscribers
  WHERE user_id = user_id_param;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_inventory(user_id_param uuid)
RETURNS TABLE(item_type text, quantity integer, expires_at timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT item_type, quantity, expires_at
  FROM public.user_inventory
  WHERE user_id = user_id_param AND quantity > 0
  ORDER BY item_type;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (
        NEW.id,
        LOWER(SPLIT_PART(NEW.email, '@', 1)), -- Use the part before @ as username
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_purchase(user_id_param uuid, product_name_param text, product_category_param text, item_type_param text, quantity_param integer, price_cents_param integer, stripe_session_id_param text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  order_id UUID;
  expires_at_param TIMESTAMPTZ;
BEGIN
  -- Calculate expiry date based on item type
  CASE item_type_param
    WHEN 'messages' THEN
      expires_at_param := now() + INTERVAL '90 days';
    WHEN 'super_likes' THEN
      expires_at_param := now() + INTERVAL '30 days';
    WHEN 'boosts' THEN
      expires_at_param := now() + INTERVAL '60 days';
    WHEN 'rewinds' THEN
      expires_at_param := now() + INTERVAL '30 days';
    ELSE
      expires_at_param := NULL;
  END CASE;

  -- Insert order record
  INSERT INTO public.orders (
    user_id, 
    product_name, 
    product_category, 
    item_type, 
    quantity, 
    price_cents, 
    stripe_session_id,
    status
  )
  VALUES (
    user_id_param,
    product_name_param,
    product_category_param,
    item_type_param,
    quantity_param,
    price_cents_param,
    stripe_session_id_param,
    'completed'
  )
  RETURNING id INTO order_id;

  -- Add items to inventory
  PERFORM add_to_inventory(
    user_id_param,
    item_type_param,
    quantity_param,
    expires_at_param
  );

  RETURN order_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.unlike_post(post_id_param uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  likes_count INTEGER;
BEGIN
  -- Delete the like
  DELETE FROM public.post_likes
  WHERE post_id = post_id_param AND user_id = auth.uid();
  
  -- Update the likes count on the post
  UPDATE public.community_posts
  SET likes = (SELECT COUNT(*) FROM public.post_likes WHERE post_id = post_id_param)
  WHERE id = post_id_param
  RETURNING likes INTO likes_count;
  
  RETURN json_build_object('likes', likes_count);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_remaining_rewinds(user_id_param uuid, new_value integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  UPDATE public.subscribers
  SET remaining_rewinds = new_value
  WHERE user_id = user_id_param;
$function$;

CREATE OR REPLACE FUNCTION public.use_inventory_item(user_id_param uuid, item_type_param text, quantity_param integer DEFAULT 1)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_quantity INTEGER;
  new_quantity INTEGER;
BEGIN
  -- Get current quantity
  SELECT quantity INTO current_quantity
  FROM public.user_inventory
  WHERE user_id = user_id_param AND item_type = item_type_param;
  
  -- Check if user has enough items
  IF current_quantity IS NULL OR current_quantity < quantity_param THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new quantity
  new_quantity := current_quantity - quantity_param;
  
  -- Update inventory
  UPDATE public.user_inventory
  SET quantity = new_quantity, updated_at = now()
  WHERE user_id = user_id_param AND item_type = item_type_param;
  
  -- Log the usage
  INSERT INTO public.usage_log (user_id, item_type, action, quantity_changed, remaining_quantity)
  VALUES (user_id_param, item_type_param, 'used', -quantity_param, new_quantity);
  
  RETURN TRUE;
END;
$function$;

-- Create missing features for real-time matching
CREATE TABLE IF NOT EXISTS public.match_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_user_id uuid NOT NULL,
  overall_score numeric(5,2) NOT NULL DEFAULT 0,
  personality_score numeric(5,2) DEFAULT 0,
  interests_score numeric(5,2) DEFAULT 0,
  lifestyle_score numeric(5,2) DEFAULT 0,
  location_score numeric(5,2) DEFAULT 0,
  intention_score numeric(5,2) DEFAULT 0,
  ml_enhanced boolean DEFAULT false,
  ml_confidence numeric(5,2) DEFAULT 0,
  success_probability numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, target_user_id)
);

-- Enable RLS on match_scores
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

-- Create policy for match_scores
CREATE POLICY "Users can view their match scores" ON public.match_scores
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage match scores" ON public.match_scores
  FOR ALL USING (true);

-- Create table for real-time user activity
CREATE TABLE IF NOT EXISTS public.user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on user_activity
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Create policy for user_activity
CREATE POLICY "Users can view their own activity" ON public.user_activity
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity" ON public.user_activity
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create table for online status tracking
CREATE TABLE IF NOT EXISTS public.user_online_status (
  user_id uuid PRIMARY KEY,
  last_seen timestamptz DEFAULT now(),
  is_online boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_online_status
ALTER TABLE public.user_online_status ENABLE ROW LEVEL SECURITY;

-- Create policy for user_online_status
CREATE POLICY "Users can view online status" ON public.user_online_status
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own status" ON public.user_online_status
  FOR ALL USING (user_id = auth.uid());

-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profile-photos', 'profile-photos', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('message-images', 'message-images', false, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('voice-messages', 'voice-messages', false, 10485760, ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their profile photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their profile photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for message images
CREATE POLICY "Users can view message images in their conversations" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'message-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload message images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'message-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for voice messages
CREATE POLICY "Users can view voice messages in their conversations" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'voice-messages' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload voice messages" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'voice-messages' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_online_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;

-- Set replica identity for realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.profile_likes REPLICA IDENTITY FULL;
ALTER TABLE public.user_online_status REPLICA IDENTITY FULL;
ALTER TABLE public.user_activity REPLICA IDENTITY FULL;