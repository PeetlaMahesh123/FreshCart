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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          address: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          slug: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          slug: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          slug?: string
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          discount_price: number | null
          image_url: string | null
          stock: number
          unit: string
          ratings: number
          total_reviews: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          discount_price?: number | null
          image_url?: string | null
          stock?: number
          unit?: string
          ratings?: number
          total_reviews?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          discount_price?: number | null
          image_url?: string | null
          stock?: number
          unit?: string
          ratings?: number
          total_reviews?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cart: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          shipping_address: string
          phone: string
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          shipping_address: string
          phone: string
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_amount?: number
          shipping_address?: string
          phone?: string
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string | null
          user_id: string
          amount: number
          payment_method: string
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          status: 'pending' | 'success' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          user_id: string
          amount: number
          payment_method?: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          status?: 'pending' | 'success' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          user_id?: string
          amount?: number
          payment_method?: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          status?: 'pending' | 'success' | 'failed'
          created_at?: string
        }
      }
      otp_verifications: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          phone: string | null
          otp_code: string
          otp_type: 'email' | 'phone' | 'password_reset'
          expires_at: string
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          phone?: string | null
          otp_code: string
          otp_type: 'email' | 'phone' | 'password_reset'
          expires_at: string
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          phone?: string | null
          otp_code?: string
          otp_type?: 'email' | 'phone' | 'password_reset'
          expires_at?: string
          is_verified?: boolean
          created_at?: string
        }
      }
    }
  }
}
