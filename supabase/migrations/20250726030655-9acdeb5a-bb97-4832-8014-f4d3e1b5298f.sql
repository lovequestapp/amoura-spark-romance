-- Fix the realtime publication issue by handling duplicates gracefully
-- Enable realtime for key tables (only if not already added)
DO $$
BEGIN
  -- Add tables to realtime publication only if not already there
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profile_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_likes;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_online_status'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_online_status;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_activity'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'match_scores'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.match_scores;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'community_posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'post_likes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.post_likes;
  END IF;
END
$$;

-- Set replica identity for realtime
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.profile_likes REPLICA IDENTITY FULL;
ALTER TABLE public.user_online_status REPLICA IDENTITY FULL;
ALTER TABLE public.user_activity REPLICA IDENTITY FULL;
ALTER TABLE public.match_scores REPLICA IDENTITY FULL;
ALTER TABLE public.community_posts REPLICA IDENTITY FULL;
ALTER TABLE public.post_likes REPLICA IDENTITY FULL;

-- Create advanced matching and recommendation functions
CREATE OR REPLACE FUNCTION public.calculate_match_score(
  user_id_param uuid,
  target_user_id_param uuid
)
RETURNS numeric(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  personality_score numeric(5,2) := 0;
  interests_score numeric(5,2) := 0;
  lifestyle_score numeric(5,2) := 0;
  location_score numeric(5,2) := 0;
  intention_score numeric(5,2) := 0;
  overall_score numeric(5,2) := 0;
  user_lat numeric;
  user_lng numeric;
  target_lat numeric;
  target_lng numeric;
  distance_km numeric;
BEGIN
  -- Calculate personality compatibility
  SELECT AVG(
    CASE 
      WHEN ABS(t1.value - t2.value) <= 20 THEN 100
      WHEN ABS(t1.value - t2.value) <= 40 THEN 75
      WHEN ABS(t1.value - t2.value) <= 60 THEN 50
      ELSE 25
    END
  ) INTO personality_score
  FROM personality_traits t1
  JOIN personality_traits t2 ON t1.name = t2.name
  WHERE t1.user_id = user_id_param AND t2.user_id = target_user_id_param;

  -- Calculate interests compatibility
  SELECT 
    CASE 
      WHEN common_interests = 0 THEN 0
      ELSE (common_interests::numeric / GREATEST(total_interests, 1)) * 100
    END INTO interests_score
  FROM (
    SELECT 
      COUNT(CASE WHEN ui1.interest_id = ui2.interest_id THEN 1 END) as common_interests,
      COUNT(DISTINCT ui1.interest_id) + COUNT(DISTINCT ui2.interest_id) - COUNT(CASE WHEN ui1.interest_id = ui2.interest_id THEN 1 END) as total_interests
    FROM user_interests ui1
    FULL OUTER JOIN user_interests ui2 ON ui1.interest_id = ui2.interest_id AND ui2.user_id = target_user_id_param
    WHERE ui1.user_id = user_id_param OR ui2.user_id = target_user_id_param
  ) interest_calc;

  -- Calculate lifestyle compatibility
  SELECT AVG(
    CASE 
      WHEN (l1.smoking = l2.smoking OR l1.smoking IS NULL OR l2.smoking IS NULL) AND
           (l1.drinking = l2.drinking OR l1.drinking IS NULL OR l2.drinking IS NULL) AND
           (l1.exercise = l2.exercise OR l1.exercise IS NULL OR l2.exercise IS NULL) THEN 100
      ELSE 50
    END
  ) INTO lifestyle_score
  FROM lifestyle_preferences l1, lifestyle_preferences l2
  WHERE l1.user_id = user_id_param AND l2.user_id = target_user_id_param;

  -- Calculate location score
  SELECT p1.latitude, p1.longitude, p2.latitude, p2.longitude
  INTO user_lat, user_lng, target_lat, target_lng
  FROM profiles p1, profiles p2
  WHERE p1.id = user_id_param AND p2.id = target_user_id_param;

  IF user_lat IS NOT NULL AND user_lng IS NOT NULL AND target_lat IS NOT NULL AND target_lng IS NOT NULL THEN
    -- Simplified distance calculation (not geographically accurate but sufficient for demo)
    distance_km := SQRT(POWER((user_lat - target_lat) * 111, 2) + POWER((user_lng - target_lng) * 111, 2));
    location_score := GREATEST(0, 100 - (distance_km * 2));
  ELSE
    location_score := 50; -- Default if location not available
  END IF;

  -- Calculate intention compatibility
  SELECT 
    CASE 
      WHEN p1.relationship_type = p2.relationship_type THEN 100
      WHEN p1.relationship_type IS NULL OR p2.relationship_type IS NULL THEN 75
      ELSE 25
    END INTO intention_score
  FROM profiles p1, profiles p2
  WHERE p1.id = user_id_param AND p2.id = target_user_id_param;

  -- Calculate weighted overall score
  overall_score := (
    COALESCE(personality_score, 50) * 0.3 +
    COALESCE(interests_score, 50) * 0.25 +
    COALESCE(lifestyle_score, 50) * 0.2 +
    COALESCE(location_score, 50) * 0.15 +
    COALESCE(intention_score, 50) * 0.1
  );

  -- Store or update the match score
  INSERT INTO match_scores (
    user_id, target_user_id, overall_score, personality_score, 
    interests_score, lifestyle_score, location_score, intention_score
  )
  VALUES (
    user_id_param, target_user_id_param, overall_score, 
    COALESCE(personality_score, 50), COALESCE(interests_score, 50),
    COALESCE(lifestyle_score, 50), COALESCE(location_score, 50), COALESCE(intention_score, 50)
  )
  ON CONFLICT (user_id, target_user_id) 
  DO UPDATE SET 
    overall_score = EXCLUDED.overall_score,
    personality_score = EXCLUDED.personality_score,
    interests_score = EXCLUDED.interests_score,
    lifestyle_score = EXCLUDED.lifestyle_score,
    location_score = EXCLUDED.location_score,
    intention_score = EXCLUDED.intention_score,
    updated_at = now();

  RETURN overall_score;
END;
$function$;

-- Function to get recommended matches for a user
CREATE OR REPLACE FUNCTION public.get_recommended_matches(
  user_id_param uuid,
  limit_param integer DEFAULT 10
)
RETURNS TABLE(
  user_id uuid,
  username text,
  full_name text,
  age integer,
  bio text,
  photos text[],
  overall_score numeric(5,2),
  personality_score numeric(5,2),
  interests_score numeric(5,2),
  distance_km numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_lat numeric;
  user_lng numeric;
BEGIN
  -- Get user's location
  SELECT latitude, longitude INTO user_lat, user_lng
  FROM profiles WHERE id = user_id_param;

  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.full_name,
    EXTRACT(year FROM age(p.birth_date))::integer as age,
    p.bio,
    p.photos,
    ms.overall_score,
    ms.personality_score,
    ms.interests_score,
    CASE 
      WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND p.latitude IS NOT NULL AND p.longitude IS NOT NULL
      THEN SQRT(POWER((user_lat - p.latitude) * 111, 2) + POWER((user_lng - p.longitude) * 111, 2))
      ELSE NULL
    END as distance_km
  FROM profiles p
  LEFT JOIN match_scores ms ON ms.user_id = user_id_param AND ms.target_user_id = p.id
  WHERE p.id != user_id_param
    AND p.onboarding_completed = true
    AND NOT EXISTS (
      SELECT 1 FROM profile_likes pl 
      WHERE pl.liker_id = user_id_param AND pl.liked_profile_id = p.id
    )
    AND COALESCE(p.is_admin_account, false) = false
  ORDER BY 
    CASE WHEN ms.overall_score IS NOT NULL THEN ms.overall_score ELSE 50 END DESC,
    p.created_at DESC
  LIMIT limit_param;
END;
$function$;

-- Function to update user online status
CREATE OR REPLACE FUNCTION public.update_user_online_status(
  user_id_param uuid,
  is_online_param boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO user_online_status (user_id, is_online, last_seen, updated_at)
  VALUES (user_id_param, is_online_param, now(), now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    is_online = EXCLUDED.is_online,
    last_seen = EXCLUDED.last_seen,
    updated_at = EXCLUDED.updated_at;
END;
$function$;

-- Function to track user activity
CREATE OR REPLACE FUNCTION public.track_user_activity(
  user_id_param uuid,
  activity_type_param text,
  metadata_param jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO user_activity (user_id, activity_type, metadata, created_at)
  VALUES (user_id_param, activity_type_param, metadata_param, now());
  
  -- Also update online status
  PERFORM update_user_online_status(user_id_param, true);
END;
$function$;