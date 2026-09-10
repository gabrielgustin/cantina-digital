"use client"

import { X } from "lucide-react"

interface FloatingWindowProps {
  url: string
  isOpen: boolean
  onClose: () => void
}

export default function FloatingWindow({ url, isOpen, onClose }: FloatingWindowProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[90%] max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-gray-200 relative"
        style={{
          animation: "windowAppear 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-lg transition-all hover:scale-110"
          aria-label="Cerrar ventana"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 bg-white overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Vista previa de la tienda"
            style={{
              animation: "contentFadeIn 0.6s ease-out",
            }}
          />
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes windowAppear {
            0% { 
              opacity: 0; 
              transform: scale(0.95) translateY(20px);
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0);
            }
          }
          
          @keyframes contentFadeIn {
            0% {
              opacity: 0;
            }
            30% {
              opacity: 0.3;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
