"use client"

import { useState } from "react"
import { ChevronLeft, Share2 } from 'lucide-react'
import Link from "next/link"
import { ShareMenu } from "./share-menu"
import { usePathname } from 'next/navigation'

interface SectionTitleProps {
  title: string
  backUrl?: string
  showShare?: boolean
  productTitle?: string
  variant?: "default" | "compact"
}

export function SectionTitle({
  title,
  backUrl,
  showShare = false,
  productTitle = "",
  variant = "default",
}: SectionTitleProps) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const pathname = usePathname()

  const productUrl = typeof window !== "undefined" ? `${window.location.origin}${pathname}` : ""

  const paddingClass = variant === "compact" ? "py-1" : "py-1 pb-20 md:pb-24"

  return (
    <>
      <div
        className={`w-full px-4 md:px-5 text-white flex items-center justify-between ${paddingClass}`}
        style={{ backgroundColor: 'var(--color-primario)' }}
      >
        <div className="flex items-center">
          {backUrl && (
            <Link href={backUrl} className="mr-2">
              <ChevronLeft size={24} className="md:w-7 md:h-7" />
            </Link>
          )}
          <h2 className="text-2xl md:text-3xl title-font">{title}</h2>
        </div>
        {showShare && (
          <button
            onClick={() => setIsShareMenuOpen(true)}
            className="bg-white px-3 py-1 md:px-4 md:py-2 rounded-md font-semibold flex items-center text-sm md:text-base"
            style={{ color: 'var(--color-primario)' }}
          >
            <Share2 className="mr-1 md:mr-2" size={18} />
            Compartir
          </button>
        )}
      </div>

      <ShareMenu
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        productTitle={productTitle}
        productUrl={productUrl}
      />
    </>
  )
}
