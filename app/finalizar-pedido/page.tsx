"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SectionTitle } from "@/components/section-title"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"

type DeliveryMethod = any
type PaymentMethod = any
type Coupon = {
  id: number
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  discount_amount: number
}

export default function FinalizarPedidoPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [cashAmount, setCashAmount] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [siteConfig, setSiteConfig] = useState<any>({})
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true)
  const [deliveryMethods, setDeliveryMethods] = useState<any[]>([])
  const [loadingDeliveryMethods, setLoadingDeliveryMethods] = useState(true)
  const [address, setAddress] = useState("")

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const response = await fetch("/api/site-config")
        if (response.ok) {
          const data = await response.json()
          setSiteConfig(data)
        }
      } catch (error) {
        console.error("Error fetching site config:", error)
      }
    }

    fetchSiteConfig()
  }, [])

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("/api/payment-methods")
        if (response.ok) {
          const result = await response.json()
          const activeMethods = result.data
            .filter((method: any) => method.is_active)
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          setPaymentMethods(activeMethods)
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error)
        toast.error("Error al cargar métodos de pago")
      } finally {
        setLoadingPaymentMethods(false)
      }
    }

    fetchPaymentMethods()
  }, [])

  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const response = await fetch("/api/delivery-methods")
        if (response.ok) {
          const result = await response.json()
          const activeMethods = result.data
            .filter((method: any) => method.is_active)
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          setDeliveryMethods(activeMethods)
        }
      } catch (error) {
        console.error("Error fetching delivery methods:", error)
        toast.error("Error al cargar formas de entrega")
      } finally {
        setLoadingDeliveryMethods(false)
      }
    }

    fetchDeliveryMethods()
  }, [])

  const formatPrice = (price: number | undefined | null) => {
    const safePrice = price ?? 0
    return `$ ${safePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Por favor ingrese un código de cupón")
      return
    }

    setValidatingCoupon(true)

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          orderTotal: total ?? 0,
        }),
      })

      const data = await response.json()

      if (data.success && data.coupon) {
        setAppliedCoupon(data.coupon)
        toast.success("¡Cupón aplicado correctamente!", {
          description: `Descuento de ${data.coupon.discount_type === "percentage" ? `${data.coupon.discount_value}%` : formatPrice(data.coupon.discount_value)}`,
        })
      } else {
        toast.error(data.error || "Cupón inválido")
        setAppliedCoupon(null)
      }
    } catch (error) {
      console.error("Error validating coupon:", error)
      toast.error("Error al validar el cupón")
      setAppliedCoupon(null)
    } finally {
      setValidatingCoupon(false)
    }
  }

  const subtotal = total ?? 0
  const discountAmount = appliedCoupon?.discount_amount ?? 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const deliveryCost = deliveryMethod?.cost || 0
  const finalTotal = subtotalAfterDiscount + deliveryCost

  const handleSubmit = async () => {
    if (!name || !phone || !deliveryMethod || !paymentMethod) {
      toast.error("Por favor complete todos los campos obligatorios")
      return
    }

    const isDelivery =
      deliveryMethod?.name?.toLowerCase().includes("envio") || deliveryMethod?.name?.toLowerCase().includes("envío")

    if (isDelivery && !address.trim()) {
      toast.error("Por favor ingrese una dirección de entrega")
      return
    }

    const stockResponse = await fetch("/api/orders/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
    if (!stockResponse.ok) {
      const stockError = await stockResponse.json().catch(() => null)
      toast.error(stockError?.error || "No hay stock suficiente para completar el pedido")
      return
    }

    let paymentInfo = `Forma de pago: ${paymentMethod}`
    if (paymentMethod === "efectivo" && cashAmount) {
      paymentInfo += ` (Paga con: ${formatPrice(Number.parseFloat(cashAmount) || 0)})`
      const change = (Number.parseFloat(cashAmount) || 0) - finalTotal
      if (change > 0) {
        paymentInfo += ` - Vuelto: ${formatPrice(change)}`
      }
    }

    const message = `
*Nuevo Pedido*
Nombre: ${name}
Teléfono: ${phone}
Forma de entrega: ${deliveryMethod.name}${deliveryCost > 0 ? ` (${formatPrice(deliveryCost)})` : ""}
${isDelivery && address ? `Dirección: ${address}` : ""}
${paymentInfo}

*Productos:*
${items.map((item) => `- ${item.title} x${item.quantity}: ${formatPrice((item.price ?? 0) * item.quantity)}`).join("\n")}

*Subtotal: ${formatPrice(subtotal)}*
${appliedCoupon ? `*Descuento (${appliedCoupon.code}): -${formatPrice(discountAmount)}*` : ""}
${deliveryCost > 0 ? `*Envío: ${formatPrice(deliveryCost)}*` : ""}
*Total: ${formatPrice(finalTotal)}*
    `

    const encodedMessage = encodeURIComponent(message)
    const whatsappNumber =
      siteConfig.whatsappUrl?.replace("https://wa.me/", "") || siteConfig.contact_whatsapp || "5493512100007"
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank")
    clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...siteConfig} />
      <SectionTitle title="¡Lo último!" backUrl="/carrito" variant="compact" />

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-2xl pb-48 md:pb-52">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="space-y-6 md:space-y-8"
        >
          {/* Nombre y apellido */}
          <div>
            <label htmlFor="name" className="block text-base md:text-lg font-semibold mb-2 product-title-font">
              Nombre y apellido
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese su nombre"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tupedido-blue text-smaller"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-base md:text-lg font-semibold mb-2 product-title-font">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ingrese un medio de contacto"
              className="w-full p-3 md:p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tupedido-blue text-smaller"
              required
            />
          </div>

          {/* Forma de entrega */}
          <div>
            <label className="block text-base md:text-lg font-semibold mb-3 product-title-font">Forma de entrega</label>
            {loadingDeliveryMethods ? (
              <div className="text-center py-4 text-gray-500">Cargando formas de entrega...</div>
            ) : deliveryMethods.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay formas de entrega disponibles</div>
            ) : (
              <div
                className={`grid gap-2 md:gap-3 ${
                  deliveryMethods.length === 1
                    ? "grid-cols-1"
                    : deliveryMethods.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {deliveryMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setDeliveryMethod(method)
                      setAddress("")
                    }}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all text-sm md:text-base font-medium ${
                      deliveryMethod?.id === method.id
                        ? "border-[#1e4b8e] bg-[#1e4b8e] text-white"
                        : "border-gray-300 hover:border-[#1e4b8e]"
                    }`}
                  >
                    <div className="font-semibold">{method.name}</div>
                    {method.cost > 0 && (
                      <div className="text-xs md:text-sm mt-1 opacity-80">{formatPrice(method.cost)}</div>
                    )}
                    {method.estimated_days && (
                      <div className="text-xs mt-1 opacity-70">{method.estimated_days} días</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {deliveryMethod &&
            (deliveryMethod.name?.toLowerCase().includes("envio") ||
              deliveryMethod.name?.toLowerCase().includes("envío")) && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <label htmlFor="address" className="block text-base md:text-lg font-semibold mb-2 product-title-font">
                  Dirección de entrega
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ingrese su dirección completa (calle, número, piso, depto, ciudad)"
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-smaller resize-none"
                  rows={3}
                  required
                />
                <p className="mt-2 text-xs text-gray-600">Ingrese su dirección completa para la entrega del pedido</p>
              </div>
            )}

          {/* Forma de pago */}
          <div>
            <label className="block text-base md:text-lg font-semibold mb-3 product-title-font">Forma de pago</label>
            {loadingPaymentMethods ? (
              <div className="text-center py-4 text-gray-500">Cargando métodos de pago...</div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No hay métodos de pago disponibles</div>
            ) : (
              <div
                className={`grid gap-2 md:gap-3 ${
                  paymentMethods.length === 1
                    ? "grid-cols-1"
                    : paymentMethods.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.name.toLowerCase())
                      if (method.name.toLowerCase() !== "efectivo") {
                        setCashAmount("")
                      }
                    }}
                    className={`p-3 md:p-4 rounded-lg border-2 transition-all text-sm md:text-base font-medium ${
                      paymentMethod === method.name.toLowerCase()
                        ? "border-[#1e4b8e] bg-[#1e4b8e] text-white"
                        : "border-gray-300 hover:border-[#1e4b8e]"
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cash amount field */}
          {paymentMethod === "efectivo" && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <label htmlFor="cashAmount" className="block text-base md:text-lg font-semibold mb-2 product-title-font">
                ¿Con cuánto vas a pagar?
              </label>
              <input
                type="number"
                id="cashAmount"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="Ingrese el monto"
                className="w-full p-3 md:p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tupedido-blue text-smaller"
                min={finalTotal}
                step="0.01"
              />
              {cashAmount && Number.parseFloat(cashAmount) >= finalTotal && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  Vuelto: {formatPrice((Number.parseFloat(cashAmount) || 0) - finalTotal)}
                </p>
              )}
              {cashAmount && Number.parseFloat(cashAmount) < finalTotal && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  El monto debe ser mayor o igual al total ({formatPrice(finalTotal)})
                </p>
              )}
            </div>
          )}

          {/* Cupón de descuento */}
          {siteConfig.enable_coupons === "true" && (
            <div>
              <label htmlFor="coupon" className="block text-base md:text-lg font-semibold mb-2 product-title-font">
                Cupón de descuento
              </label>
              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase())
                    if (appliedCoupon) setAppliedCoupon(null)
                  }}
                  placeholder="Ingrese un código de descuento"
                  className="flex-1 p-3 md:p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tupedido-blue text-smaller uppercase"
                  disabled={validatingCoupon}
                />
                <button
                  type="button"
                  onClick={handleValidateCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="bg-tupedido-blue text-white font-semibold py-3 px-4 md:py-4 md:px-6 rounded-md hover:opacity-90 transition-opacity text-smaller disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {validatingCoupon ? "..." : "Validar"}
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                  <span className="text-sm text-green-700 font-medium">✓ Cupón aplicado: {appliedCoupon.code}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null)
                      setCouponCode("")
                      toast.info("Cupón removido")
                    }}
                    className="text-xs text-green-600 hover:text-green-800 underline"
                  >
                    Remover
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </main>

      {/* Total y botón de finalizar (fijo en la parte inferior) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto p-4">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800">{formatPrice(subtotal)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600">Descuento</span>
                <span className="text-green-600">-{formatPrice(discountAmount)}</span>
              </div>
            )}
            {deliveryCost > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="text-gray-800">{formatPrice(deliveryCost)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg md:text-xl font-bold pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-tupedido-blue">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-[#1e4b8e] text-white font-bold py-3 md:py-4 rounded-md hover:opacity-90 transition-opacity text-base md:text-lg"
          >
            Pedir por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
