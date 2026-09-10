"use client"

import { Info } from 'lucide-react'
import { useEffect, useState } from "react"

interface BusinessHours {
  day_of_week: string
  open_time: string
  close_time: string
  additional_open_time?: string
  additional_close_time?: string
  is_open: boolean
}

interface BusinessHoursModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BusinessHoursModal({ isOpen, onClose }: BusinessHoursModalProps) {
  const [hours, setHours] = useState<BusinessHours[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchBusinessHours()
    }
  }, [isOpen])

  async function fetchBusinessHours() {
    try {
      setLoading(true)
      const response = await fetch("/api/business-hours")
      const data = await response.json()
      setHours(data)
    } catch (error) {
      console.error("[v0] Modal: Error fetching business hours:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const dayNames: Record<string, string> = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo",
  }

  // Format time from 24h to 12h format
  function formatTime(time: string): string {
    if (time.includes("AM") || time.includes("PM")) {
      return time.replace(" ", "")
    }
    
    const [hours, minutes] = time.split(":")
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes}${ampm}`
  }

  // Group consecutive days with same hours
  const openDays = hours.filter((h) => h.is_open)
  const daysList = openDays.map((h) => dayNames[h.day_of_week] || h.day_of_week).join(", ")
  
  // Get representative hours (assuming all open days have similar hours)
  const representativeHours = openDays[0]

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <Info className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Horarios de atención</h2>

        {loading ? (
          <p className="text-gray-600">Cargando horarios...</p>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="text-left">
              <p className="text-gray-700">
                <span className="font-semibold">Días:</span> {daysList || "No disponible"}
              </p>
            </div>

            {representativeHours && (
              <div className="text-left">
                <p className="text-gray-700">
                  <span className="font-semibold">Horario:</span> de {formatTime(representativeHours.open_time)} a{" "}
                  {formatTime(representativeHours.close_time)}
                </p>
                {representativeHours.additional_open_time && representativeHours.additional_close_time && (
                  <p className="text-gray-600 text-sm mt-1">
                    También: de {formatTime(representativeHours.additional_open_time)} a{" "}
                    {formatTime(representativeHours.additional_close_time)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}
