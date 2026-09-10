"use client"

import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { usePathname } from "next/navigation"

export const ViewCartButton = memo(function ViewCartButton() {
  const router = useRouter()
  const pathname = usePathname()
  const { items } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Determinar si estamos en la página de detalle de producto
  const isProductDetailPage = pathname.includes("/productos/") && pathname.split("/").length > 3

  const calculateTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [items])

  const formatPrice = useCallback((price: number) => {
    return `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }, [])

  // Mostrar el botón con animación cuando hay items en el carrito
  useEffect(() => {
    if (items.length > 0) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [items.length])

  const handleClick = useCallback(() => {
    router.push("/carrito")
  }, [router])

  // Si no hay items o no está animando, no renderizar nada
  if (!isAnimating) return null

  // Si estamos en la página de carrito, en la página de detalle de producto, o en la página de finalizar pedido, no mostrar el botón
  if (pathname === "/carrito" || pathname === "/finalizar-pedido" || isProductDetailPage) return null

  return (
    <div
      className={`fixed bottom-[calc(15px+48px)] left-0 right-0 z-30 transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="w-[90%] mx-auto">
        <button
          onClick={handleClick}
          className="w-full flex justify-between items-center bg-tupedido-blue text-white py-2 md:py-3 px-5 md:px-6 rounded-md shadow-lg"
        >
          <span className="font-bold text-base md:text-lg product-title-font text-white">Ver mi pedido</span>
          <span className="font-bold text-base md:text-lg">{formatPrice(calculateTotal)}</span>
        </button>
      </div>
    </div>
  )
})
