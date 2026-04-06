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
          shipping_address: Json | null
          status: string
          stripe_session_id: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          stripe_session_id: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          shipping_address?: Json | null
          status?: string
          stripe_session_id?: string
          total_amount?: number
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
          id: string
          is_active: boolean | null
          name: string
          stripe_price_id: string | null
          stripe_product_id: string | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
