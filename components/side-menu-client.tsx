"use client"

import { useEffect, memo } from "react"
import { Home, MapPin, Instagram, MessageCircle, Facebook, Globe, Lock } from "lucide-react"
import Link from "next/link"

interface SideMenuClientProps {
  isOpen: boolean
  onClose: () => void
  instagramUrl: string | null
  facebookUrl: string | null
  websiteUrl: string | null
  autogestivaUrl: string | null
  whatsappUrl: string | null
  hasAddress: boolean
}

export const SideMenuClient = memo(function SideMenuClient({
  isOpen,
  onClose,
  instagramUrl,
  facebookUrl,
  websiteUrl,
  autogestivaUrl,
  whatsappUrl,
  hasAddress,
}: SideMenuClientProps) {
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

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--color-primario)" }}
      >
        <div className="flex flex-col h-full">
          {/* Contenido del menú */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="space-y-6">
              <Link
                href="/"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <Home className="mr-4" size={24} />
                <span>Inicio</span>
              </Link>

              {hasAddress && (
                <Link
                  href="/ubicacion"
                  className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  <MapPin className="mr-4" size={24} />
                  <span>Ubicación</span>
                </Link>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  <Instagram className="mr-4" size={24} />
                  <span>Instagram</span>
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  <Facebook className="mr-4" size={24} />
                  <span>Facebook</span>
                </a>
              )}

              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  <Globe className="mr-4" size={24} />
                  <span>Sitio Web</span>
                </a>
              )}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                  onClick={onClose}
                >
                  <MessageCircle className="mr-4" size={24} />
                  <span>WhatsApp</span>
                </a>
              )}

              <Link
                href="/backoffice"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <Lock className="mr-4" size={24} />
                <span>Admin</span>
              </Link>
            </nav>
          </div>

          {/* Botón de acción y cerrar */}
          <div className="mt-auto">
            {autogestivaUrl && (
              <a
                href={autogestivaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-tupedido-blue p-6 text-center text-white font-bold hover:opacity-90 transition-opacity"
              >
                ¡Quiero una tienda así para mi negocio!
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full h-24 bg-white flex items-center justify-center text-tupedido-blue font-bold hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  )
})
