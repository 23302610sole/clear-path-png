export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          auth_migrated: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          auth_migrated?: boolean | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          auth_migrated?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      clearance_records: {
        Row: {
          amount_owing: number | null
          approval_timestamp: string | null
          books_outstanding: number | null
          cleared_at: string | null
          cleared_by: string | null
          created_at: string
          date_of_cancellation: string | null
          department: string
          digital_signature: string | null
          equipment_outstanding: string | null
          id: string
          notes: string | null
          status: string
          student_id: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          amount_owing?: number | null
          approval_timestamp?: string | null
          books_outstanding?: number | null
          cleared_at?: string | null
          cleared_by?: string | null
          created_at?: string
          date_of_cancellation?: string | null
          department: string
          digital_signature?: string | null
          equipment_outstanding?: string | null
          id?: string
          notes?: string | null
          status?: string
          student_id: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          amount_owing?: number | null
          approval_timestamp?: string | null
          books_outstanding?: number | null
          cleared_at?: string | null
          cleared_by?: string | null
          created_at?: string
          date_of_cancellation?: string | null
          department?: string
          digital_signature?: string | null
          equipment_outstanding?: string | null
          id?: string
          notes?: string | null
          status?: string
          student_id?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "clearance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clearance_records_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "department_users"
            referencedColumns: ["id"]
          },
        ]
      }
      department_users: {
        Row: {
          auth_migrated: boolean | null
          created_at: string
          department: string
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          auth_migrated?: boolean | null
          created_at?: string
          department: string
          email: string
          full_name: string
          id?: string
          role: string
          updated_at?: string
        }
        Update: {
          auth_migrated?: boolean | null
          created_at?: string
          department?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      property_returns: {
        Row: {
          chair_returned: boolean | null
          created_at: string
          id: string
          key_returned: boolean | null
          mattress_returned: boolean | null
          notes: string | null
          proxy_card_returned: boolean | null
          student_id: string
          updated_at: string
          verification_date: string | null
          verification_signature: string | null
          verified_by: string | null
        }
        Insert: {
          chair_returned?: boolean | null
          created_at?: string
          id?: string
          key_returned?: boolean | null
          mattress_returned?: boolean | null
          notes?: string | null
          proxy_card_returned?: boolean | null
          student_id: string
          updated_at?: string
          verification_date?: string | null
          verification_signature?: string | null
          verified_by?: string | null
        }
        Update: {
          chair_returned?: boolean | null
          created_at?: string
          id?: string
          key_returned?: boolean | null
          mattress_returned?: boolean | null
          notes?: string | null
          proxy_card_returned?: boolean | null
          student_id?: string
          updated_at?: string
          verification_date?: string | null
          verification_signature?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_returns_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      room_inspections: {
        Row: {
          approval_date: string | null
          ceiling_notes: string | null
          ceiling_status: string | null
          created_at: string
          door_notes: string | null
          door_status: string | null
          flywire_notes: string | null
          flywire_status: string | null
          id: string
          light_switches_notes: string | null
          light_switches_status: string | null
          lights_notes: string | null
          lights_status: string | null
          lock_notes: string | null
          lock_status: string | null
          lodge_name: string | null
          lodge_number: string | null
          power_points_notes: string | null
          power_points_status: string | null
          student_id: string
          study_table_notes: string | null
          study_table_status: string | null
          sub_warden_approved: boolean | null
          sub_warden_name: string | null
          sub_warden_signature: string | null
          updated_at: string
          walls_notes: string | null
          walls_status: string | null
        }
        Insert: {
          approval_date?: string | null
          ceiling_notes?: string | null
          ceiling_status?: string | null
          created_at?: string
          door_notes?: string | null
          door_status?: string | null
          flywire_notes?: string | null
          flywire_status?: string | null
          id?: string
          light_switches_notes?: string | null
          light_switches_status?: string | null
          lights_notes?: string | null
          lights_status?: string | null
          lock_notes?: string | null
          lock_status?: string | null
          lodge_name?: string | null
          lodge_number?: string | null
          power_points_notes?: string | null
          power_points_status?: string | null
          student_id: string
          study_table_notes?: string | null
          study_table_status?: string | null
          sub_warden_approved?: boolean | null
          sub_warden_name?: string | null
          sub_warden_signature?: string | null
          updated_at?: string
          walls_notes?: string | null
          walls_status?: string | null
        }
        Update: {
          approval_date?: string | null
          ceiling_notes?: string | null
          ceiling_status?: string | null
          created_at?: string
          door_notes?: string | null
          door_status?: string | null
          flywire_notes?: string | null
          flywire_status?: string | null
          id?: string
          light_switches_notes?: string | null
          light_switches_status?: string | null
          lights_notes?: string | null
          lights_status?: string | null
          lock_notes?: string | null
          lock_status?: string | null
          lodge_name?: string | null
          lodge_number?: string | null
          power_points_notes?: string | null
          power_points_status?: string | null
          student_id?: string
          study_table_notes?: string | null
          study_table_status?: string | null
          sub_warden_approved?: boolean | null
          sub_warden_name?: string | null
          sub_warden_signature?: string | null
          updated_at?: string
          walls_notes?: string | null
          walls_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_inspections_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          auth_migrated: boolean | null
          campus_hall: string | null
          clearance_initiated_at: string | null
          clearance_reason:
            | Database["public"]["Enums"]["clearance_reason"]
            | null
          course_code: string | null
          created_at: string
          department: string
          email: string
          forwarding_address: string | null
          full_name: string
          home_address: string | null
          id: string
          phone: string | null
          room_number: string | null
          sponsor: string | null
          student_id: string
          updated_at: string
          year_level: string | null
        }
        Insert: {
          auth_migrated?: boolean | null
          campus_hall?: string | null
          clearance_initiated_at?: string | null
          clearance_reason?:
            | Database["public"]["Enums"]["clearance_reason"]
            | null
          course_code?: string | null
          created_at?: string
          department: string
          email: string
          forwarding_address?: string | null
          full_name: string
          home_address?: string | null
          id?: string
          phone?: string | null
          room_number?: string | null
          sponsor?: string | null
          student_id: string
          updated_at?: string
          year_level?: string | null
        }
        Update: {
          auth_migrated?: boolean | null
          campus_hall?: string | null
          clearance_initiated_at?: string | null
          clearance_reason?:
            | Database["public"]["Enums"]["clearance_reason"]
            | null
          course_code?: string | null
          created_at?: string
          department?: string
          email?: string
          forwarding_address?: string | null
          full_name?: string
          home_address?: string | null
          id?: string
          phone?: string | null
          room_number?: string | null
          sponsor?: string | null
          student_id?: string
          updated_at?: string
          year_level?: string | null
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "department_officer" | "admin"
      clearance_reason:
        | "discontinue"
        | "end_of_year"
        | "withdrawal"
        | "non_residence"
        | "exclusion"
        | "industrial"
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
      app_role: ["student", "department_officer", "admin"],
      clearance_reason: [
        "discontinue",
        "end_of_year",
        "withdrawal",
        "non_residence",
        "exclusion",
        "industrial",
      ],
    },
  },
} as const
