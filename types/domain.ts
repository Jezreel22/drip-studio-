// ─────────────────────────────────────────────────────────────────────────────
// Domain types — application-level types built on top of raw database types.
// These are what React components and lib functions work with.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Profile,
  Product,
  ProductVariant,
  ProductImage,
  Design,
  DesignElement,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Department,
  Reservation,
  PricingTier,
} from './database'

// ── Re-export raw types for convenience ───────────────────────────────────────
export type {
  Profile,
  Product,
  ProductVariant,
  ProductImage,
  Design,
  DesignElement,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Department,
  Reservation,
  PricingTier,
}

// ── Enriched / joined types ───────────────────────────────────────────────────

/** Product with its variants and images pre-joined (used in catalogue & detail) */
export interface ProductWithDetails extends Product {
  variants: ProductVariant[]
  images: ProductImage[]
}

/** Cart item with joined product variant and design info */
export interface CartItemWithDetails extends CartItem {
  product_variant: ProductVariant & { product: Product }
  design: Design | null
}

/** Cart with all items (used in cart & checkout) */
export interface CartWithItems extends Cart {
  items: CartItemWithDetails[]
}

/** Order with items (used in order history & detail) */
export interface OrderWithItems extends Order {
  items: (OrderItem & {
    product_variant: ProductVariant & { product: Product }
  })[]
  payment: Payment | null
}

/** Design with its elements (used in the editor and design detail) */
export interface DesignWithElements extends Design {
  elements: DesignElement[]
  product: Product
}

/** Department with its rep profile */
export interface DepartmentWithRep extends Department {
  rep: Profile
  member_count: number
}

/** Reservation with design and department */
export interface ReservationWithDetails extends Reservation {
  design: Design
  department: Department
  created_by_profile: Profile
}

// ── Editor canvas types ───────────────────────────────────────────────────────

export interface CanvasPosition {
  x: number
  y: number
}

export interface CanvasDimensions {
  w: number
  h: number
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: 400 | 500 | 600 | 700 | 800 | 900
  color: string
  textAlign: 'left' | 'center' | 'right'
  italic: boolean
  underline: boolean
  lineHeight: number
  letterSpacing: number
}

export interface ShapeStyle {
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  borderRadius: number
}

export interface EditorElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'logo'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  locked: boolean
  visible: boolean
  // text
  content?: string
  textStyle?: TextStyle
  // image/logo
  assetId?: string
  assetPreviewUrl?: string // ephemeral signed URL for editor display only
  // shape
  shapeType?: 'rect' | 'circle' | 'triangle'
  shapeStyle?: ShapeStyle
}

export interface DesignCanvas {
  printAreaWidth: number  // in design units (maps to print dimensions)
  printAreaHeight: number
  backgroundColor: string
  elements: EditorElement[]
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export interface PriceBreakdown {
  basePrice: number       // product base price
  variantDelta: number    // size/colour adjustment
  unitPrice: number       // effective per-unit price (after tier)
  quantity: number
  subtotal: number        // unitPrice × quantity
  deliveryFee: number
  discount: number
  total: number
  tierApplied: PricingTier | null
}

// ── Shared design preview (public, safe to serialise) ─────────────────────────

export interface SharedDesignPreview {
  shareToken: string
  designName: string
  productName: string
  productSlug: string
  previewUrl: string
  canvasConfig: DesignCanvas
}

// ── Shipping address ──────────────────────────────────────────────────────────

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postcode: string
  country: string
  recipientName: string
  phone: string
}

// ── Notification types ────────────────────────────────────────────────────────

export type NotificationType =
  | 'order_placed'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'production_started'
  | 'order_ready'
  | 'out_for_delivery'
  | 'order_delivered'
  | 'design_reserved'
  | 'reservation_expired'
  | 'bulk_order_submitted'

// ── API response wrappers ─────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: {
    code: string
    message: string // safe, user-facing
  }
}

export type ApiResult<T> = ApiSuccess<T> | ApiError

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}
