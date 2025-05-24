
import { supabase } from "@/integrations/supabase/client";

export const likeProfile = async (profileId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("You must be logged in to like profiles");
    }

    // Check if already liked
    const { data: existingLike } = await (supabase as any)
      .from('profile_likes')
      .select('id')
      .eq('liker_id', session.user.id)
      .eq('liked_profile_id', profileId)
      .maybeSingle();

    if (existingLike) {
      // Unlike
      await (supabase as any)
        .from('profile_likes')
        .delete()
        .eq('liker_id', session.user.id)
        .eq('liked_profile_id', profileId);
      return false;
    } else {
      // Like
      await (supabase as any)
        .from('profile_likes')
        .insert({
          liker_id: session.user.id,
          liked_profile_id: profileId
        });
      return true;
    }
  } catch (error) {
    console.error("Error liking profile:", error);
    throw error;
  }
};

export const checkProfileLiked = async (profileId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const { data } = await (supabase as any)
      .from('profile_likes')
      .select('id')
      .eq('liker_id', session.user.id)
      .eq('liked_profile_id', profileId)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error("Error checking profile like:", error);
    return false;
  }
};
