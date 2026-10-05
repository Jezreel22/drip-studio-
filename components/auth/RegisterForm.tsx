'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/browser'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [university, setUniversity] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            university,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      setError('An unexpected error occurred during registration.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 border border-line bg-bone text-center shadow-sm">
        <h2 className="text-2xl font-black mb-4">Registration Complete</h2>
        <p className="text-xs text-mid leading-relaxed mb-6">
          We have sent a verification link to <strong className="text-ink">{email}</strong>. Please check your inbox to activate your account.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-ink text-bone font-bold text-xs uppercase tracking-wider py-3 px-6 hover:bg-ink/90"
        >
          Return to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 border border-line bg-bone shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
        <p className="text-xs text-mid uppercase tracking-wider">Join SABLE to design and order merchandise</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-900 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-ink">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Morgan"
            className="w-full px-4 py-3 bg-bone border border-line text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-ink">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            className="w-full px-4 py-3 bg-bone border border-line text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-ink">
            University / Institution (Optional)
          </label>
          <input
            type="text"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="University of Lagos"
            className="w-full px-4 py-3 bg-bone border border-line text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-ink">
            Password (Min 8 characters)
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-bone border border-line text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-bone font-bold text-xs uppercase tracking-[0.15em] py-4 hover:bg-ink/90 transition-colors disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-line text-center">
        <p className="text-xs text-mid">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-ink underline hover:opacity-80">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
