import { ProductsPageClient } from "@/components/products-page-client"
import { ServerHeader } from "@/components/server-header"
import { getProductsByCategory, getCategoryById, getSubcategoriesByCategory } from "@/lib/db"

export const revalidate = 10 // Revalidate every 10 seconds

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params

  console.log("[v0] ProductsPage - Fetching data for category:", categoryId)

  const [products, category, subcategorias] = await Promise.all([
    getProductsByCategory(categoryId),
    getCategoryById(categoryId),
    getSubcategoriesByCategory(categoryId),
  ])

  console.log("[v0] ProductsPage - Products found:", products.length)
  console.log("[v0] ProductsPage - Category:", category?.title)
  console.log(
    "[v0] ProductsPage - Subcategorias found:",
    subcategorias.map((s) => s.nombre),
  )

  return (
    <ProductsPageClient
      products={products}
      category={category}
      categoryId={categoryId}
      subcategorias={subcategorias.map((s) => ({ id: s.id, nombre: s.nombre }))}
    >
      <ServerHeader />
    </ProductsPageClient>
  )
}
