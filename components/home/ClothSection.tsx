'use client'

import { useEffect, useRef } from 'react'

export interface ClothSectionProps {
  videoUrl?: string
  posterUrl?: string
}

export function ClothSection({
  videoUrl = 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cloth.mp4',
  posterUrl = 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cloth.webp',
}: ClothSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const videoNode = videoRef.current
    if (!videoNode) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!videoNode.src && videoUrl) {
              videoNode.src = videoUrl
              videoNode.load()
            }
            videoNode.play().catch(() => {
              // Auto-play was prevented by browser policy
            })
          } else {
            videoNode.pause()
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(videoNode)
    return () => observer.disconnect()
  }, [videoUrl])

  return (
    <section id="cloth" className="w-full py-24 border-t border-line">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy + Definition List */}
        <div className="rv">
          <span className="text-[11px] font-semibold tracking-[0.15em] text-mid uppercase block mb-3">
            Material Specs
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.04em] mb-6">
            Three cloths, all season.
          </h2>
          <p className="text-sm text-mid leading-relaxed mb-8 max-w-md">
            Engineered physical merchandise built for longevity. High-density combed cotton, heavy gauge knits, and tailored wool blend outerwear.
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-line">
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid mb-1">Heavy Tee</dt>
              <dd className="text-2xl font-black tracking-tight font-mono">280 GSM</dd>
              <p className="text-[11px] text-mid mt-1">Organic combed cotton</p>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid mb-1">Knit Hoodie</dt>
              <dd className="text-2xl font-black tracking-tight font-mono">480 GSM</dd>
              <p className="text-[11px] text-mid mt-1">Loopback french terry</p>
            </div>
            <div>
              <dt className="text-[11px] font-semibold tracking-[0.12em] uppercase text-mid mb-1">Tailored Coat</dt>
              <dd className="text-2xl font-black tracking-tight font-mono">650 GSM</dd>
              <p className="text-[11px] text-mid mt-1">Melton wool blend</p>
            </div>
          </dl>
        </div>

        {/* Right Column: Video with lazy loading IntersectionObserver */}
        <div className="rv relative aspect-[4/5] w-full overflow-hidden border border-line bg-bone/40">
          <video
            ref={videoRef}
            poster={posterUrl}
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover img-sable-cloth"
          />
        </div>
      </div>
    </section>
  )
}
