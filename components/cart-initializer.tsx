"use client"

import { useEffect } from "react"

export function CartInitializer() {
  useEffect(() => {
    // Limpiar el localStorage directamente al iniciar la aplicación
    localStorage.removeItem("tupedido-cart")
    // Solo ejecutar una vez al montar el componente
  }, []) // Array de dependencias vacío

  return null
}
