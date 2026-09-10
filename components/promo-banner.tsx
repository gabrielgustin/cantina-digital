"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { useState } from "react"

interface PromoBannerProps {
  text: string
}

export function PromoBanner({ text }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!text || !isVisible) return null

  return (
    <div className="px-4 py-3 md:py-4 shadow-sm relative" style={{ backgroundColor: "var(--color-secundario)" }}>
      <div className="flex items-center justify-center max-w-7xl mx-auto gap-3">
        <div className="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
          <Image
            src="/icons/anuncio.png"
            alt="Anuncio"
            fill
            className="object-contain"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(23%) sepia(52%) saturate(1547%) hue-rotate(156deg) brightness(93%) contrast(101%)",
            }}
          />
        </div>

        <div className="flex flex-col items-start flex-1">
          <p className="announcement-title font-['var(--font-open-sans)'] font-bold text-sm uppercase text-[#004b57] tracking-[0.5px]">
            PROMOCIÓN
          </p>
          <p className="announcement-body font-['var(--font-open-sans)'] font-normal text-[13px] uppercase text-[#004b57] tracking-[0.3px] line-clamp-2">
            {text}
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 text-[#004b57] hover:opacity-70 transition-opacity p-1"
          aria-label="Cerrar banner"
        >
          <X className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  )
}
