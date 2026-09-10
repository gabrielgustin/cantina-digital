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

interface ProductsPageClientProps {
  products: Product[]
  category: Category | null
  categoryId: string
  brands: string[] // Add brands prop
  children: ReactNode
}

export function ProductsPageClient({ products, category, categoryId, brands, children }: ProductsPageClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("todos")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const subcategories = ["Todos", ...brands]
  const availableFilters = brands

  const handleApplyFilters = (filters: string[]) => {
    setSelectedFilters(filters)
    console.log("[v0] Applied filters:", filters)
  }

  const filteredProducts = products.filter((product) => {
    // Extract subcategory name from subtitle (format: "subcategoria-categoria")
    const productSubcategory = product.subtitle?.split("-")[0]?.toLowerCase() || ""

    // If subcategory is selected (not "todos"), filter by subcategory
    const matchesSubcategory =
      selectedSubcategory === "todos" || productSubcategory === selectedSubcategory.toLowerCase()

    // If filters are applied, product must match at least one filter
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        const filterLower = filter.toLowerCase()
        const match = productSubcategory === filterLower
        console.log("[v0] Filter comparison:", { product: product.id, productSubcategory, filter, filterLower, match })
        return match
      })

    return matchesSubcategory && matchesFilters
  })

  console.log("[v0] Total products:", products.length)
  console.log("[v0] Filtered products:", filteredProducts.length)
  console.log("[v0] Selected subcategory:", selectedSubcategory)
  console.log("[v0] Selected filters:", selectedFilters)
  console.log(
    "[v0] Product subtitles:",
    products.map((p) => ({ id: p.id, subtitle: p.subtitle, extracted: p.subtitle?.split("-")[0] })),
  )

  return (
    <main className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        {children}
        <SectionTitle title={category?.title || "Productos"} backUrl="/" variant="compact" />
        {/* Subcategories navigation and filters button */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 overflow-x-auto">
          <div className="flex gap-2 flex-1 overflow-x-auto scrollbar-hide">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub.toLowerCase())}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  selectedSubcategory === sub.toLowerCase()
                    ? "bg-tupedido-blue text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sub}
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
        availableFilters={availableFilters}
      />
    </main>
  )
}
