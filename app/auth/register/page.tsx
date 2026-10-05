import { RegisterForm } from '@/components/auth/RegisterForm'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col justify-between">
      <Nav />
      <main className="py-16 px-6">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
