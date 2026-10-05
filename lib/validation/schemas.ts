import { z } from 'zod'

// ── Auth Schemas ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  fullName: z.string().min(2, 'Full name is required.'),
  university: z.string().optional(),
  graduationYear: z.coerce.number().min(2024).max(2035).optional(),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// ── Product / Catalogue Schemas ───────────────────────────────────────────────

export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(['featured', 'price_asc', 'price_desc', 'newest']).default('featured'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(12),
})

// ── Cart / Order Schemas ──────────────────────────────────────────────────────

export const addToCartSchema = z.object({
  variantId: z.string().uuid('Invalid variant ID.'),
  designId: z.string().uuid('Invalid design ID.').nullable().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1.').max(500, 'Maximum 500 units per order.'),
})

export const shippingAddressSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required.'),
  phone: z.string().min(10, 'Valid phone number is required.'),
  line1: z.string().min(5, 'Address line 1 is required.'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  postcode: z.string().optional(),
  country: z.string().default('Nigeria'),
})

export const checkoutSchema = z.object({
  deliveryMethod: z.enum(['shipping', 'pickup']),
  shippingAddress: shippingAddressSchema.optional(),
  notes: z.string().max(500).optional(),
})

// ── Department / Reservation Schemas ──────────────────────────────────────────

export const createDepartmentOrderSchema = z.object({
  departmentId: z.string().uuid(),
  designId: z.string().uuid(),
  productId: z.string().uuid(),
  expectedQuantity: z.number().int().min(5, 'Minimum 5 items for bulk orders.'),
  title: z.string().min(3, 'Order title is required.'),
  notes: z.string().optional(),
})

// Types derived from schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type ProductFilterInput = z.infer<typeof productFilterSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type CreateDepartmentOrderInput = z.infer<typeof createDepartmentOrderSchema>
