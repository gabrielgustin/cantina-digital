"use client"

import { X, Filter } from "lucide-react"
import { useState } from "react"

interface Subcategoria {
  id: string
  nombre: string
}

interface FiltersModalProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filterIds: string[]) => void
  availableFilters: Subcategoria[]
}

export function FiltersModal({ isOpen, onClose, onApply, availableFilters }: FiltersModalProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  if (!isOpen) return null

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]))
  }

  const handleApply = () => {
    onApply(selectedFilters)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-tupedido-blue bg-opacity-10 rounded-full flex items-center justify-center mb-3">
            <Filter className="w-6 h-6 text-tupedido-blue" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
          <p className="text-sm text-gray-600 mt-2">Seleccioná una o más subcategorías</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {availableFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`px-4 py-2 rounded-full border transition-all ${
                selectedFilters.includes(filter.id)
                  ? "bg-tupedido-blue text-white border-tupedido-blue"
                  : "bg-white text-gray-700 border-gray-300 hover:border-tupedido-blue"
              }`}
            >
              {filter.nombre}
            </button>
          ))}
        </div>

        <button
          onClick={handleApply}
          className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-lg">✓</span>
          Aplicar
        </button>
      </div>
    </div>
  )
}
