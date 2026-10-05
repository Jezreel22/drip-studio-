'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

export interface AtelierSectionProps {
  imageUrl?: string
}

export function AtelierSection({
  imageUrl = 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/atelier.webp',
}: AtelierSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  const [people, setPeople] = useState(0)
  const [styles, setStyles] = useState(0)
  const [units, setUnits] = useState(0)

  // Cubic-bezier(0.19, 1, 0.22, 1) ease-out counter helper
  const animateValue = useCallback((
    start: number,
    end: number,
    duration: number,
    setter: (v: number) => void
  ) => {
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(start + (end - start) * easeProgress)
      setter(current)
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setter(end)
      }
    }
    requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node || hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasAnimated(true)
            animateValue(0, 11, 1500, setPeople)
            animateValue(0, 42, 1800, setStyles)
            animateValue(0, 120, 2000, setUnits)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasAnimated, animateValue])

  return (
    <section ref={sectionRef} id="atelier" className="w-full py-24 border-t border-line">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Image */}
        <div className="rv relative aspect-[4/5] w-full overflow-hidden border border-line">
          <Image
            src={imageUrl}
            alt="SABLE Atelier Studio"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover img-sable-atelier"
            loading="lazy"
          />
        </div>

        {/* Right Column: Copy + Stats */}
        <div className="rv">
          <span className="text-[11px] font-semibold tracking-[0.15em] text-mid uppercase block mb-3">
            Our Studio
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] mb-6">
            Crafted with intent.
          </h2>
          <p className="text-sm text-mid leading-relaxed mb-10 max-w-md">
            Every garment from SABLE is developed in-house at our Shoreditch atelier. From pattern drafting to high-density screen printing and custom department embroidery.
          </p>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-line">
            <div>
              <div className="text-4xl md:text-5xl font-black tracking-tight font-mono mb-1">
                {people}
              </div>
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid">
                People
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black tracking-tight font-mono mb-1">
                {styles}
              </div>
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid">
                Styles
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black tracking-tight font-mono mb-1">
                {units}
              </div>
              <div className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid">
                Units/Day
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
