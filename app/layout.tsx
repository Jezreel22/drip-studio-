import { Archivo } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SABLE — Custom Merchandise E-Commerce',
  description: 'High-end, bespoke physical merchandise and custom editorial design platform for university departments and groups.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-bone text-ink selection:bg-ink selection:text-bone">
        {children}
      </body>
    </html>
  )
}
