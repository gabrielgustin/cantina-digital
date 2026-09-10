"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SectionTitle } from "@/components/section-title"
import { CartItem } from "@/components/cart-item"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()
  const [configLoaded, setConfigLoaded] = useState(false)
  const [siteConfig, setSiteConfig] = useState<{
    logoUrl?: string
    siteName?: string
    instagramUrl?: string
    autogestivaUrl?: string
    whatsappUrl?: string
  }>({})

  useEffect(() => {
    async function fetchSiteConfig() {
      try {
        const response = await fetch("/api/site-config")
        if (response.ok) {
          const data = await response.json()
          setSiteConfig(data)
        }
      } catch (error) {
        console.error("Error fetching site config:", error)
      } finally {
        setConfigLoaded(true)
      }
    }
    fetchSiteConfig()
  }, [])

  const formatPrice = (price: number) => {
    return `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleConfirmOrder = () => {
    router.push("/finalizar-pedido")
  }

  if (!configLoaded) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="h-[72px] md:h-20 bg-white border-b border-gray-200" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen">
      <Header {...siteConfig} />
      <SectionTitle title="Carrito" backUrl="/" variant="compact" />

      <div className="flex-1 p-4 bg-gray-50 pb-[100px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-smaller text-gray-500 mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => router.push("/")}
              className="bg-tupedido-blue text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity text-smaller"
            >
              Ir a comprar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  quantity={item.quantity}
                  imageUrl={item.imageUrl}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold product-title-font">Total</h3>
              <p className="text-lg font-bold text-gray-800">{formatPrice(calculateTotal())}</p>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-tupedido-blue text-white font-bold py-3 rounded-md text-base shadow-md hover:opacity-90 transition-opacity product-title-font"
            >
              Confirmar Pedido
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
