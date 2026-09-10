"use client"

import { useState, useEffect } from "react"

export interface AppColors {
  color_primario: string
  color_secundario: string
  color_acento: string
  color_fondo: string
  color_texto: string
}

const defaultColors: AppColors = {
  color_primario: "#1e4b8e",
  color_secundario: "#2c5aa0",
  color_acento: "#ff6b35",
  color_fondo: "#f8f9fa",
  color_texto: "#212529",
}

export function useAppColors() {
  const [colors, setColors] = useState<AppColors>(defaultColors)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchColors() {
      try {
        console.log("[v0] useAppColors: Fetching colors from API")
        const response = await fetch("/api/site-colors")
        
        if (!response.ok) {
          throw new Error("Failed to fetch colors")
        }
        
        const data = await response.json()
        console.log("[v0] useAppColors: Colors received:", data)
        setColors(data)
      } catch (error) {
        console.error("[v0] Error fetching app colors, using defaults:", error)
        setColors(defaultColors)
      } finally {
        setLoading(false)
      }
    }

    fetchColors()
  }, [])

  return { colors, loading }
}
