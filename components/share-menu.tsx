"use client"

import { useEffect, useRef } from "react"
import { Facebook, Twitter, Share2, X, MessageCircle, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareMenuProps {
  isOpen: boolean
  onClose: () => void
  productTitle: string
  productUrl: string
}

export function ShareMenu({ isOpen, onClose, productTitle, productUrl }: ShareMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const shareText = `¡Mira este producto: ${productTitle}! ${productUrl}`

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={24} className="text-green-500" />,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")
        onClose()
      },
    },
    {
      name: "Facebook",
      icon: <Facebook size={24} className="text-blue-600" />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, "_blank")
        onClose()
      },
    },
    {
      name: "Twitter",
      icon: <Twitter size={24} className="text-blue-400" />,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")
        onClose()
      },
    },
    {
      name: "Telegram",
      icon: <Send size={24} className="text-blue-500" />,
      action: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`,
          "_blank",
        )
        onClose()
      },
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={menuRef}
        className="bg-white rounded-lg shadow-xl w-[90%] max-w-md overflow-hidden transform transition-all"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-base font-semibold text-gray-800">Compartir producto</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 hover:opacity-90 transition-opacity">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.action}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:opacity-90 transition-opacity"
              >
                <div className="mb-2">{option.icon}</div>
                <span className="text-smaller font-medium text-gray-700">{option.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: productTitle,
                      text: `¡Mira este producto: ${productTitle}!`,
                      url: productUrl,
                    })
                    .then(() => onClose())
                    .catch((error) => console.log("Error sharing", error))
                } else {
                  navigator.clipboard.writeText(shareText)
                  toast({
                    title: "¡Enlace copiado!",
                    description: "El enlace se ha copiado al portapapeles",
                  })
                  onClose()
                }
              }}
              className="w-full py-3 bg-tupedido-blue text-white font-semibold rounded-md flex items-center justify-center hover:opacity-90 transition-opacity text-smaller"
            >
              <Share2 size={20} className="mr-2" />
              Compartir con otras apps
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
