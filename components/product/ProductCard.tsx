'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon } from '@/components/ui/HeartIcon'

export interface ProductCardProps {
  id: string
  slug: string
  name: string
  category: string
  price: number
  imageUrl: string
  onAddToBag?: (id: string) => void
}

export function ProductCard({
  id,
  slug,
  name,
  category,
  price,
  imageUrl,
  onAddToBag,
}: ProductCardProps) {
  const [isFav, setIsFav] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdded(true)
    onAddToBag?.(id)
    setTimeout(() => setAdded(false), 1300)
  }

  return (
    <div className="group relative flex flex-col w-full">
      {/* Image Wrapper - Aspect 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone/50 border border-line">
        <Link href={`/shop/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover img-sable-card group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Favorite heart toggle */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsFav(!isFav)
          }}
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 z-10 p-2 text-ink/70 hover:text-ink transition-colors"
        >
          <HeartIcon
            className={`w-5 h-5 transition-transform ${isFav ? 'fill-ink text-ink scale-110' : ''}`}
          />
        </button>

        {/* Add to Bag button - absolute bottom-10px, opacity-0 hidden till hover */}
        <div className="absolute bottom-[10px] left-[10px] right-[10px] z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAdd}
            className="w-full bg-ink text-bone text-[11px] font-semibold tracking-[0.12em] uppercase py-3 px-4 hover:bg-ink/90 transition-colors shadow-lg"
          >
            {added ? 'Added to Bag' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3 flex items-baseline justify-between text-xs tracking-wider">
        <div>
          <Link href={`/shop/${slug}`} className="font-medium hover:underline block truncate max-w-[180px]">
            {name}
          </Link>
          <span className="text-[10px] text-mid uppercase">{category}</span>
        </div>
        <span className="font-semibold text-ink font-mono">₦{price.toLocaleString()}</span>
      </div>
    </div>
  )
}
