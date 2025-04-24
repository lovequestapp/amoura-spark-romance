export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          drinking: string | null
          education: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          height: number | null
          id: string
          is_admin_account: boolean | null
          onboarding_completed: boolean | null
          onboarding_step: number | null
          photos: string[] | null
          prompts: Json[] | null
          pronouns: string | null
          relationship_type: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          drinking?: string | null
          education?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id: string
          is_admin_account?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          photos?: string[] | null
          prompts?: Json[] | null
          pronouns?: string | null
          relationship_type?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          drinking?: string | null
          education?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id?: string
          is_admin_account?: boolean | null
          onboarding_completed?: boolean | null
          onboarding_step?: number | null
          photos?: string[] | null
          prompts?: Json[] | null
          pronouns?: string | null
          relationship_type?: string | null
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
      assign_admin_role: {
        Args: { user_id_param: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
