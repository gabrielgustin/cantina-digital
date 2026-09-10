"use client"

import { useState, useEffect } from "react"
import { X, Search, Loader2 } from 'lucide-react'
import type { Product } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults([])
      setHasSearched(false)
    }
  }, [isOpen])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const products = await response.json()
      setResults(products)
    } catch (error) {
      console.error("Error searching:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="text-gray-400 flex-shrink-0" size={24} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-tupedido-blue" size={32} />
            </div>
          )}

          {!isSearching && hasSearched && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos para "{query}"
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-3">
              {results.map((product) => {
                const originalPrice = product.discount && product.price 
                  ? Math.round(product.price / (1 - product.discount / 100)) 
                  : undefined
                
                return (
                  <Link
                    key={product.id}
                    href={`/productos/${product.category_id}/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                      {product.subtitle && (
                        <p className="text-sm text-gray-500 truncate">{product.subtitle}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-tupedido-blue font-bold">
                          ${product.price.toLocaleString("es-AR")}
                        </p>
                        {originalPrice && (
                          <>
                            <p className="text-sm text-gray-400 line-through">
                              ${originalPrice.toLocaleString("es-AR")}
                            </p>
                            <span className="bg-red-100 text-red-600 text-xs font-semibold px-1.5 py-0.5 rounded">
                              -{product.discount?.toFixed(0)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {!isSearching && !hasSearched && (
            <div className="text-center py-8 text-gray-400">
              Ingresá al menos 2 caracteres para buscar productos
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
