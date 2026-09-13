"use client"

import { SectionTitle } from "@/components/section-title"
import { ProductCard } from "@/components/product-card"
import { BottomNav } from "@/components/bottom-nav"
import { FiltersModal } from "@/components/filters-modal"
import { Filter } from 'lucide-react'
import { useState, type ReactNode } from "react"

interface Product {
  id: string
  title: string
  subtitle: string
  subcategoria_id?: string
  image_url: string
  price: number
  category_id: string
  discount?: number // Added discount field to Product interface
}

interface Category {
  id: string
  title: string
  subtitle: string
}

interface Subcategoria {
  id: string
  nombre: string
}

interface ProductsPageClientProps {
  products: Product[]
  category: Category | null
  categoryId: string
  subcategorias: Subcategoria[] // Subcategorias that belong to this category
  children: ReactNode
}

export function ProductsPageClient({
  products,
  category,
  categoryId,
  subcategorias,
  children,
}: ProductsPageClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("todos")
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([])

  const handleApplyFilters = (filterIds: string[]) => {
    setSelectedFilterIds(filterIds)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSubcategory =
      selectedSubcategoryId === "todos" || product.subcategoria_id === selectedSubcategoryId

    const matchesFilters =
      selectedFilterIds.length === 0 || selectedFilterIds.includes(product.subcategoria_id || "")

    return matchesSubcategory && matchesFilters
  })

  return (
    <main className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        {children}
        <SectionTitle title={category?.title || "Productos"} backUrl="/" variant="compact" />
        {/* Subcategories navigation and filters button */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedSubcategoryId("todos")}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                selectedSubcategoryId === "todos"
                  ? "bg-tupedido-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {subcategorias.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategoryId(sub.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  selectedSubcategoryId === sub.id
                    ? "bg-tupedido-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sub.nombre}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsFiltersOpen(true)}
            className="bg-tupedido-blue text-white px-4 py-2 rounded-md flex items-center gap-2 flex-shrink-0 font-medium text-sm"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Scrollable products area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              subtitle={product.subtitle}
              imageUrl={product.image_url}
              categoryId={categoryId}
              price={product.price}
              discount={product.discount} // Pass discount prop to ProductCard
            />
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay productos disponibles con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      <BottomNav />

      <FiltersModal
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApply={handleApplyFilters}
        availableFilters={subcategorias}
      />
    </main>
  )
}
