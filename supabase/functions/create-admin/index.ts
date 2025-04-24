
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the user
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: 'hunainm.qureshi@gmail.com',
      password: 'Samurai14@',
      email_confirm: true
    })

    if (createUserError) throw createUserError
    if (!userData.user) throw new Error('No user was created')

    // Call the create_admin_user function to set up the profile and role
    const { error: adminError } = await supabaseAdmin.rpc(
      'create_admin_user',
      { 
        email: 'hunainm.qureshi@gmail.com',
        user_id: userData.user.id
      }
    )

    if (adminError) throw adminError

    return new Response(
      JSON.stringify({ message: 'Admin user created successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
