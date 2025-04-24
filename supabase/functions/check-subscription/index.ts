
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use the service role key to perform writes in Supabase
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // For demo purposes, we're simulating subscription data
    // In a real app, this would verify with Stripe
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get subscription request parameters
    const requestUrl = new URL(req.url);
    const tierParam = requestUrl.searchParams.get('tier');
    
    // Default to free if no tier is specified
    const tier = tierParam || 'free';
    
    let subscriptionEnd = null;
    if (tier !== 'free') {
      // Set subscription end to 30 days from now for demo
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      subscriptionEnd = endDate.toISOString();
    }
    
    // Calculate features based on tier
    const features = getTierFeatures(tier);
    
    // Update the subscriber record
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: `demo_${tier}_${user.id.substring(0, 8)}`,
      subscribed: tier !== 'free',
      subscription_tier: tier,
      subscription_end: subscriptionEnd,
      remaining_super_likes: features.superLikes === 'unlimited' ? 999 : features.superLikes,
      remaining_rewinds: features.rewinds === 'unlimited' ? 999 : features.rewinds,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    logStep("Updated database with subscription info", { subscribed: tier !== 'free', tier });
    
    return new Response(JSON.stringify({
      subscribed: tier !== 'free',
      subscription_tier: tier,
      subscription_end: subscriptionEnd,
      features: features
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

// Feature configurations based on tier
function getTierFeatures(tier: string) {
  switch (tier) {
    case 'platinum':
      return {
        rewinds: 'unlimited',
        superLikes: 'unlimited',
        boosts: 4,
        profileVisibility: 'prioritized',
        messageBeforeMatch: true,
        incognitoMode: true,
        analytics: true,
      };
    case 'gold':
      return {
        rewinds: 10,
        superLikes: 10,
        boosts: 2,
        profileVisibility: 'boosted',
        messageBeforeMatch: true,
        incognitoMode: false,
        analytics: true,
      };
    case 'basic':
      return {
        rewinds: 5,
        superLikes: 5,
        boosts: 1,
        profileVisibility: 'normal',
        messageBeforeMatch: false,
        incognitoMode: false,
        analytics: false,
      };
    default:
      return {
        rewinds: 0,
        superLikes: 0,
        boosts: 0,
        profileVisibility: 'normal',
        messageBeforeMatch: false,
        incognitoMode: false,
        analytics: false,
      };
  }
}
