// TypeScript types for Supabase database
// These match the schema defined in supabase/schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          status: string
          data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          status?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          status?: string
          data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          language: 'en' | 'ar'
          subscribed_to_courses: boolean
          joined_vip: boolean
          current_leverage: number
          current_lot_size: number
          is_admin: boolean
          user_type: 'admin' | 'user' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          language?: 'en' | 'ar'
          subscribed_to_courses?: boolean
          joined_vip?: boolean
          current_leverage?: number
          current_lot_size?: number
          is_admin?: boolean
          user_type?: 'admin' | 'user' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          language?: 'en' | 'ar'
          subscribed_to_courses?: boolean
          joined_vip?: boolean
          current_leverage?: number
          current_lot_size?: number
          is_admin?: boolean
          user_type?: 'admin' | 'user' | 'member'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title_en: string
          title_ar: string
          description_en: string
          description_ar: string
          content_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title_en: string
          title_ar: string
          description_en: string
          description_ar: string
          content_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title_en?: string
          title_ar?: string
          description_en?: string
          description_ar?: string
          content_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          type: 'BUY' | 'SELL'
          entry_price: number
          current_price: number
          pnl: number
          pnl_percent: number
          status: 'OPEN' | 'CLOSED'
          timestamp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          type: 'BUY' | 'SELL'
          entry_price: number
          current_price: number
          pnl: number
          pnl_percent: number
          status?: 'OPEN' | 'CLOSED'
          timestamp?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          type?: 'BUY' | 'SELL'
          entry_price?: number
          current_price?: number
          pnl?: number
          pnl_percent?: number
          status?: 'OPEN' | 'CLOSED'
          timestamp?: string
          created_at?: string
          updated_at?: string
        }
      }
      market_analysis_sections: {
        Row: {
          id: string
          image_url: string
          title_en: string
          title_ar: string
          description_en: string
          description_ar: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          title_en: string
          title_ar: string
          description_en: string
          description_ar: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          title_en?: string
          title_ar?: string
          description_en?: string
          description_ar?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vip_dashboard_previews: {
        Row: {
          id: string
          type: 'latest_signal' | 'expert_insight'
          symbol: string | null
          action: 'BUY' | 'SELL' | null
          price: string | null
          text_en: string | null
          text_ar: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'latest_signal' | 'expert_insight'
          symbol?: string | null
          action?: 'BUY' | 'SELL' | null
          price?: string | null
          text_en?: string | null
          text_ar?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'latest_signal' | 'expert_insight'
          symbol?: string | null
          action?: 'BUY' | 'SELL' | null
          price?: string | null
          text_en?: string | null
          text_ar?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
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

// Convenience types
export type User = Database['public']['Tables']['users']['Row']
export type Course = Database['public']['Tables']['courses']['Row']
export type Trade = Database['public']['Tables']['trades']['Row']
export type MarketAnalysisSection = Database['public']['Tables']['market_analysis_sections']['Row']
export type VipDashboardPreview = Database['public']['Tables']['vip_dashboard_previews']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type CourseInsert = Database['public']['Tables']['courses']['Insert']
export type TradeInsert = Database['public']['Tables']['trades']['Insert']
export type MarketAnalysisSectionInsert = Database['public']['Tables']['market_analysis_sections']['Insert']
export type VipDashboardPreviewInsert = Database['public']['Tables']['vip_dashboard_previews']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type CourseUpdate = Database['public']['Tables']['courses']['Update']
export type TradeUpdate = Database['public']['Tables']['trades']['Update']
export type MarketAnalysisSectionUpdate = Database['public']['Tables']['market_analysis_sections']['Update']
export type VipDashboardPreviewUpdate = Database['public']['Tables']['vip_dashboard_previews']['Update']

