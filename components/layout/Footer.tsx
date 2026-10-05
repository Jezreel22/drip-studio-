'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full bg-ink text-bone pt-20 pb-12 border-t border-line">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-black tracking-[-0.04em] mb-6">SABLE</h2>
          <p className="text-xs text-bone/70 leading-relaxed max-w-xs">
            High-end physical merchandise and custom editorial design platform for university departments, clubs, and individuals.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.12em] uppercase mb-4 text-bone/50">Explore</h3>
          <ul className="space-y-3 text-xs tracking-wider uppercase font-medium">
            <li><Link href="/shop" className="hover:text-bone/70 transition-opacity">Catalogue</Link></li>
            <li><Link href="/#cats" className="hover:text-bone/70 transition-opacity">Categories</Link></li>
            <li><Link href="/designs" className="hover:text-bone/70 transition-opacity">Design Studio</Link></li>
            <li><Link href="/departments" className="hover:text-bone/70 transition-opacity">Department Orders</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.12em] uppercase mb-4 text-bone/50">Atelier</h3>
          <p className="text-xs text-bone/70 leading-relaxed mb-2">
            SABLE Studio Ltd<br />
            18 Redchurch Street<br />
            Shoreditch, London E2 7DD
          </p>
          <p className="text-xs text-bone/50 font-mono">contact@sable-studio.com</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-[0.12em] uppercase mb-4 text-bone/50">Newsletter</h3>
          <p className="text-xs text-bone/70 mb-4">Subscribe for seasonal drops and limited department reservations.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="bg-transparent border border-bone/30 px-3 py-2 text-xs w-full text-bone placeholder:text-bone/40 focus:outline-none focus:border-bone"
            />
            <button
              type="submit"
              className="bg-bone text-ink px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-bone/90 transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-8 border-t border-bone/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-bone/40 tracking-wider">
        <p>© 2026 SABLE Studio Ltd. All rights reserved.</p>
        <p className="mt-2 md:mt-0 font-mono">Production-Grade Custom Merchandise E-Commerce Platform</p>
      </div>
    </footer>
  )
}
