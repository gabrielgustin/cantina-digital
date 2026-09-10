"use client"

import { useState } from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import FloatingWindow from "@/components/backoffice/floating-window"

export function PreviewButton() {
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const storePreviewUrl = "/"

  return (
    <>
      <Button
        className="md:bg-white md:hover:bg-gray-100 md:text-[#1e4b8e] bg-[#1e4b8e] hover:bg-[#163a70] text-white rounded-full md:static md:translate-x-0 md:translate-y-0 fixed bottom-6 right-6 z-50 md:w-auto md:h-auto w-14 h-14 md:flex md:items-center md:justify-center shadow-lg md:shadow-none"
        aria-label="Ver tienda en modo cliente"
        onClick={() => setIsWindowOpen(true)}
      >
        <span className="hidden md:flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Ver tienda en modo cliente
        </span>
        <ExternalLink className="md:hidden h-6 w-6" />
      </Button>

      <FloatingWindow url={storePreviewUrl} isOpen={isWindowOpen} onClose={() => setIsWindowOpen(false)} />
    </>
  )
}

export default PreviewButton
