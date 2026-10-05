// ─────────────────────────────────────────────────────────────────────────────
// Database Types — generated from Phase 0 ERD
// Keep in sync with supabase/migrations/*.sql
// Run `supabase gen types typescript --local` to regenerate from a live schema
// ─────────────────────────────────────────────────────────────────────────────

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// ── Enum types ────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'rep' | 'admin'

export type ProductCategory = 'tshirt' | 'hoodie' | 'jacket' | 'cap' | 'bag' | 'other'

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'ONE_SIZE'

export type DesignStatus = 'draft' | 'saved' | 'shared' | 'archived'

export type DesignElementType = 'text' | 'image' | 'shape' | 'logo'

export type ReservationStatus = 'available' | 'reserved' | 'confirmed' | 'expired' | 'cancelled'

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'in_production'
  | 'quality_check'
  | 'ready_for_dispatch'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

export type PaymentProvider = 'paystack'

export type DeliveryMethod = 'shipping' | 'pickup'

export type ProductView = 'front' | 'back' | 'left' | 'right' | 'detail'

// ── Table row types ───────────────────────────────────────────────────────────

export interface Profile {
  id: string // FK → auth.users
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  university: string | null
  graduation_year: number | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  category: ProductCategory
  base_price: number
  active: boolean
  configuration: Json // print areas, supported options, etc.
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string
  colour: string
  colour_hex: string | null
  size: ProductSize
  price_delta: number // added to base_price; can be negative
  stock_qty: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  is_mockup: boolean
  view: ProductView
  sort_order: number
  created_at: string
}

export interface Design {
  id: string
  user_id: string
  product_id: string
  name: string
  status: DesignStatus
  canvas_config: Json // DesignCanvas serialised state
  preview_url: string | null // signed URL or public thumbnail; never raw storage path
  is_platform_design: boolean
  share_token: string | null // unique token for public preview
  created_at: string
  updated_at: string
}

export interface DesignElement {
  id: string
  design_id: string
  type: DesignElementType
  position: Json // { x: number, y: number }
  dimensions: Json // { w: number, h: number }
  rotation: number
  z_index: number
  content: string | null // text or asset reference
  style: Json // font, color, weight, shape params
  asset_id: string | null // FK → DesignAsset
  created_at: string
  updated_at: string
}

export interface DesignAsset {
  id: string
  user_id: string
  storage_path: string // private; never returned to client
  file_type: string
  mime_type: string
  file_size_bytes: number
  width_px: number | null
  height_px: number | null
  created_at: string
}

export interface Department {
  id: string
  name: string
  slug: string
  university: string | null
  description: string | null
  rep_id: string // FK → profiles
  verified: boolean
  created_at: string
  updated_at: string
}

export interface DepartmentMember {
  id: string
  department_id: string
  user_id: string
  joined_at: string
}

export interface Reservation {
  id: string
  design_id: string
  department_id: string
  created_by: string // FK → profiles
  status: ReservationStatus
  reserved_at: string | null
  expires_at: string | null
  confirmed_at: string | null
  cancelled_at: string | null
}

export interface Cart {
  id: string
  user_id: string // unique
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_variant_id: string
  design_id: string | null
  design_snapshot: Json | null // point-in-time canvas_config copy
  quantity: number
  unit_price: number // server-calculated at add-time
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  department_id: string | null
  status: OrderStatus
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  delivery_method: DeliveryMethod
  shipping_address: Json | null // { line1, line2, city, state, postcode, country }
  notes: string | null
  placed_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_variant_id: string
  design_id: string | null
  design_snapshot: Json | null
  product_snapshot: Json // frozen { name, sku, colour, size, base_price }
  quantity: number
  unit_price: number
  line_total: number
}

export interface Payment {
  id: string
  order_id: string
  user_id: string
  provider: PaymentProvider
  provider_reference: string // Paystack transaction reference — UNIQUE
  amount: number
  currency: string
  status: PaymentStatus
  initialized_at: string
  verified_at: string | null
  webhook_received_at: string | null
  metadata: Json | null
}

export interface PricingTier {
  id: string
  product_id: string | null // null = global fallback
  min_qty: number
  max_qty: number | null // null = unlimited
  unit_price: number
  active: boolean
}

export interface Notification {
  id: string
  user_id: string
  type: string // 'order_placed' | 'payment_confirmed' | 'in_production' | etc.
  title: string
  body: string
  read: boolean
  data: Json | null
  created_at: string
}

export interface AuditLog {
  id: string
  actor_id: string | null
  action: string
  entity_type: string
  entity_id: string
  old_values: Json | null
  new_values: Json | null
  ip_address: string | null
  created_at: string
}

// ── Database schema map (used by Supabase client generics) ────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      product_variants: {
        Row: ProductVariant
        Insert: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductVariant, 'id' | 'created_at'>>
      }
      product_images: {
        Row: ProductImage
        Insert: Omit<ProductImage, 'id' | 'created_at'>
        Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>
      }
      designs: {
        Row: Design
        Insert: Omit<Design, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Design, 'id' | 'created_at'>>
      }
      design_elements: {
        Row: DesignElement
        Insert: Omit<DesignElement, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DesignElement, 'id' | 'created_at'>>
      }
      design_assets: {
        Row: DesignAsset
        Insert: Omit<DesignAsset, 'id' | 'created_at'>
        Update: never
      }
      departments: {
        Row: Department
        Insert: Omit<Department, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Department, 'id' | 'created_at'>>
      }
      department_members: {
        Row: DepartmentMember
        Insert: Omit<DepartmentMember, 'id' | 'joined_at'>
        Update: never
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, 'id'>
        Update: Partial<Omit<Reservation, 'id'>>
      }
      carts: {
        Row: Cart
        Insert: Omit<Cart, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Cart, 'id' | 'created_at'>>
      }
      cart_items: {
        Row: CartItem
        Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CartItem, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'placed_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id' | 'placed_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: never
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id'>
        Update: Partial<Omit<Payment, 'id'>>
      }
      pricing_tiers: {
        Row: PricingTier
        Insert: Omit<PricingTier, 'id'>
        Update: Partial<Omit<PricingTier, 'id'>>
      }
      notifications: {
        Row: Notification
        Insert: Omit<Notification, 'id' | 'created_at'>
        Update: Partial<Pick<Notification, 'read'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_rep: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      product_category: ProductCategory
      product_size: ProductSize
      design_status: DesignStatus
      design_element_type: DesignElementType
      reservation_status: ReservationStatus
      order_status: OrderStatus
      payment_status: PaymentStatus
      payment_provider: PaymentProvider
      delivery_method: DeliveryMethod
      product_view: ProductView
    }
  }
}
