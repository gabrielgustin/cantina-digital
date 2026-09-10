"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SectionTitle } from "@/components/section-title"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { getValidImageUrl } from "@/utils/image-utils"
import type { Product, Category } from "@/lib/db"

export default function ProductDetailPage({ params }: { params: { categoryId: string; productId: string } }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { productId, categoryId } = params

  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [configLoaded, setConfigLoaded] = useState(false)
  const [siteConfig, setSiteConfig] = useState<{
    logoUrl?: string
    siteName?: string
    instagramUrl?: string
    autogestivaUrl?: string
    whatsappUrl?: string
  }>({})

  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState("")
  const [canOrder, setCanOrder] = useState(true)
  const [showClosedAlert, setShowClosedAlert] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, categoryRes, configRes, canOrderRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/categories/${categoryId}`),
          fetch("/api/site-config"),
          fetch("/api/can-order"),
        ])

        if (productRes.ok) {
          const productData = await productRes.json()
          setProduct(productData)
        }

        if (categoryRes.ok) {
          const categoryData = await categoryRes.json()
          setCategory(categoryData)
        }

        if (configRes.ok) {
          const configData = await configRes.json()
          setSiteConfig(configData)
        }

        if (canOrderRes.ok) {
          const orderData = await canOrderRes.json()
          setCanOrder(orderData.canOrder)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
        setConfigLoaded(true)
      }
    }

    fetchData()
  }, [productId, categoryId])

  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }, [])

  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1)
  }, [])

  const formatPrice = useCallback((price: number) => {
    return `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }, [])

  const handleAddToCart = useCallback(() => {
    if (!canOrder) {
      setShowClosedAlert(true)
      setTimeout(() => setShowClosedAlert(false), 4000)
      return
    }

    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image_url || "",
      })

      router.push("/carrito")
    }
  }, [product, quantity, addItem, router, canOrder])

  const categoryImageUrl = useMemo(() => category?.image_url || "/placeholder.svg", [category?.image_url])

  const validImageUrl = useMemo(() => {
    if (!product) return null
    return getValidImageUrl(product.image_url || "", categoryId + " " + product.subtitle, product.title)
  }, [product, categoryId])

  const totalPrice = useMemo(() => {
    if (!product) return 0
    return product.price * quantity
  }, [product, quantity])

  if (loading || !configLoaded) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="h-[72px] md:h-20 bg-white border-b border-gray-200" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="flex flex-col min-h-screen">
        <Header {...siteConfig} showSearch={false} />
        <SectionTitle title="Producto no encontrado" backUrl={`/productos/${categoryId}`} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">El producto que buscas no está disponible.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-col h-screen">
      <Header {...siteConfig} showSearch={false} />
      <SectionTitle
        title="Producto"
        backUrl={`/productos/${params.categoryId}`}
        showShare={true}
        productTitle={product.title}
        variant="compact"
      />
      {showClosedAlert && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mt-4 rounded" role="alert">
          <p className="font-bold">Local cerrado</p>
          <p className="text-sm">
            Lo sentimos, no podemos recibir pedidos en este momento. Por favor, intenta más tarde durante nuestro
            horario de atención.
          </p>
        </div>
      )}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="flex justify-center mb-4 md:mb-6 mt-4 p-4">
          <div className="relative w-64 h-64 md:w-72 md:h-72">
            <Image
              src={validImageUrl || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="px-5 md:px-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1 md:mb-2 product-title-font">
            {product.title}
          </h1>
          {product.discount && product.discount > 0 ? (
            <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
              <p className="text-lg md:text-xl font-bold text-gray-800">
                {formatPrice(product.price * (1 - product.discount / 100))}
              </p>
              <p className="text-sm md:text-base text-gray-400 line-through">{formatPrice(product.price)}</p>
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                -{Math.round(product.discount)}%
              </span>
            </div>
          ) : (
            <p className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">{formatPrice(product.price)}</p>
          )}
          <p className="text-smaller text-gray-600 mb-6 md:mb-8 whitespace-pre-line leading-relaxed text-pretty">
            {product.description}
          </p>

          <div className="mb-6">
            <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3 product-title-font">Observación</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Si quieres, ingresa una observación"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-tupedido-blue text-smaller"
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="py-3 px-5">
          <div className="flex justify-between items-center gap-3 md:gap-4 max-w-md mx-auto">
            <div className="flex items-center justify-between bg-tupedido-yellow rounded-md p-1 shadow-md">
              <button
                onClick={decreaseQuantity}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-tupedido-blue hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus size={20} strokeWidth={3} className="md:w-6 md:h-6" />
              </button>
              <span className="mx-2 md:mx-3 text-base md:text-lg font-bold text-tupedido-blue">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-tupedido-blue hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus size={20} strokeWidth={3} className="md:w-6 md:h-6" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-tupedido-blue text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-md flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
            >
              <span className="mr-2 text-smaller md:text-base">Agregar</span>
              <span className="text-smaller md:text-base">{formatPrice(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
