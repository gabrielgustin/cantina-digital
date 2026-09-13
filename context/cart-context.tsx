"use client"

import { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  imageUrl: string
  productId?: string
  variantId?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)

  // Cargar carrito desde localStorage solo una vez al iniciar
  useEffect(() => {
    // Intentar cargar el carrito desde localStorage
    try {
      const savedCart = localStorage.getItem("tupedido-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error)
      // Si hay un error, limpiar el localStorage
      localStorage.removeItem("tupedido-cart")
    }
  }, []) // Solo se ejecuta una vez al montar el componente

  // Actualizar el contador de items cuando cambia el carrito
  useEffect(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    setItemCount(count)

    // Calculate total price
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(totalPrice)

    // Guardar en localStorage solo si hay items
    if (items.length > 0) {
      localStorage.setItem("tupedido-cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("tupedido-cart")
    }
  }, [items])

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      // Verificar si el item ya existe en el carrito
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex >= 0) {
        // Si existe, actualizar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Si no existe, añadir el nuevo item
        return [...prevItems, newItem]
      }
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
