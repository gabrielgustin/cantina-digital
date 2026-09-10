"use client"

import { useState } from "react"
import { BusinessHoursModal } from "./business-hours-modal"

export function ClosedBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="block w-full">
        <div
          className="px-4 py-3 md:py-4 shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
          style={{ backgroundColor: "var(--color-secundario)" }}
        >
          <div className="flex items-center justify-center max-w-7xl mx-auto gap-3">
            <span className="text-3xl md:text-4xl flex-shrink-0">😴</span>
            <div className="flex flex-col items-start flex-1">
              <p className="font-['var(--font-open-sans)'] font-bold text-base md:text-lg text-[#4A3728]">
                En este momento estamos cerrados
              </p>
              <p className="font-['var(--font-open-sans)'] font-normal text-sm text-[#6B5642]">
                Hacé click para consultar nuestros horarios.
              </p>
            </div>
          </div>
        </div>
      </button>

      <BusinessHoursModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
