import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col justify-between">
      <Nav />
      <main className="py-16 px-6">
        <Suspense fallback={<div className="text-center text-xs uppercase tracking-widest text-mid py-12">Loading Auth...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
