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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: string
          id: string
          ip_address: string | null
          resource_id: string
          resource_type: string
          user_agent: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          action: string
          created_at?: string
          details: string
          id?: string
          ip_address?: string | null
          resource_id: string
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string
          id?: string
          ip_address?: string | null
          resource_id?: string
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          fingerprint: string
          id: string
          issuer: string
          public_key: string
          serial_number: string
          status: Database["public"]["Enums"]["certificate_status"]
          subject: string
          updated_at: string
          user_id: string
          valid_from: string
          valid_to: string
        }
        Insert: {
          created_at?: string
          fingerprint: string
          id?: string
          issuer?: string
          public_key: string
          serial_number: string
          status?: Database["public"]["Enums"]["certificate_status"]
          subject: string
          updated_at?: string
          user_id: string
          valid_from?: string
          valid_to?: string
        }
        Update: {
          created_at?: string
          fingerprint?: string
          id?: string
          issuer?: string
          public_key?: string
          serial_number?: string
          status?: Database["public"]["Enums"]["certificate_status"]
          subject?: string
          updated_at?: string
          user_id?: string
          valid_from?: string
          valid_to?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          completed_at: string | null
          created_at: string
          current_signer_index: number
          description: string | null
          expires_at: string | null
          file_name: string
          file_path: string | null
          file_size: number
          id: string
          status: Database["public"]["Enums"]["document_status"]
          title: string
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string
          uploaded_by: string
          version: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_signer_index?: number
          description?: string | null
          expires_at?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          title: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          uploaded_by: string
          version?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_signer_index?: number
          description?: string | null
          expires_at?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          title?: string
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
          uploaded_by?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          certificate_expiry: string | null
          certificate_status:
            | Database["public"]["Enums"]["certificate_status"]
            | null
          created_at: string
          department: string | null
          email: string
          employee_id: string | null
          id: string
          last_login: string | null
          name: string
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          certificate_expiry?: string | null
          certificate_status?:
            | Database["public"]["Enums"]["certificate_status"]
            | null
          created_at?: string
          department?: string | null
          email: string
          employee_id?: string | null
          id?: string
          last_login?: string | null
          name?: string
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          certificate_expiry?: string | null
          certificate_status?:
            | Database["public"]["Enums"]["certificate_status"]
            | null
          created_at?: string
          department?: string | null
          email?: string
          employee_id?: string | null
          id?: string
          last_login?: string | null
          name?: string
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      signature_requests: {
        Row: {
          certificate_id: string | null
          created_at: string
          document_id: string
          id: string
          rejected_at: string | null
          rejection_reason: string | null
          requested_at: string
          sign_order: number
          signature_data: string | null
          signed_at: string | null
          signer_email: string
          signer_id: string
          signer_name: string
          status: Database["public"]["Enums"]["signature_status"]
          updated_at: string
        }
        Insert: {
          certificate_id?: string | null
          created_at?: string
          document_id: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          sign_order?: number
          signature_data?: string | null
          signed_at?: string | null
          signer_email: string
          signer_id: string
          signer_name: string
          status?: Database["public"]["Enums"]["signature_status"]
          updated_at?: string
        }
        Update: {
          certificate_id?: string | null
          created_at?: string
          document_id?: string
          id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          requested_at?: string
          sign_order?: number
          signature_data?: string | null
          signed_at?: string | null
          signer_email?: string
          signer_id?: string
          signer_name?: string
          status?: Database["public"]["Enums"]["signature_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "faculty" | "staff" | "student"
      certificate_status: "active" | "expired" | "revoked" | "pending"
      document_status: "draft" | "pending" | "signed" | "rejected" | "expired"
      document_type:
        | "certificate"
        | "transcript"
        | "marksheet"
        | "project_approval"
        | "bonafide_letter"
        | "administrative_form"
        | "other"
      signature_status: "pending" | "completed" | "rejected" | "expired"
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
      app_role: ["admin", "faculty", "staff", "student"],
      certificate_status: ["active", "expired", "revoked", "pending"],
      document_status: ["draft", "pending", "signed", "rejected", "expired"],
      document_type: [
        "certificate",
        "transcript",
        "marksheet",
        "project_approval",
        "bonafide_letter",
        "administrative_form",
        "other",
      ],
      signature_status: ["pending", "completed", "rejected", "expired"],
    },
  },
} as const
