import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { CategoryCard } from "@/components/category-card"
import { BottomNav } from "@/components/bottom-nav"
import { PromoBanner } from "@/components/promo-banner"
import { ClosedBanner } from "@/components/closed-banner"
import { getCategories, getPromoBannerConfig, isBusinessOpen } from "@/lib/db"
import { getValidImageUrl } from "@/utils/image-utils"

export const revalidate = 0 // Always fetch fresh data - no cache

export default async function Home() {
  const [categories, promoBanner, businessOpen] = await Promise.all([
    getCategories(),
    getPromoBannerConfig(),
    isBusinessOpen(),
  ])

  console.log("[v0] HomePage - Visible categories:", categories.length)
  console.log("[v0] HomePage - Business is open:", businessOpen)

  const validCategories = categories.map((category) => {
    const validUrl = getValidImageUrl(category.image_url, category.id, category.title)
    return {
      ...category,
      imageUrl: validUrl,
    }
  })

  return (
    <main className="flex flex-col h-screen">
      <div className="flex-shrink-0">
        <ServerHeader />
        {!businessOpen ? (
          <ClosedBanner />
        ) : (
          promoBanner.enabled && promoBanner.text && <PromoBanner text={promoBanner.text} />
        )}
        <SectionTitle title="Categorías" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 -mt-16 md:-mt-20 relative z-10 bg-transparent pt-0 pt-px pt-0">
        {validCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay categorías disponibles.</div>
        ) : (
          validCategories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.title}
              subtitle={category.subtitle}
              imageUrl={category.imageUrl}
              maxDiscount={category.max_discount} // Passing max_discount to CategoryCard
            />
          ))
        )}
        <div className="h-20" />
      </div>
      <BottomNav />
    </main>
  )
}
