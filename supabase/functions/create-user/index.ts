
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

    // Create the user with your email and password
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: 'hunainm.qureshi@gmail.com',
      password: '3469710121',
      email_confirm: true
    })

    if (createUserError) {
      console.log('User might already exist, trying to get existing user...')
      // Try to get existing user
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      if (listError) throw listError
      
      const existingUser = users.find(user => user.email === 'hunainm.qureshi@gmail.com')
      if (!existingUser) throw new Error('Could not create or find user')
      
      // Update password for existing user
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: '3469710121' }
      )
      
      if (updateError) throw updateError
      
      return new Response(
        JSON.stringify({ 
          message: 'User password updated successfully',
          user_id: existingUser.id,
          email: existingUser.email
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    if (!userData.user) throw new Error('No user was created')

    // Create profile for the user
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userData.user.id,
        username: 'hunainm',
        full_name: 'Hunain Qureshi',
        onboarding_completed: false
      })
    
    if (profileError) {
      console.log('Profile creation error:', profileError.message)
    }

    return new Response(
      JSON.stringify({ 
        message: 'User created successfully',
        user_id: userData.user.id,
        email: userData.user.email
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
