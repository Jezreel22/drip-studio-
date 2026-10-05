'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Nav } from '@/components/layout/Nav'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/product/ProductCard'
import { ClothSection } from '@/components/home/ClothSection'
import { AtelierSection } from '@/components/home/AtelierSection'

export function SableLandingPage() {
  const [bagCount, setBagCount] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  // Scroll Parallax Logic for Hero Model and Wordmark
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (modelRef.current) {
        const translateY = -0.06 * scrollY
        const scale = 1 + 0.00006 * scrollY
        modelRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`
      }
      if (wordmarkRef.current) {
        const translateY = 0.14 * scrollY
        wordmarkRef.current.style.transform = `translateY(${translateY}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll Reveal Observer
  useEffect(() => {
    const elements = document.querySelectorAll('.rv')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('in')
            }, idx * 70)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const sampleProducts = [
    {
      id: '1',
      slug: 'heavyweight-overshirt',
      name: 'Heavyweight Overshirt',
      category: 'Outerwear',
      price: 45000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-overshirt.webp',
    },
    {
      id: '2',
      slug: 'essential-boxy-tee',
      name: 'Essential Boxy Tee',
      category: 'T-Shirts',
      price: 18000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-tee.webp',
    },
    {
      id: '3',
      slug: 'ribbed-knit-cardigan',
      name: 'Ribbed Knit Cardigan',
      category: 'Knitwear',
      price: 52000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-cardigan.webp',
    },
    {
      id: '4',
      slug: 'structured-wool-knit',
      name: 'Structured Wool Knit',
      category: 'Knitwear',
      price: 48000,
      imageUrl: 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/p-knit.webp',
    },
  ]

  return (
    <div className="w-full min-h-screen bg-bone text-ink flex flex-col">
      <AnnouncementBar />
      <Nav bagCount={bagCount} />

      {/* SECTION 1 - HERO (#hero) */}
      <section
        id="hero"
        ref={heroRef}
        className="relative w-full h-[calc(100vh-96px)] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-line"
      >
        {/* Layer 1 (z-1): Wordmark SABLE */}
        <div
          ref={wordmarkRef}
          className="absolute z-[1] select-none text-[clamp(5rem,18vw,16rem)] font-black tracking-[-0.05em] text-ink opacity-90 transition-transform duration-75"
        >
          SABLE
        </div>

        {/* Layer 2 (z-2): Hero Model Image with Transparency */}
        <div
          ref={modelRef}
          className="relative z-[2] w-full max-w-[500px] h-[85%] transition-transform duration-75"
        >
          <Image
            src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/model.png"
            alt="SABLE Hero Model"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain img-sable-hero"
          />
        </div>

        {/* Layer 4 (z-4): Corner Labels (Absolute) */}
        <div className="absolute top-8 left-6 md:left-12 z-[4] text-[11px] font-semibold tracking-[0.15em] uppercase text-mid">
          Fashion that moves with you
        </div>
        <div className="absolute bottom-8 right-6 md:right-12 z-[4] text-[11px] font-semibold tracking-[0.15em] uppercase text-mid">
          Autumn collection 2026
        </div>
      </section>

      {/* SECTION 2 - CATEGORIES (#cats) */}
      <section id="cats" className="w-full py-24 border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-[-0.04em]">Categories</h2>
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-mid">03 Collections</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Outerwear', img: 'cat-men.webp' },
              { title: 'Knitwear', img: 'cat-women.webp' },
              { title: 'Tailoring', img: 'cat-tailoring.webp' },
            ].map((cat) => (
              <Link
                key={cat.title}
                href="/shop"
                className="group relative aspect-[3/4] w-full overflow-hidden border border-line bg-bone/40 block rv"
              >
                <Image
                  src={`https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/${cat.img}`}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover img-sable-cat group-hover:scale-[1.09] transition-transform duration-700 ease-out"
                />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-bone z-10">
                  <span className="text-lg font-bold tracking-tight bg-ink/80 px-3 py-1 backdrop-blur-sm">
                    {cat.title}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-bone text-ink flex items-center justify-center group-hover:translate-x-1.5 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - SEASON (#season) */}
      <section id="season" className="w-full py-24 border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="rv">
            <span className="text-[11px] font-semibold tracking-[0.15em] text-mid uppercase block mb-3">
              Editorial 2026
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-[-0.04em] mb-6">
              Monochrome Precision.
            </h2>
            <p className="text-sm text-mid leading-relaxed mb-8 max-w-md">
              A refined collection engineered for high-density custom merchandise. Every silhouette is crafted to balance minimal streetwear aesthetics with department durability.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-ink text-bone px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:bg-ink/90 transition-colors"
            >
              Explore Season
            </Link>
          </div>

          <div className="rv relative aspect-[4/5] w-full overflow-hidden border border-line">
            <Image
              src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/season.webp"
              alt="Season Editorial"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover img-sable-season"
            />
          </div>
        </div>
      </section>

      {/* SECTION 4 - SHOP (#shop) */}
      <section id="shop" className="w-full py-24 border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.15em] text-mid uppercase block mb-2">
                Selected Merchandise
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">New Arrivals</h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold tracking-[0.12em] uppercase hover:underline"
            >
              View All Products ({sampleProducts.length}) →
            </Link>
          </div>

          {/* 4-column desktop to 2-column mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleProducts.map((p) => (
              <div key={p.id} className="rv">
                <ProductCard
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  category={p.category}
                  price={p.price}
                  imageUrl={p.imageUrl}
                  onAddToBag={() => setBagCount((prev) => prev + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - LOOKBOOK (#look) */}
      <section id="look" className="w-full py-24 border-b border-line">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="mb-12">
            <span className="text-[11px] font-semibold tracking-[0.15em] text-mid uppercase block mb-2">
              Visual Series
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em]">Lookbook 2026</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 relative aspect-[3/4] border border-line overflow-hidden rv">
              <Image
                src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/look1.webp"
                alt="Look 01"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover img-sable-look"
              />
            </div>
            <div className="md:col-span-7 relative aspect-[4/3] border border-line overflow-hidden rv">
              <Image
                src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/look2.webp"
                alt="Look 02"
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover img-sable-look"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - CLOTH (#cloth) */}
      <ClothSection />

      {/* SECTION 7 - ATELIER (#atelier) */}
      <AtelierSection />

      {/* SECTION 8 - SIGNUP (#signup) */}
      <section id="signup" className="w-full py-24 bg-ink text-bone text-center">
        <div className="max-w-xl mx-auto px-6 rv">
          <span className="text-[11px] font-semibold tracking-[0.15em] text-bone/50 uppercase block mb-3">
            Department & Group Pre-Orders
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] mb-6">
            Reserve Your Design
          </h2>
          <p className="text-xs text-bone/70 leading-relaxed mb-8">
            Create custom department merchandise, reserve artwork for your cohort, and activate bulk student tier pricing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/designs/new"
              className="bg-bone text-ink px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:bg-bone/90 transition-colors"
            >
              Start Design
            </Link>
            <Link
              href="/departments"
              className="border border-bone/40 text-bone px-8 py-4 text-xs font-bold tracking-[0.15em] uppercase hover:border-bone transition-colors"
            >
              Department Hub
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
