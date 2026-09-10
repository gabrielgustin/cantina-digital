import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import Card from "@/components/card"
import { memo } from "react"

interface ProductCardProps {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  categoryId: string
  price?: number
  discount?: number
}

const ProductCard = memo(function ProductCard({ id, title, subtitle, imageUrl, categoryId, price, discount }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `$${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  console.log('[v0] ProductCard discount value:', { id, discount, type: typeof discount })
  
  const hasDiscount = discount != null && discount > 0
  const originalPrice = price
  const discountedPrice = hasDiscount && price ? Math.round(price * (1 - discount / 100)) : price
  const discountPercentage = hasDiscount ? `-${Math.round(discount)}%` : null

  const validImageUrl =
    imageUrl && (imageUrl.startsWith("https://") || imageUrl.startsWith("http://") || imageUrl.startsWith("/"))
      ? imageUrl
      : null

  const fallbackImage = "/school-uniform-placeholder.jpg"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/productos/${categoryId}/${id}`}>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-5 mb-4 md:mb-5 flex items-center justify-between hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 relative mr-3 md:mr-4 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
              <Image
                src={validImageUrl || fallbackImage}
                alt={title || "Producto"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 96px"
              />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-0.5 md:mb-1 product-title-font">
                {title}
              </h3>
              <p className="text-smaller text-gray-500">{subtitle}</p>
              {price !== undefined && (
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {hasDiscount ? (
                    <>
                      <p className="text-base md:text-lg font-bold text-gray-800">{formatPrice(discountedPrice!)}</p>
                      <p className="text-sm text-gray-400 line-through">{formatPrice(originalPrice!)}</p>
                      <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                        {discountPercentage}
                      </span>
                    </>
                  ) : (
                    <p className="text-base md:text-lg font-bold text-gray-800">{formatPrice(price)}</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="bg-tupedido-blue rounded-full p-1.5 md:p-2 text-white">
            <ChevronRight size={18} className="md:w-5 md:h-5" />
          </div>
        </div>
      </Link>
    </Card>
  )
})

export default ProductCard
export { ProductCard }
