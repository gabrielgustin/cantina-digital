"use client"

import { useEffect } from "react"
import { useAppColors } from "@/hooks/use-app-colors"

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const { colors, loading } = useAppColors()

  useEffect(() => {
    if (!loading) {
      console.log("[v0] ColorProvider: Injecting colors into :root", colors)
      
      const root = document.documentElement
      root.style.setProperty("--color-primario", colors.color_primario)
      root.style.setProperty("--color-secundario", colors.color_secundario)
      root.style.setProperty("--color-acento", colors.color_acento)
      root.style.setProperty("--color-fondo", colors.color_fondo)
      root.style.setProperty("--color-texto", colors.color_texto)
    }
  }, [colors, loading])

  return <>{children}</>
}
