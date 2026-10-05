'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface NavProps {
  bagCount?: number
  userRole?: string
}

export function Nav({ bagCount = 0, userRole }: NavProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-[60] w-full h-[96px] bg-nav-bg backdrop-blur-[10px] border-b border-line transition-colors duration-300">
      <div className="relative max-w-[1440px] h-full mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Navigation Links - Hides below 900px */}
        <nav className="hidden min-[900px]:flex items-center space-x-8 text-[12px] font-semibold tracking-[0.12em] uppercase">
          <Link href="/shop" className="hover:opacity-60 transition-opacity">
            Shop
          </Link>
          <Link href="/#cats" className="hover:opacity-60 transition-opacity">
            Categories
          </Link>
          <Link href="/#season" className="hover:opacity-60 transition-opacity">
            Season
          </Link>
          <Link href="/designs" className="hover:opacity-60 transition-opacity">
            Designs
          </Link>
          <Link href="/departments" className="hover:opacity-60 transition-opacity">
            Departments
          </Link>
          <Link href="/atelier" className="hover:opacity-60 transition-opacity">
            Atelier
          </Link>
        </nav>

        {/* Center Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="text-2xl min-[900px]:text-3xl font-black tracking-[-0.04em]">
            SABLE
          </Link>
        </div>

        {/* Right Action Links */}
        <div className="flex items-center space-x-6 text-[12px] font-semibold tracking-[0.12em] uppercase ml-auto">
          {userRole === 'admin' && (
            <Link href="/admin" className="hidden min-[900px]:inline-block hover:opacity-60 transition-opacity text-xs border border-ink px-2 py-1">
              Admin
            </Link>
          )}
          <Link href="/account" className="hover:opacity-60 transition-opacity">
            Account
          </Link>
          <Link href="/cart" className="flex items-center space-x-2 hover:opacity-60 transition-opacity">
            <span>Bag</span>
            <span className="hidden min-[900px]:inline-block text-[10px] bg-ink text-bone px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {bagCount}
            </span>
          </Link>
        </div>
      </div>

      {/* #prog Scroll progress bar (2px high) */}
      <div
        id="prog"
        className="absolute bottom-0 left-0 h-[2px] bg-ink origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${scrollProgress})`, width: '100%' }}
      />
    </header>
  )
}
