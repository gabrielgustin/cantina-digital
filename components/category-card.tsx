import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { memo } from "react"

interface CategoryCardProps {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  maxDiscount?: number
}

export const CategoryCard = memo(function CategoryCard({ id, title, subtitle, imageUrl, maxDiscount }: CategoryCardProps) {
  const validImageUrl =
    imageUrl && (imageUrl.startsWith("https://") || imageUrl.startsWith("http://") || imageUrl.startsWith("/"))
      ? imageUrl
      : null

  return (
    <Link href={`/productos/${id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-3 md:mb-4 flex items-center justify-between gap-3 hover:shadow-lg transition-shadow duration-300 border border-gray-100 min-h-[140px] md:min-h-[180px]">
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-24 h-24 md:w-36 md:h-36 relative mr-4 md:mr-6 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={validImageUrl || "/placeholder.svg"}
              alt={title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <h3 
              className="text-xl md:text-2xl font-bold mb-1 md:mb-2 product-title-font"
              style={{ color: 'var(--color-primario)' }}
            >
              {title}
            </h3>
            {maxDiscount && maxDiscount > 0 && (
              <div className="bg-[#D4F4DD] text-[#2D5F3F] text-xs md:text-sm font-bold px-3 py-1 rounded-full shadow-sm inline-block mb-1">
                HASTA {Math.round(maxDiscount)}% OFF
              </div>
            )}
            <p className="text-gray-600 text-base md:text-lg">{subtitle}</p>
          </div>
        </div>
        <div 
          className="rounded-full p-1.5 md:p-2 text-white flex-shrink-0"
          style={{ backgroundColor: 'var(--color-primario)' }}
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </div>
      </div>
    </Link>
  )
})
