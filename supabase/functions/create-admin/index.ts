
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

    // Create the user with your email
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: 'hunaincardinal@gmail.com',
      password: 'AdminPass123!',
      email_confirm: true
    })

    if (createUserError) {
      console.log('User might already exist, trying to get existing user...')
      // Try to get existing user
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      if (listError) throw listError
      
      const existingUser = users.find(user => user.email === 'hunaincardinal@gmail.com')
      if (!existingUser) throw new Error('Could not create or find user')
      
      userData.user = existingUser
    }

    if (!userData.user) throw new Error('No user was created or found')

    // Call the create_admin_user function to set up the profile and role
    const { error: adminError } = await supabaseAdmin.rpc(
      'create_admin_user',
      { 
        email: 'hunaincardinal@gmail.com',
        user_id: userData.user.id
      }
    )

    if (adminError) {
      console.log('Admin setup error, might already exist:', adminError.message)
      // Still try to assign admin role directly
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: userData.user.id,
          role: 'admin'
        })
      
      if (roleError) console.log('Role assignment error:', roleError.message)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created/updated successfully',
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
