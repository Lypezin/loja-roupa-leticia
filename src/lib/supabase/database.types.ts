export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
          variation_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
          variation_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
          variation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          id: string
          payment_checkout_id: string | null
          payment_external_id: string | null
          payment_method: string | null
          payment_provider: string | null
          payment_raw_status: string | null
          payment_receipt_url: string | null
          payment_transaction_id: string | null
          shipping_company_name: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_delivery_days: number | null
          shipping_provider: string | null
          shipping_provider_cost: number | null
          shipping_quote_payload: Json | null
          shipping_service_id: string | null
          shipping_service_name: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_checkout_id?: string | null
          payment_external_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_raw_status?: string | null
          payment_receipt_url?: string | null
          payment_transaction_id?: string | null
          shipping_company_name?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_delivery_days?: number | null
          shipping_provider?: string | null
          shipping_provider_cost?: number | null
          shipping_quote_payload?: Json | null
          shipping_service_id?: string | null
          shipping_service_name?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          payment_checkout_id?: string | null
          payment_external_id?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          payment_raw_status?: string | null
          payment_receipt_url?: string | null
          payment_transaction_id?: string | null
          shipping_company_name?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_delivery_days?: number | null
          shipping_provider?: string | null
          shipping_provider_cost?: number | null
          shipping_quote_payload?: Json | null
          shipping_service_id?: string | null
          shipping_service_name?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_attempts: {
        Row: {
          checkout_id: string | null
          checkout_url: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_tax_id: string
          external_id: string
          id: string
          payment_method: string | null
          provider: string
          raw_response: Json | null
          receipt_url: string | null
          shipping_company_name: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_delivery_days: number | null
          shipping_provider: string | null
          shipping_provider_cost: number | null
          shipping_quote_payload: Json | null
          shipping_service_id: string | null
          shipping_service_name: string | null
          status: string
          total_amount: number
          trusted_items: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          checkout_id?: string | null
          checkout_url?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_tax_id: string
          external_id: string
          id?: string
          payment_method?: string | null
          provider: string
          raw_response?: Json | null
          receipt_url?: string | null
          shipping_company_name?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_delivery_days?: number | null
          shipping_provider?: string | null
          shipping_provider_cost?: number | null
          shipping_quote_payload?: Json | null
          shipping_service_id?: string | null
          shipping_service_name?: string | null
          status?: string
          total_amount: number
          trusted_items: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          checkout_id?: string | null
          checkout_url?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customer_tax_id?: string
          external_id?: string
          id?: string
          payment_method?: string | null
          provider?: string
          raw_response?: Json | null
          receipt_url?: string | null
          shipping_company_name?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_delivery_days?: number | null
          shipping_provider?: string | null
          shipping_provider_cost?: number | null
          shipping_quote_payload?: Json | null
          shipping_service_id?: string | null
          shipping_service_name?: string | null
          status?: string
          total_amount?: number
          trusted_items?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variations: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          product_id: string | null
          size: string | null
          sku: string | null
          stock_quantity: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          size?: string | null
          sku?: string | null
          stock_quantity?: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          size?: string | null
          sku?: string | null
          stock_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          height_cm: number | null
          id: string
          is_active: boolean | null
          length_cm: number | null
          name: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          height_cm?: number | null
          id?: string
          is_active?: boolean | null
          length_cm?: number | null
          name: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          height_cm?: number | null
          id?: string
          is_active?: boolean | null
          length_cm?: number | null
          name?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_integrations: {
        Row: {
          access_token: string
          account_email: string | null
          account_name: string | null
          created_at: string
          environment: string
          expires_at: string
          id: string
          metadata: Json | null
          provider: string
          refresh_token: string
          scope: string | null
          token_type: string | null
          updated_at: string
        }
        Insert: {
          access_token: string
          account_email?: string | null
          account_name?: string | null
          created_at?: string
          environment: string
          expires_at: string
          id?: string
          metadata?: Json | null
          provider: string
          refresh_token: string
          scope?: string | null
          token_type?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string
          account_email?: string | null
          account_name?: string | null
          created_at?: string
          environment?: string
          expires_at?: string
          id?: string
          metadata?: Json | null
          provider?: string
          refresh_token?: string
          scope?: string | null
          token_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
        store_settings: {
          Row: {
            categories_section_label: string | null
            categories_section_title: string | null
            countdown_end: string | null
          footer_about_text: string | null
          footer_newsletter_subtitle: string | null
          footer_newsletter_title: string | null
          free_shipping_threshold: number | null
          hero_badge_text: string | null
          hero_button_text: string | null
          hero_image_url: string | null
          hero_secondary_button_text: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram_url: string | null
          processing_days: number | null
          products_section_label: string | null
          products_section_title: string | null
          shipping_origin_zip: string | null
            store_description: string | null
            store_name: string
            support_email: string | null
            trust_banner_1_desc: string | null
            trust_banner_1_title: string | null
            trust_banner_2_desc: string | null
            trust_banner_2_title: string | null
            trust_banner_3_desc: string | null
            trust_banner_3_title: string | null
            trust_banner_4_desc: string | null
            trust_banner_4_title: string | null
            updated_at: string | null
            whatsapp_number: string | null
          }
          Insert: {
          categories_section_label?: string | null
          categories_section_title?: string | null
          countdown_end?: string | null
          footer_about_text?: string | null
          footer_newsletter_subtitle?: string | null
          footer_newsletter_title?: string | null
          free_shipping_threshold?: number | null
          hero_badge_text?: string | null
          hero_button_text?: string | null
          hero_image_url?: string | null
          hero_secondary_button_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          processing_days?: number | null
          products_section_label?: string | null
          products_section_title?: string | null
          shipping_origin_zip?: string | null
            store_description?: string | null
            store_name?: string
            support_email?: string | null
            trust_banner_1_desc?: string | null
            trust_banner_1_title?: string | null
            trust_banner_2_desc?: string | null
            trust_banner_2_title?: string | null
            trust_banner_3_desc?: string | null
            trust_banner_3_title?: string | null
            trust_banner_4_desc?: string | null
            trust_banner_4_title?: string | null
            updated_at?: string | null
            whatsapp_number?: string | null
          }
          Update: {
          categories_section_label?: string | null
          categories_section_title?: string | null
          countdown_end?: string | null
          footer_about_text?: string | null
          footer_newsletter_subtitle?: string | null
          footer_newsletter_title?: string | null
          free_shipping_threshold?: number | null
          hero_badge_text?: string | null
          hero_button_text?: string | null
          hero_image_url?: string | null
          hero_secondary_button_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          processing_days?: number | null
          products_section_label?: string | null
          products_section_title?: string | null
          shipping_origin_zip?: string | null
            store_description?: string | null
            store_name?: string
            support_email?: string | null
            trust_banner_1_desc?: string | null
            trust_banner_1_title?: string | null
            trust_banner_2_desc?: string | null
            trust_banner_2_title?: string | null
            trust_banner_3_desc?: string | null
            trust_banner_3_title?: string | null
            trust_banner_4_desc?: string | null
            trust_banner_4_title?: string | null
            updated_at?: string | null
            whatsapp_number?: string | null
          }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: { p_quantity: number; p_variation_id: string }
        Returns: boolean
      }
      finalize_checkout_order: {
        Args: {
          p_customer_email: string
          p_customer_name: string
          p_items: Json
          p_payment_intent_id: string
          p_shipping_address: Json
          p_stripe_session_id: string
          p_total_amount: number
          p_user_id: string
        }
        Returns: {
          action: string
          order_id: string
        }[]
      }
      finalize_payment_order: {
        Args: {
          p_checkout_id: string
          p_customer_email: string
          p_customer_name: string
          p_external_id: string
          p_items: Json
          p_payment_method: string
          p_payment_raw_status: string
          p_payment_receipt_url: string
          p_provider: string
          p_shipping_address: Json
          p_total_amount: number
          p_transaction_id: string
          p_user_id: string
        }
        Returns: {
          action: string
          order_id: string
        }[]
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
