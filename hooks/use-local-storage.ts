"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  // Pasamos la función de inicialización a useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      // Obtener del localStorage por key
      const item = window.localStorage.getItem(key)
      // Analizar el JSON almacenado o devolver initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Si hay error, devolver initialValue
      console.log(error)
      return initialValue
    }
  })

  // Función para actualizar el localStorage y el estado
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función para seguir el mismo patrón que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Guardar al estado
      setStoredValue(valueToStore)
      // Guardar al localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // Un error más sofisticado podría ser manejado aquí
      console.log(error)
    }
  }

  // Sincronizar con otros tabs/ventanas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key])

  return [storedValue, setValue] as const
}
