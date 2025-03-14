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
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          body_part: string | null
          clinic_id: number | null
          created_at: string | null
          description: string | null
          doctor_id: number | null
          id: string
          notification_methods: string[]
          patient_id: string | null
          status: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          body_part?: string | null
          clinic_id?: number | null
          created_at?: string | null
          description?: string | null
          doctor_id?: number | null
          id?: string
          notification_methods?: string[]
          patient_id?: string | null
          status?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          body_part?: string | null
          clinic_id?: number | null
          created_at?: string | null
          description?: string | null
          doctor_id?: number | null
          id?: string
          notification_methods?: string[]
          patient_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_consents: {
        Row: {
          additional_data: Json | null
          consent_date: string
          consent_given: boolean
          consent_type: string
          consent_version: string
          created_at: string
          id: string
          ip_address: string | null
          patient_id: string
        }
        Insert: {
          additional_data?: Json | null
          consent_date?: string
          consent_given?: boolean
          consent_type: string
          consent_version: string
          created_at?: string
          id?: string
          ip_address?: string | null
          patient_id: string
        }
        Update: {
          additional_data?: Json | null
          consent_date?: string
          consent_given?: boolean
          consent_type?: string
          consent_version?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          patient_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          ai_analyzed_data: Json | null
          allergies: string | null
          blood_type: string | null
          chronic_conditions: string | null
          created_at: string | null
          current_medications: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string | null
          id: string
          insurance_number: string | null
          insurance_provider: string | null
          last_name: string | null
          phone_number: string
          primary_physician: string | null
          profile_photo: string | null
          smoker: boolean | null
          updated_at: string | null
          voice_preferences: Json | null
        }
        Insert: {
          address?: string | null
          ai_analyzed_data?: Json | null
          allergies?: string | null
          blood_type?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string | null
          id: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          phone_number: string
          primary_physician?: string | null
          profile_photo?: string | null
          smoker?: boolean | null
          updated_at?: string | null
          voice_preferences?: Json | null
        }
        Update: {
          address?: string | null
          ai_analyzed_data?: Json | null
          allergies?: string | null
          blood_type?: string | null
          chronic_conditions?: string | null
          created_at?: string | null
          current_medications?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string | null
          id?: string
          insurance_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          phone_number?: string
          primary_physician?: string | null
          profile_photo?: string | null
          smoker?: boolean | null
          updated_at?: string | null
          voice_preferences?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extract_profile_info: {
        Args: {
          conversation_text: string
        }
        Returns: Json
      }
      set_huggingface_token: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
