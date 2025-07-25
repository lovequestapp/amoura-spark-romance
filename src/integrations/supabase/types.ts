export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          comments: number | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          user_id: string | null
        }
        Insert: {
          comments?: number | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
        }
        Update: {
          comments?: number | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          updated_at: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          updated_at?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          updated_at?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      interests: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      lifestyle_preferences: {
        Row: {
          created_at: string | null
          diet: string | null
          drinking: string | null
          exercise: string | null
          has_children: boolean | null
          id: string
          pets: string | null
          smoking: string | null
          updated_at: string | null
          user_id: string
          wants_children: boolean | null
        }
        Insert: {
          created_at?: string | null
          diet?: string | null
          drinking?: string | null
          exercise?: string | null
          has_children?: boolean | null
          id?: string
          pets?: string | null
          smoking?: string | null
          updated_at?: string | null
          user_id: string
          wants_children?: boolean | null
        }
        Update: {
          created_at?: string | null
          diet?: string | null
          drinking?: string | null
          exercise?: string | null
          has_children?: boolean | null
          id?: string
          pets?: string | null
          smoking?: string | null
          updated_at?: string | null
          user_id?: string
          wants_children?: boolean | null
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          created_at: string | null
          id: string
          intention_score: number | null
          interests_score: number | null
          lifestyle_score: number | null
          location_score: number | null
          ml_confidence: number | null
          ml_enhanced: boolean | null
          overall_score: number
          personality_score: number | null
          success_probability: number | null
          target_user_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          intention_score?: number | null
          interests_score?: number | null
          lifestyle_score?: number | null
          location_score?: number | null
          ml_confidence?: number | null
          ml_enhanced?: boolean | null
          overall_score?: number
          personality_score?: number | null
          success_probability?: number | null
          target_user_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          intention_score?: number | null
          interests_score?: number | null
          lifestyle_score?: number | null
          location_score?: number | null
          ml_confidence?: number | null
          ml_enhanced?: boolean | null
          overall_score?: number
          personality_score?: number | null
          success_probability?: number | null
          target_user_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          seen_at: string | null
          sender_id: string
          voice_url: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          seen_at?: string | null
          sender_id: string
          voice_url?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          seen_at?: string | null
          sender_id?: string
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          item_type: string
          price_cents: number
          product_category: string
          product_name: string
          quantity: number
          status: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          item_type: string
          price_cents: number
          product_category: string
          product_name: string
          quantity: number
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          item_type?: string
          price_cents?: number
          product_category?: string
          product_name?: string
          quantity?: number
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      personality_traits: {
        Row: {
          created_at: string | null
          id: string
          name: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          id: string
          post_id: string | null
          tag: string
        }
        Insert: {
          id?: string
          post_id?: string | null
          tag: string
        }
        Update: {
          id?: string
          post_id?: string | null
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration_days: number | null
          features: string[] | null
          id: string
          is_active: boolean | null
          name: string
          price_cents: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration_days?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name: string
          price_cents: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration_days?: number | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_cents?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profile_likes: {
        Row: {
          created_at: string
          id: string
          liked_profile_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          liked_profile_id: string
          liker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          liked_profile_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      profile_prompts: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          question: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          question: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: string
          viewed_at: string
          viewed_id: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          viewed_at?: string
          viewed_id?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          viewed_at?: string
          viewed_id?: string | null
          viewer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          attachment_style: string | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          dating_history: Json | null
          dealbreakers: string[] | null
          drinking: string | null
          education: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          height: number | null
          id: string
          is_admin_account: boolean | null
          latitude: number | null
          longitude: number | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          photos: string[] | null
          prompts: Json[] | null
          pronouns: string | null
          relationship_type: string | null
          timeline_expectations: string | null
          trait_preferences: Json | null
          updated_at: string
          username: string | null
        }
        Insert: {
          attachment_style?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          dating_history?: Json | null
          dealbreakers?: string[] | null
          drinking?: string | null
          education?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id: string
          is_admin_account?: boolean | null
          latitude?: number | null
          longitude?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          photos?: string[] | null
          prompts?: Json[] | null
          pronouns?: string | null
          relationship_type?: string | null
          timeline_expectations?: string | null
          trait_preferences?: Json | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          attachment_style?: string | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          dating_history?: Json | null
          dealbreakers?: string[] | null
          drinking?: string | null
          education?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id?: string
          is_admin_account?: boolean | null
          latitude?: number | null
          longitude?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          photos?: string[] | null
          prompts?: Json[] | null
          pronouns?: string | null
          relationship_type?: string | null
          timeline_expectations?: string | null
          trait_preferences?: Json | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          boost_until: string | null
          created_at: string
          email: string
          id: string
          remaining_rewinds: number | null
          remaining_super_likes: number | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          boost_until?: string | null
          created_at?: string
          email: string
          id?: string
          remaining_rewinds?: number | null
          remaining_super_likes?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          boost_until?: string | null
          created_at?: string
          email?: string
          id?: string
          remaining_rewinds?: number | null
          remaining_super_likes?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          item_type: string
          quantity_changed: number
          remaining_quantity: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          item_type: string
          quantity_changed: number
          remaining_quantity: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          item_type?: string
          quantity_changed?: number
          remaining_quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          interest_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          interest_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          interest_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_interest_id_fkey"
            columns: ["interest_id"]
            isOneToOne: false
            referencedRelation: "interests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          item_type: string
          quantity: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          item_type: string
          quantity?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          item_type?: string
          quantity?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_online_status: {
        Row: {
          is_online: boolean | null
          last_seen: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          product_id: string | null
          quantity: number | null
          total_price_cents: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          product_id?: string | null
          quantity?: number | null
          total_price_cents: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          product_id?: string | null
          quantity?: number | null
          total_price_cents?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          completed_profiles: number | null
          paid_subscribers: number | null
          total_profile_views: number | null
          total_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_to_inventory: {
        Args: {
          user_id_param: string
          item_type_param: string
          quantity_param: number
          expires_at_param?: string
        }
        Returns: undefined
      }
      assign_admin_role: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      calculate_match_score: {
        Args: { user_id_param: string; target_user_id_param: string }
        Returns: number
      }
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_admin_user: {
        Args: { email: string; user_id: string }
        Returns: undefined
      }
      get_profile_views: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          viewer_id: string
          viewed_at: string
        }[]
      }
      get_subscriber_data: {
        Args: { user_id_param: string }
        Returns: {
          remaining_rewinds: number
          remaining_super_likes: number
          boost_until: string
        }[]
      }
      get_user_inventory: {
        Args: { user_id_param: string }
        Returns: {
          item_type: string
          quantity: number
          expires_at: string
        }[]
      }
      has_inventory_item: {
        Args: {
          user_id_param: string
          item_type_param: string
          min_quantity_param?: number
        }
        Returns: boolean
      }
      has_liked_post: {
        Args: { post_id_param: string }
        Returns: boolean
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      like_post: {
        Args: { post_id_param: string }
        Returns: Json
      }
      process_purchase: {
        Args: {
          user_id_param: string
          product_name_param: string
          product_category_param: string
          item_type_param: string
          quantity_param: number
          price_cents_param: number
          stripe_session_id_param?: string
        }
        Returns: string
      }
      track_user_activity: {
        Args: {
          user_id_param: string
          activity_type_param: string
          metadata_param?: Json
        }
        Returns: undefined
      }
      unlike_post: {
        Args: { post_id_param: string }
        Returns: Json
      }
      update_boost_until: {
        Args: { user_id_param: string; boost_until_param: string }
        Returns: undefined
      }
      update_remaining_rewinds: {
        Args: { user_id_param: string; new_value: number }
        Returns: undefined
      }
      update_remaining_super_likes: {
        Args: { user_id_param: string; new_value: number }
        Returns: undefined
      }
      update_user_online_status: {
        Args: { user_id_param: string; is_online_param?: boolean }
        Returns: undefined
      }
      use_inventory_item: {
        Args: {
          user_id_param: string
          item_type_param: string
          quantity_param?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      gender_type: "woman" | "man" | "nonbinary" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      gender_type: ["woman", "man", "nonbinary", "other"],
    },
  },
} as const
