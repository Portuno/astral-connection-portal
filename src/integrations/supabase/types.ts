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
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_message: string | null
          last_message_date: string | null
          profile_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_date?: string | null
          profile_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_message?: string | null
          last_message_date?: string | null
          profile_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "chat_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          message: string
          sender_type: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message: string
          sender_type: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_profiles: {
        Row: {
          age: number
          avatar_url: string | null
          compatibility_score: number | null
          created_at: string
          description: string
          id: string
          interests: string[]
          is_active: boolean | null
          location: string
          name: string
          personality: string
          zodiac_sign: string
        }
        Insert: {
          age: number
          avatar_url?: string | null
          compatibility_score?: number | null
          created_at?: string
          description: string
          id?: string
          interests: string[]
          is_active?: boolean | null
          location: string
          name: string
          personality: string
          zodiac_sign: string
        }
        Update: {
          age?: number
          avatar_url?: string | null
          compatibility_score?: number | null
          created_at?: string
          description?: string
          id?: string
          interests?: string[]
          is_active?: boolean | null
          location?: string
          name?: string
          personality?: string
          zodiac_sign?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          birth_time: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          onboarding_completed: boolean | null
          updated_at: string
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          birth_time?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          ascendant_sign: string | null
          birth_city: string
          birth_country: string
          birth_date: string
          birth_latitude: number | null
          birth_longitude: number | null
          birth_place: string
          birth_time: string
          compatibility_notes: string | null
          completed_at: string | null
          created_at: string | null
          full_name: string
          id: string
          is_completed: boolean | null
          jupiter_sign: string | null
          mars_sign: string | null
          mercury_sign: string | null
          moon_sign: string | null
          onboarding_step: number | null
          personality_description: string | null
          saturn_sign: string | null
          strengths: string[] | null
          sun_sign: string | null
          updated_at: string | null
          user_id: string | null
          venus_sign: string | null
        }
        Insert: {
          ascendant_sign?: string | null
          birth_city: string
          birth_country: string
          birth_date: string
          birth_latitude?: number | null
          birth_longitude?: number | null
          birth_place: string
          birth_time: string
          compatibility_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          is_completed?: boolean | null
          jupiter_sign?: string | null
          mars_sign?: string | null
          mercury_sign?: string | null
          moon_sign?: string | null
          onboarding_step?: number | null
          personality_description?: string | null
          saturn_sign?: string | null
          strengths?: string[] | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id?: string | null
          venus_sign?: string | null
        }
        Update: {
          ascendant_sign?: string | null
          birth_city?: string
          birth_country?: string
          birth_date?: string
          birth_latitude?: number | null
          birth_longitude?: number | null
          birth_place?: string
          birth_time?: string
          compatibility_notes?: string | null
          completed_at?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          is_completed?: boolean | null
          jupiter_sign?: string | null
          mars_sign?: string | null
          mercury_sign?: string | null
          moon_sign?: string | null
          onboarding_step?: number | null
          personality_description?: string | null
          saturn_sign?: string | null
          strengths?: string[] | null
          sun_sign?: string | null
          updated_at?: string | null
          user_id?: string | null
          venus_sign?: string | null
        }
        Relationships: []
      }
      user_payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          email: string
          id: string
          payment_date: string | null
          payment_status: string | null
          square_payment_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          payment_date?: string | null
          payment_status?: string | null
          square_payment_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          payment_date?: string | null
          payment_status?: string | null
          square_payment_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_registrations: {
        Row: {
          birth_date: string
          birth_place: string
          birth_time: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          birth_date: string
          birth_place: string
          birth_time?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          birth_date?: string
          birth_place?: string
          birth_time?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
