"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { ConfirmationModal } from "./confirmation-modal"
import { getValidImageUrl } from "@/utils/image-utils"

interface CartItemProps {
  id: string
  title: string
  price: number
  quantity: number
  imageUrl: string
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ id, title, price, quantity, imageUrl, onUpdateQuantity, onRemove }: CartItemProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingAction, setPendingAction] = useState<"remove" | "decrease" | null>(null)

  const formatPrice = (price: number) => {
    // Usar punto como separador de miles en lugar de coma
    return `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1)
    } else {
      setPendingAction("decrease")
      setShowConfirmation(true)
    }
  }

  const handleRemove = () => {
    setPendingAction("remove")
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    onRemove(id)
    setShowConfirmation(false)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  const validImageUrl = getValidImageUrl(imageUrl, "cart item", title)

  return (
    <>
      <div className="bg-white rounded-md shadow-md p-3 md:p-4 mb-3 md:mb-4 relative">
        <div className="flex items-start">
          <div className="w-20 h-20 md:w-24 md:h-24 relative mr-3 md:mr-4">
            <Image src={validImageUrl || "/placeholder.svg"} alt={title} fill style={{ objectFit: "contain" }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2 product-title-font">{title}</h3>

            <div className="flex items-center justify-between mt-1 md:mt-2">
              <div className="flex items-center">
                <button onClick={handleDecrease} className="text-tupedido-blue">
                  <Minus size={18} strokeWidth={3} className="md:w-5 md:h-5" />
                </button>
                <span className="mx-3 md:mx-4 text-smaller font-bold">{quantity}</span>
                <button onClick={() => onUpdateQuantity(id, quantity + 1)} className="text-tupedido-blue">
                  <Plus size={18} strokeWidth={3} className="md:w-5 md:h-5" />
                </button>
              </div>
              <p className="text-smaller font-bold text-gray-800">{formatPrice(price)}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 md:top-4 md:right-4 text-tupedido-blue hover:opacity-80"
            aria-label="Eliminar producto"
          >
            <X size={18} strokeWidth={3} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        title={`Se removerá el producto "${title}" de su pedido`}
        message="Esta acción no puede deshacerse."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  )
}
