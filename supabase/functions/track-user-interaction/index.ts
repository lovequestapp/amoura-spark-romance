
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { interaction } = await req.json()
    
    // Store interaction for ML analysis
    const { error: insertError } = await supabaseClient
      .from('user_interactions')
      .insert({
        user_id: interaction.userId,
        target_user_id: interaction.targetUserId,
        action: interaction.action,
        timestamp: interaction.timestamp,
        context_data: interaction.contextData || {}
      })

    if (insertError) {
      console.error('Error inserting interaction:', insertError)
      throw insertError
    }

    // Analyze interaction for real-time learning
    if (interaction.action === 'match' || interaction.action === 'message') {
      await updateSuccessPatterns(supabaseClient, interaction)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in track-user-interaction:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function updateSuccessPatterns(supabaseClient: any, interaction: any) {
  try {
    // Fetch profiles involved in successful interaction
    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        user_interests (interest_id, interests (name)),
        personality_traits (name, value)
      `)
      .in('id', [interaction.userId, interaction.targetUserId])

    if (profiles && profiles.length === 2) {
      const [userProfile, targetProfile] = profiles
      
      // Calculate success metrics
      const successMetrics = {
        age_difference: calculateAgeDifference(userProfile.birth_date, targetProfile.birth_date),
        interest_overlap: calculateInterestOverlap(userProfile, targetProfile),
        personality_compatibility: calculatePersonalityCompatibility(userProfile, targetProfile),
        location_distance: calculateDistance(userProfile, targetProfile),
        attachment_compatibility: calculateAttachmentCompatibility(userProfile, targetProfile),
        interaction_time: new Date().toISOString(),
        success_type: interaction.action
      }

      // Store success pattern for ML training
      await supabaseClient
        .from('ml_success_patterns')
        .insert({
          user_id: interaction.userId,
          target_user_id: interaction.targetUserId,
          success_metrics: successMetrics,
          created_at: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Error updating success patterns:', error)
  }
}

function calculateAgeDifference(birthDate1: string, birthDate2: string): number {
  if (!birthDate1 || !birthDate2) return 0
  
  const age1 = new Date().getFullYear() - new Date(birthDate1).getFullYear()
  const age2 = new Date().getFullYear() - new Date(birthDate2).getFullYear()
  
  return Math.abs(age1 - age2)
}

function calculateInterestOverlap(profile1: any, profile2: any): number {
  const interests1 = profile1.user_interests?.map((ui: any) => ui.interests?.name) || []
  const interests2 = profile2.user_interests?.map((ui: any) => ui.interests?.name) || []
  
  if (interests1.length === 0 || interests2.length === 0) return 0
  
  const overlap = interests1.filter((interest: string) => interests2.includes(interest))
  return overlap.length / Math.max(interests1.length, interests2.length)
}

function calculatePersonalityCompatibility(profile1: any, profile2: any): number {
  const traits1 = profile1.personality_traits || []
  const traits2 = profile2.personality_traits || []
  
  if (traits1.length === 0 || traits2.length === 0) return 0.5
  
  let totalCompatibility = 0
  let traitCount = 0
  
  traits1.forEach((trait1: any) => {
    const trait2 = traits2.find((t: any) => t.name === trait1.name)
    if (trait2) {
      const diff = Math.abs(trait1.value - trait2.value)
      totalCompatibility += 1 - (diff / 100)
      traitCount++
    }
  })
  
  return traitCount > 0 ? totalCompatibility / traitCount : 0.5
}

function calculateDistance(profile1: any, profile2: any): number {
  if (!profile1.latitude || !profile1.longitude || !profile2.latitude || !profile2.longitude) {
    return 50
  }
  
  const R = 3963
  const dLat = (profile2.latitude - profile1.latitude) * Math.PI / 180
  const dLon = (profile2.longitude - profile1.longitude) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(profile1.latitude * Math.PI / 180) * Math.cos(profile2.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function calculateAttachmentCompatibility(profile1: any, profile2: any): number {
  if (!profile1.attachment_style || !profile2.attachment_style) return 0.5
  
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    'secure': { 'secure': 0.9, 'anxious': 0.7, 'avoidant': 0.6, 'fearful': 0.5 },
    'anxious': { 'secure': 0.8, 'anxious': 0.4, 'avoidant': 0.3, 'fearful': 0.5 },
    'avoidant': { 'secure': 0.7, 'anxious': 0.3, 'avoidant': 0.5, 'fearful': 0.4 },
    'fearful': { 'secure': 0.6, 'anxious': 0.5, 'avoidant': 0.4, 'fearful': 0.6 }
  }
  
  return compatibilityMatrix[profile1.attachment_style]?.[profile2.attachment_style] || 0.5
}
