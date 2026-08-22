export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      audit_leads: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          email: string;
          id: string;
          income_range: string | null;
          name: string;
          phone: string | null;
          preferred_consultation_time: string | null;
          preferred_date: string | null;
          primary_financial_concern: string | null;
          profession: string | null;
          source: string | null;
          status: string;
          updated_at: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          income_range?: string | null;
          name: string;
          phone?: string | null;
          preferred_consultation_time?: string | null;
          preferred_date?: string | null;
          primary_financial_concern?: string | null;
          profession?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          income_range?: string | null;
          name?: string;
          phone?: string | null;
          preferred_consultation_time?: string | null;
          preferred_date?: string | null;
          primary_financial_concern?: string | null;
          profession?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author: string | null;
          category: string | null;
          content: string;
          created_at: string;
          excerpt: string | null;
          featured_image: string | null;
          id: string;
          is_sample: boolean;
          published_at: string | null;
          reading_time: number | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          status: string;
          subtitle: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_sample?: boolean;
          published_at?: string | null;
          reading_time?: number | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          status?: string;
          subtitle?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string;
          excerpt?: string | null;
          featured_image?: string | null;
          id?: string;
          is_sample?: boolean;
          published_at?: string | null;
          reading_time?: number | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          status?: string;
          subtitle?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          admin_notes: string | null;
          booking_date: string | null;
          booking_fee: number;
          booking_time: string | null;
          created_at: string;
          email: string;
          id: string;
          name: string;
          notes: string | null;
          payment_reference: string | null;
          payment_status: string;
          phone: string | null;
          plan_price: string | null;
          service: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          booking_date?: string | null;
          booking_fee?: number;
          booking_time?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          name: string;
          notes?: string | null;
          payment_reference?: string | null;
          payment_status?: string;
          phone?: string | null;
          plan_price?: string | null;
          service: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          booking_date?: string | null;
          booking_fee?: number;
          booking_time?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          name?: string;
          notes?: string | null;
          payment_reference?: string | null;
          payment_status?: string;
          phone?: string | null;
          plan_price?: string | null;
          service?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consultation_requests: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string | null;
          name: string;
          phone: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          service: string | null;
          source: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message?: string | null;
          name: string;
          phone?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          service?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string | null;
          name?: string;
          phone?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          service?: string | null;
          source?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_entries: {
        Row: {
          admin_notes: string | null;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          profession: string | null;
          source: string | null;
          status: string;
          subject: string | null;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          profession?: string | null;
          source?: string | null;
          status?: string;
          subject?: string | null;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          profession?: string | null;
          source?: string | null;
          status?: string;
          subject?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          active: boolean;
          answer: string;
          created_at: string;
          display_order: number;
          id: string;
          question: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          answer: string;
          created_at?: string;
          display_order?: number;
          id?: string;
          question: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          answer?: string;
          created_at?: string;
          display_order?: number;
          id?: string;
          question?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          active: boolean;
          created_at: string;
          cta_label: string | null;
          description: string | null;
          display_order: number;
          features: string[] | null;
          highlighted: boolean;
          id: string;
          name: string;
          price: string | null;
          price_interval: string | null;
          tagline: string | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          cta_label?: string | null;
          description?: string | null;
          display_order?: number;
          features?: string[] | null;
          highlighted?: boolean;
          id?: string;
          name: string;
          price?: string | null;
          price_interval?: string | null;
          tagline?: string | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          cta_label?: string | null;
          description?: string | null;
          display_order?: number;
          features?: string[] | null;
          highlighted?: boolean;
          id?: string;
          name?: string;
          price?: string | null;
          price_interval?: string | null;
          tagline?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          active: boolean;
          client_name: string;
          company: string | null;
          created_at: string;
          display_order: number;
          id: string;
          image_url: string | null;
          is_sample: boolean;
          profession: string | null;
          quote: string;
          rating: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          client_name: string;
          company?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          is_sample?: boolean;
          profession?: string | null;
          quote: string;
          rating?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          client_name?: string;
          company?: string | null;
          created_at?: string;
          display_order?: number;
          id?: string;
          image_url?: string | null;
          is_sample?: boolean;
          profession?: string | null;
          quote?: string;
          rating?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      website_content: {
        Row: {
          key: string;
          section: string | null;
          updated_at: string;
          value: string | null;
        };
        Insert: {
          key: string;
          section?: string | null;
          updated_at?: string;
          value?: string | null;
        };
        Update: {
          key?: string;
          section?: string | null;
          updated_at?: string;
          value?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_admin: { Args: never; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "editor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const;
