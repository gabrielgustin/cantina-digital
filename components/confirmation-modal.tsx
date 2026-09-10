"use client"

import { AlertTriangle } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmationModal({ isOpen, title, message, onCancel, onConfirm }: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-md w-full max-w-md p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="text-tupedido-blue mb-4">
            <AlertTriangle size={48} strokeWidth={1.5} fill="#E3F2FD" />
          </div>

          <h3 className="text-xl font-bold text-center mb-2">{title}</h3>
          <p className="text-smaller text-gray-500 text-center mb-6">{message}</p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-3 border border-gray-300 rounded-md font-medium text-smaller text-gray-700 hover:bg-gray-50 hover:opacity-90 transition-opacity"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-tupedido-blue text-white rounded-md font-medium text-smaller hover:opacity-90 transition-opacity"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
