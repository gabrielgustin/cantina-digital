"use client"

import { useState, useEffect, useCallback, useMemo, use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SectionTitle } from "@/components/section-title"
import Image from "next/image"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { getValidImageUrl } from "@/utils/image-utils"
import type { Product, Category } from "@/lib/db"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string; productId: string }>
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const { productId, categoryId } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState("")
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
  const [showVariantAlert, setShowVariantAlert] = useState(false)
  const [showStockAlert, setShowStockAlert] = useState(false)

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
      const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariantId)
      const currentPrice = selectedVariant?.price ?? product.price

      if (product.variants?.length && !selectedVariant) {
        setShowVariantAlert(true)
        setTimeout(() => setShowVariantAlert(false), 4000)
        return
      }

      // El stock solo se controla a nivel de variante, ya que es el único valor
      // que el negocio puede configurar desde el backoffice. El stock general del
      // producto no es editable y por defecto es 0, por lo que no debe bloquear la compra.
      if (selectedVariant && quantity > selectedVariant.stock) {
        setShowStockAlert(true)
        setTimeout(() => setShowStockAlert(false), 4000)
        return
      }

      addItem({
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        title: selectedVariant ? `${product.title} - ${selectedVariant.name}` : product.title,
        price: currentPrice,
        quantity: quantity,
        imageUrl: product.image_url || "",
        productId: product.id,
        variantId: selectedVariant?.id,
      })

      router.push("/carrito")
    }
  }, [product, quantity, selectedVariantId, addItem, router, canOrder])

  const categoryImageUrl = useMemo(() => category?.image_url || "/placeholder.svg", [category?.image_url])

  const validImageUrl = useMemo(() => {
    if (!product) return null
    return getValidImageUrl(product.image_url || "", categoryId + " " + product.subtitle, product.title)
  }, [product, categoryId])

  const selectedVariant = useMemo(
    () => product?.variants?.find((variant) => variant.id === selectedVariantId),
    [product, selectedVariantId],
  )

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0

  const totalPrice = useMemo(() => displayPrice * quantity, [displayPrice, quantity])

  if (loading || !configLoaded) {
    return (
      <main className="flex flex-col min-h-screen">
        <div className="h-[72px] md:h-20 bg-white border-b border-gray-200" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin" />
            <p className="text-sm text-gray-400">Cargando producto...</p>
          </div>
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
        backUrl={`/productos/${categoryId}`}
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
      {showVariantAlert && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mx-4 mt-4 rounded" role="alert">
          <p className="font-bold">Elegí una variante</p>
          <p className="text-sm">Seleccioná una variante antes de agregar el producto al carrito.</p>
        </div>
      )}
      {showStockAlert && (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mx-4 mt-4 rounded" role="alert">
          <p className="font-bold">Stock insuficiente</p>
          <p className="text-sm">No hay suficiente stock disponible para la cantidad seleccionada.</p>
        </div>
      )}
      <div className="flex-1 bg-white overflow-y-auto pb-32 md:pb-36">
        <div className="flex justify-center px-4 pt-6 pb-2 md:pt-8">
          <div className="relative w-full max-w-sm">
            {product.discount != null && product.discount > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{Math.round(product.discount)}%
              </span>
            )}
            <div className="relative aspect-square w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
              <Image
                src={validImageUrl || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain p-3 sm:p-5 md:p-6"
                sizes="(max-width: 380px) calc(100vw - 2rem), (max-width: 640px) calc(100vw - 2.5rem), 384px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="px-5 md:px-6 max-w-sm mx-auto w-full">
          <div className="pt-5 pb-5 border-b border-gray-100">
            <h1 className="text-2xl md:text-[26px] font-semibold text-gray-900 mb-2 product-title-font leading-tight text-pretty">
              {product.title}
            </h1>
            {product.discount && product.discount > 0 ? (
              <div className="flex items-baseline gap-2 flex-wrap">
                <p
                  className="text-2xl md:text-[28px] font-bold product-title-font"
                  style={{ color: "var(--color-primario)" }}
                >
                  {formatPrice(displayPrice * (1 - product.discount / 100))}
                </p>
                <p className="text-base text-gray-400 line-through">{formatPrice(displayPrice)}</p>
              </div>
            ) : (
              <p className="text-2xl md:text-[28px] font-bold" style={{ color: "var(--color-primario)" }}>
                {formatPrice(displayPrice)}
              </p>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="py-5 border-b border-gray-100">
              <label htmlFor="product-variant" className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2 block">
                Elegí una variante
              </label>
              <select
                id="product-variant"
                value={selectedVariantId}
                onChange={(event) => setSelectedVariantId(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-[15px] text-gray-900 focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": "var(--color-primario)" } as React.CSSProperties}
              >
                <option value="">Seleccioná una variante</option>
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id} disabled={variant.stock <= 0}>
                    {variant.name} — {formatPrice(variant.price)}{variant.stock <= 0 ? " (Agotado)" : ` · ${variant.stock} disponibles`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {product.description && (
            <div className="py-5 border-b border-gray-100">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Descripción</h3>
              <p className="text-[15px] text-gray-700 whitespace-pre-line leading-relaxed text-pretty">
                {product.description}
              </p>
            </div>
          )}

          <div className="py-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Agregar observación al pedido</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Si quieres, ingresa una observación"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl min-h-[96px] resize-none focus:outline-none focus:ring-2 focus:bg-white transition-colors text-[15px] placeholder:text-gray-400"
              style={{ "--tw-ring-color": "var(--color-primario)" } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="py-3 px-5">
          <div className="flex justify-between items-center gap-3 max-w-sm mx-auto">
            <div className="flex items-center justify-between bg-gray-100 rounded-xl p-1 shrink-0">
              <button
                onClick={decreaseQuantity}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Disminuir cantidad"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="mx-2 md:mx-3 text-base font-bold text-gray-900 min-w-[1.5ch] text-center">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Aumentar cantidad"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
                className="flex-1 min-w-0 text-white font-bold py-3 px-3 md:px-4 rounded-xl flex items-center justify-between gap-2 md:gap-3 shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primario)" }}
            >
              <span className="text-sm md:text-base truncate"><span className="md:hidden">Agregar</span><span className="hidden md:inline">Agregar al carrito</span></span>
              <span className="text-sm md:text-base">{formatPrice(totalPrice)}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
