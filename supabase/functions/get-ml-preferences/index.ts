
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

    const { userId } = await req.json()
    
    // Analyze user's interaction history to derive preferences
    const { data: interactions } = await supabaseClient
      .from('user_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(100)

    const { data: successPatterns } = await supabaseClient
      .from('ml_success_patterns')
      .select('*')
      .eq('user_id', userId)
      .limit(50)

    // Derive ML preferences from historical data
    const preferences = await deriveUserPreferences(interactions || [], successPatterns || [])

    return new Response(
      JSON.stringify(preferences),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-ml-preferences:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function deriveUserPreferences(interactions: any[], successPatterns: any[]) {
  const preferences: any = {
    preferredAgeRange: [22, 35],
    successfulInterestPatterns: [],
    personalityPreferences: {},
    activeTimePatterns: {},
    attachmentStylePreferences: {},
    sampleSize: interactions.length
  }

  // Analyze successful interactions
  const successfulInteractions = interactions.filter(i => 
    i.action === 'like' || i.action === 'super_like' || i.action === 'match' || i.action === 'message'
  )

  // Derive age preferences from successful interactions
  if (successPatterns.length > 0) {
    const ageDifferences = successPatterns
      .map(p => p.success_metrics?.age_difference)
      .filter(age => age !== undefined)
    
    if (ageDifferences.length > 0) {
      const avgAgeDiff = ageDifferences.reduce((a, b) => a + b, 0) / ageDifferences.length
      preferences.preferredAgeRange = [25 - avgAgeDiff, 25 + avgAgeDiff]
    }
  }

  // Analyze time patterns
  const timePatterns: Record<string, number> = {}
  successfulInteractions.forEach(interaction => {
    const hour = new Date(interaction.timestamp).getHours()
    const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1
  })
  preferences.activeTimePatterns = timePatterns

  // Analyze personality preferences from successful patterns
  const personalityMetrics = successPatterns
    .map(p => p.success_metrics?.personality_compatibility)
    .filter(pc => pc !== undefined)
  
  if (personalityMetrics.length > 0) {
    const avgCompatibility = personalityMetrics.reduce((a, b) => a + b, 0) / personalityMetrics.length
    preferences.personalityPreferences = {
      minimumCompatibility: Math.max(0.3, avgCompatibility - 0.1),
      preferredCompatibility: avgCompatibility
    }
  }

  // Analyze interest patterns
  const interestOverlaps = successPatterns
    .map(p => p.success_metrics?.interest_overlap)
    .filter(io => io !== undefined)
  
  if (interestOverlaps.length > 0) {
    const avgOverlap = interestOverlaps.reduce((a, b) => a + b, 0) / interestOverlaps.length
    preferences.successfulInterestPatterns = {
      minimumOverlap: Math.max(0.1, avgOverlap - 0.1),
      preferredOverlap: avgOverlap
    }
  }

  return preferences
}
