import React from 'react'

export interface AnnouncementBarProps {
  text?: string
}

export function AnnouncementBar({ text = 'AUTUMN COLLECTION 2026 — COMPLIMENTARY EXPRESS DISPATCH ON ORDERS OVER ₦50,000' }: AnnouncementBarProps) {
  return (
    <div className="w-full bg-ink text-bone text-[11px] font-semibold tracking-[0.15em] uppercase py-2.5 overflow-hidden select-none">
      <div className="whitespace-nowrap animate-marquee flex justify-around">
        <span>{text}</span>
        <span className="hidden md:inline">{text}</span>
      </div>
    </div>
  )
}
