'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase/browser'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 border border-line bg-bone shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">Sign In</h1>
        <p className="text-xs text-mid uppercase tracking-wider">Access your SABLE account and saved designs</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-900 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink">
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-[10px] text-mid hover:text-ink uppercase tracking-wider transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-bone border border-line text-sm text-ink focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-bone font-bold text-xs uppercase tracking-[0.15em] py-4 hover:bg-ink/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-line text-center">
        <p className="text-xs text-mid">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-ink underline hover:opacity-80">
            Create One
          </Link>
        </p>
      </div>
    </div>
  )
}
