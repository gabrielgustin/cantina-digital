"use client"

import Link from "next/link"
import { Home, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { usePathname } from "next/navigation"

export function BottomNav() {
  const { itemCount } = useCart()
  const pathname = usePathname()

  // Verificar si estamos en la página de detalle de producto o en la página de carrito
  const isProductDetailPage = pathname.includes("/productos/") && pathname.split("/").length > 3
  const isCartPage = pathname === "/carrito"
  const isCheckoutPage = pathname === "/finalizar-pedido"

  // No mostrar el navbar en la página de detalle de producto, carrito o finalizar pedido
  if (isProductDetailPage || isCartPage || isCheckoutPage) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      {/* Espacio transparente de 15px */}
      <div className="h-[15px] bg-transparent"></div>

      {/* Navbar amarillo */}
      <nav className="bg-tupedido-yellow py-3 px-5 shadow-lg">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center">
            <Home size={26} strokeWidth={2.5} className="text-tupedido-blue" />
          </Link>
          <Link href="/carrito" className="flex flex-col items-center relative">
            <ShoppingCart size={26} strokeWidth={2.5} className="text-tupedido-blue" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-tupedido-blue text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  )
}
