import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, addToCartSchema } from '@/lib/validation/schemas'

describe('Validation Schemas', () => {
  it('validates correct login credentials', () => {
    const result = loginSchema.safeParse({
      email: 'student@university.edu',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email in login', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short passwords in registration', () => {
    const result = registerSchema.safeParse({
      email: 'student@university.edu',
      password: '123',
      fullName: 'John Doe',
    })
    expect(result.success).toBe(false)
  })

  it('validates add-to-cart payload', () => {
    const result = addToCartSchema.safeParse({
      variantId: '123e4567-e89b-12d3-a456-426614174000',
      quantity: 2,
    })
    expect(result.success).toBe(true)
  })

  it('rejects negative quantity in cart', () => {
    const result = addToCartSchema.safeParse({
      variantId: '123e4567-e89b-12d3-a456-426614174000',
      quantity: -1,
    })
    expect(result.success).toBe(false)
  })
})
