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
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_match_admin: {
        Row: {
          banner_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          title: string
          tournament_id: string | null
          updated_at: string
          youtube_live_url: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          title: string
          tournament_id?: string | null
          updated_at?: string
          youtube_live_url?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          title?: string
          tournament_id?: string | null
          updated_at?: string
          youtube_live_url?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string | null
          game: string
          id: string
          player1: string
          player1_score: number
          player2: string
          player2_score: number
          start_time: string
          status: string
          thumbnail: string | null
          tournament_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game: string
          id?: string
          player1: string
          player1_score?: number
          player2: string
          player2_score?: number
          start_time: string
          status?: string
          thumbnail?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game?: string
          id?: string
          player1?: string
          player1_score?: number
          player2?: string
          player2_score?: number
          start_time?: string
          status?: string
          thumbnail?: string | null
          tournament_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          avatar: string | null
          country: string | null
          created_at: string | null
          earnings: number | null
          id: string
          losses: number
          name: string
          points: number
          rank: number
          team: string | null
          tournaments_won: number | null
          updated_at: string | null
          win_rate: number | null
          wins: number
        }
        Insert: {
          avatar?: string | null
          country?: string | null
          created_at?: string | null
          earnings?: number | null
          id?: string
          losses?: number
          name: string
          points?: number
          rank: number
          team?: string | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
          wins?: number
        }
        Update: {
          avatar?: string | null
          country?: string | null
          created_at?: string | null
          earnings?: number | null
          id?: string
          losses?: number
          name?: string
          points?: number
          rank?: number
          team?: string | null
          tournaments_won?: number | null
          updated_at?: string | null
          win_rate?: number | null
          wins?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          earnings: number | null
          email: string | null
          game_id: string | null
          game_user_id: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          earnings?: number | null
          email?: string | null
          game_id?: string | null
          game_user_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          earnings?: number | null
          email?: string | null
          game_id?: string | null
          game_user_id?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo: string | null
          name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo?: string | null
          name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tournament_registrations: {
        Row: {
          created_at: string
          id: string
          is_team_captain: boolean | null
          payment_amount: number | null
          payment_status: string | null
          player_game_id: string
          player_name: string
          registration_date: string
          team_id: string | null
          tournament_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_team_captain?: boolean | null
          payment_amount?: number | null
          payment_status?: string | null
          player_game_id: string
          player_name: string
          registration_date?: string
          team_id?: string | null
          tournament_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_team_captain?: boolean | null
          payment_amount?: number | null
          payment_status?: string | null
          player_game_id?: string
          player_name?: string
          registration_date?: string
          team_id?: string | null
          tournament_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_rooms: {
        Row: {
          created_at: string
          id: string
          room_id: string | null
          room_password: string | null
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id?: string | null
          room_password?: string | null
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string | null
          room_password?: string | null
          tournament_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_rooms_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: true
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_teams: {
        Row: {
          created_at: string
          current_members: number
          id: string
          is_full: boolean
          max_members: number
          team_captain_id: string
          team_name: string
          team_size: number
          tournament_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_members?: number
          id?: string
          is_full?: boolean
          max_members?: number
          team_captain_id: string
          team_name: string
          team_size?: number
          tournament_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_members?: number
          id?: string
          is_full?: boolean
          max_members?: number
          team_captain_id?: string
          team_name?: string
          team_size?: number
          tournament_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          banner: string | null
          created_at: string | null
          current_participants: number
          description: string | null
          end_date: string
          end_time: string | null
          entry_fee: string | null
          format: string | null
          game: string
          highlights: string[] | null
          id: string
          image: string | null
          max_participants: number
          name: string
          organizer: string | null
          overview_content: Json | null
          prize_pool: string
          prizes: string | null
          prizes_content: Json | null
          region: string | null
          registration_closes: string | null
          registration_opens: string | null
          rules: string | null
          schedule: string | null
          schedule_content: Json | null
          start_date: string
          start_time: string | null
          status: string
          team_size: string | null
          timer_duration: number | null
          timer_is_running: boolean | null
          timer_start_time: string | null
          updated_at: string | null
          winners: string | null
        }
        Insert: {
          banner?: string | null
          created_at?: string | null
          current_participants?: number
          description?: string | null
          end_date: string
          end_time?: string | null
          entry_fee?: string | null
          format?: string | null
          game: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          max_participants?: number
          name: string
          organizer?: string | null
          overview_content?: Json | null
          prize_pool: string
          prizes?: string | null
          prizes_content?: Json | null
          region?: string | null
          registration_closes?: string | null
          registration_opens?: string | null
          rules?: string | null
          schedule?: string | null
          schedule_content?: Json | null
          start_date: string
          start_time?: string | null
          status?: string
          team_size?: string | null
          timer_duration?: number | null
          timer_is_running?: boolean | null
          timer_start_time?: string | null
          updated_at?: string | null
          winners?: string | null
        }
        Update: {
          banner?: string | null
          created_at?: string | null
          current_participants?: number
          description?: string | null
          end_date?: string
          end_time?: string | null
          entry_fee?: string | null
          format?: string | null
          game?: string
          highlights?: string[] | null
          id?: string
          image?: string | null
          max_participants?: number
          name?: string
          organizer?: string | null
          overview_content?: Json | null
          prize_pool?: string
          prizes?: string | null
          prizes_content?: Json | null
          region?: string | null
          registration_closes?: string | null
          registration_opens?: string | null
          rules?: string | null
          schedule?: string | null
          schedule_content?: Json | null
          start_date?: string
          start_time?: string | null
          status?: string
          team_size?: string | null
          timer_duration?: number | null
          timer_is_running?: boolean | null
          timer_start_time?: string | null
          updated_at?: string | null
          winners?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_balances: {
        Row: {
          available_balance: number
          created_at: string
          id: string
          pending_balance: number
          total_deposited: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          total_deposited?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_balance?: number
          created_at?: string
          id?: string
          pending_balance?: number
          total_deposited?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          admin_notes: string | null
          amount: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          payment_method: string | null
          status: string
          transaction_reference: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: string
          transaction_reference?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: string
          transaction_reference?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
