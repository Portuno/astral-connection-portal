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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          user1_auth_id: string | null
          user2_auth_id: string | null
          created_at: string
          updated_at: string
          last_message_at: string | null
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          user1_auth_id?: string | null
          user2_auth_id?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          user1_auth_id?: string | null
          user2_auth_id?: string | null
          created_at?: string
          updated_at?: string
          last_message_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          sender_auth_id: string | null
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          sender_auth_id?: string | null
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          sender_auth_id?: string | null
          content?: string
          created_at?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          user_id: string
          subscription_id: string | null
          amount_cents: number
          currency: string
          status: string
          payment_method: string
          external_payment_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id?: string | null
          amount_cents: number
          currency?: string
          status: string
          payment_method: string
          external_payment_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string | null
          amount_cents?: number
          currency?: string
          status?: string
          payment_method?: string
          external_payment_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          name: string
          age: number
          sign: string
          moon_sign: string
          rising_sign: string
          description: string
          photo_url: string | null
          compatibility_score: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          age: number
          sign: string
          moon_sign: string
          rising_sign: string
          description: string
          photo_url?: string | null
          compatibility_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          sign?: string
          moon_sign?: string
          rising_sign?: string
          description?: string
          photo_url?: string | null
          compatibility_score?: number
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          plan_type: string
          amount_cents: number
          currency: string
          start_date: string
          end_date: string | null
          stripe_subscription_id: string | null
          square_subscription_id: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status: string
          plan_type?: string
          amount_cents?: number
          currency?: string
          start_date: string
          end_date?: string | null
          stripe_subscription_id?: string | null
          square_subscription_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          plan_type?: string
          amount_cents?: number
          currency?: string
          start_date?: string
          end_date?: string | null
          stripe_subscription_id?: string | null
          square_subscription_id?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      temporary_profiles: {
        Row: {
          id: string
          session_id: string
          full_name: string
          gender: string
          birth_date: string
          birth_time: string
          birth_place: string
          looking_for: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          full_name: string
          gender: string
          birth_date: string
          birth_time: string
          birth_place: string
          looking_for: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          full_name?: string
          gender?: string
          birth_date?: string
          birth_time?: string
          birth_place?: string
          looking_for?: string
          created_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string
          created_at: string
          full_name: string
          gender: string
          id: string
          looking_for: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time: string
          created_at?: string
          full_name: string
          gender: string
          id?: string
          looking_for: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string
          created_at?: string
          full_name?: string
          gender?: string
          id?: string
          looking_for?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          birth_date: string | null
          birth_time: string | null
          birth_place: string | null
          gender: string | null
          looking_for: string | null
          onboarding_completed: boolean
          is_premium: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          gender?: string | null
          looking_for?: string | null
          onboarding_completed?: boolean
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          birth_time?: string | null
          birth_place?: string | null
          gender?: string | null
          looking_for?: string | null
          onboarding_completed?: boolean
          is_premium?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: {
          user_uuid: string
        }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          has_premium: boolean
          onboarding_completed: boolean
        }[]
      }
      user_has_active_subscription: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
