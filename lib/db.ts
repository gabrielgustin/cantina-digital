import { neon } from "@neondatabase/serverless"
import { unstable_cache } from "next/cache"

const PUBLIC_CACHE_SECONDS = 60

function cachedPublic<T>(key: string[], fn: () => Promise<T>) {
  return unstable_cache(fn, key, { revalidate: PUBLIC_CACHE_SECONDS })()
}

let sql: ReturnType<typeof neon> | null = null

function getSql() {
  if (sql) return sql

  const databaseUrl = process.env.NEON_NEON_DATABASE_URL || process.env.NEON_POSTGRES_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("[v0] Database connection string not found in environment variables")
    return null
  }

  sql = neon(databaseUrl)
  return sql
}

// Types matching the actual database schema
export interface Category {
  id: string
  title: string
  subtitle: string
  image_url: string
  created_at?: string
  max_discount?: number // Added max_discount field for category discount badge
}

export interface Product {
  id: string
  category_id: string
  title: string
  subtitle: string
  subcategoria_id?: string
  image_url: string
  description: string
  price: number
  is_promo: boolean
  created_at?: string
  discount?: number // Percentage discount (e.g., 30 for 30% off)
  stock?: number
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
}

export interface SiteConfig {
  config_key: string
  config_value: string
  description?: string
}

export interface Subcategoria {
  id: string
  nombre: string
  categoria_id: string
  created_at?: string
  updated_at?: string
}

export interface BusinessHours {
  id: number
  day_of_week: string
  open_time: string
  close_time: string
  additional_open_time?: string
  additional_close_time?: string
  is_open: boolean
  created_at?: string
  updated_at?: string
}

async function getSiteColorsUncached(): Promise<Record<string, string>> {
  try {
    const client = getSql()
    if (!client) {
      return {
        color_primario: "#1e4b8e",
        color_secundario: "#FFDAB9",
        color_acento: "#8f0a84",
        color_fondo: "#f9fafb",
        color_texto: "#1f2937",
      }
    }

    const result = await client`
      SELECT config_key, config_value
      FROM site_config
      WHERE config_key IN ('color_primario', 'color_secundario', 'color_acento', 'color_fondo', 'color_texto')
    `

    const colors: Record<string, string> = {}
    for (const row of result as any[]) {
      colors[row.config_key] = row.config_value
    }

    return {
      color_primario: colors.color_primario || "#1e4b8e",
      color_secundario: colors.color_secundario || "#FFDAB9",
      color_acento: colors.color_acento || "#8f0a84",
      color_fondo: colors.color_fondo || "#f9fafb",
      color_texto: colors.color_texto || "#1f2937",
    }
  } catch (error) {
    console.error("[v0] Error fetching site colors:", error)
    return {
      color_primario: "#1e4b8e",
      color_secundario: "#FFDAB9",
      color_acento: "#8f0a84",
      color_fondo: "#f9fafb",
      color_texto: "#1f2937",
    }
  }
}

function sanitizeImageUrl(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback

  // If it's a base64 string or too long, return fallback
  if (url.startsWith("data:image") || url.length > 500) {
    return fallback
  }

  // If it's a valid URL format, return it
  if (url.startsWith("/") || url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return fallback
}

function parsePrice(precio: any): number {
  if (typeof precio === "number") return precio
  if (!precio) return 0

  // Remove currency symbol ($), spaces, and parse correctly
  const priceStr = String(precio)
    .replace(/\$/g, "") // Remove dollar sign
    .replace(/\s/g, "") // Remove spaces
    .replace(/\./g, "") // Remove thousand separators (dots)
    .replace(/,/g, ".") // Replace decimal comma with dot

  const parsed = Number.parseFloat(priceStr)

  console.log("[v0] Price conversion:", { input: precio, output: parsed })

  return isNaN(parsed) ? 0 : parsed
}

export async function getCategories(): Promise<Category[]> {
  try {
    console.log("[v0] Fetching categories from 'categorias' table...")
    const client = getSql()
    if (!client) {
      console.error("[v0] getCategories: Database client not available")
      return []
    }

    const result = await client`
      SELECT 
        c.id, 
        c.nombre as title, 
        '' as subtitle, 
        c.imagen as image_url, 
        c.created_at,
        c.orden,
        MAX(p.descuento) as max_discount
      FROM categorias c
      LEFT JOIN productos p ON p.categoria = c.id AND p.visible = true AND p.descuento > 0
      WHERE c.visible = true
      GROUP BY c.id, c.nombre, c.imagen, c.created_at, c.orden
      ORDER BY c.orden ASC NULLS LAST, c.created_at ASC
    `
    console.log("[v0] Categories fetched:", result.length)

    return (result as any[]).map((cat) => ({
      id: cat.id,
      title: cat.title,
      subtitle: cat.subtitle || "",
      image_url: sanitizeImageUrl(
        cat.image_url,
        `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(cat.title)}`,
      ),
      created_at: cat.created_at,
      max_discount: cat.max_discount && cat.max_discount > 0 ? Number(cat.max_discount) : undefined,
    }))
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const client = getSql()
    if (!client) return null

    const result = await client`
      SELECT id, nombre as title, '' as subtitle, imagen as image_url, created_at
      FROM categorias
      WHERE id = ${id} AND visible = true
      LIMIT 1
    `
    const category = result[0] as any
    if (!category) return null

    return {
      id: category.id,
      title: category.title,
      subtitle: category.subtitle || "",
      image_url: sanitizeImageUrl(
        category.image_url,
        `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(category.title)}`,
      ),
      created_at: category.created_at,
    }
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    console.log("[v0] Fetching products from 'productos' table...")
    const client = getSql()
    if (!client) {
      console.error("[v0] getProducts: Database client not available")
      return []
    }

    const result = await client`
      SELECT id, categoria as category_id, nombre as title, '' as subtitle, 
             imagen as image_url, descripcion as description, 
             precio, descuento, false as is_promo, created_at
      FROM productos
      WHERE visible = true
      ORDER BY categoria ASC, orden ASC NULLS LAST, created_at ASC
    `
    console.log("[v0] Products fetched:", result.length)

    return (result as any[]).map((prod) => ({
      id: prod.id,
      category_id: prod.category_id,
      title: prod.title,
      subtitle: prod.subtitle || "",
      image_url: sanitizeImageUrl(
        prod.image_url,
        `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(prod.title)}`,
      ),
      description: prod.description || "",
      price: parsePrice(prod.precio),
      is_promo: prod.is_promo || false,
      created_at: prod.created_at,
      discount: prod.descuento ? Number(prod.descuento) : undefined,
    }))
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    console.log("[v0] Fetching products for category:", categoryId)
    const client = getSql()
    if (!client) {
      console.error("[v0] getProductsByCategory: Database client not available")
      return []
    }

    const result = await client`
      SELECT p.id, p.categoria as category_id, p.nombre as title,
             p.subcategoria as subcategoria_id, s.nombre as subcategoria_nombre,
             p.imagen as image_url, p.descripcion as description,
             p.precio, p.descuento, false as is_promo, p.created_at
      FROM productos p
      LEFT JOIN subcategorias s ON p.subcategoria = s.id
      WHERE p.categoria = ${categoryId} AND p.visible = true
      ORDER BY p.orden ASC NULLS LAST, p.created_at ASC
    `
    console.log("[v0] Products found:", result.length)

    return (result as any[]).map((prod) => ({
      id: prod.id,
      category_id: prod.category_id,
      title: prod.title,
      subtitle: prod.subcategoria_nombre || "", // Display name of the subcategoria
      subcategoria_id: prod.subcategoria_id || "",
      image_url: sanitizeImageUrl(
        prod.image_url,
        `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(prod.title)}`,
      ),
      description: prod.description || "",
      price: parsePrice(prod.precio),
      is_promo: prod.is_promo || false,
      created_at: prod.created_at,
      discount: prod.descuento ? Number(prod.descuento) : undefined,
    }))
  } catch (error) {
    console.error("[v0] Error fetching products by category:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const client = getSql()
    if (!client) return null

    const result = await client`
      SELECT id, categoria as category_id, nombre as title, '' as subtitle,
             imagen as image_url, descripcion as description,
             precio, descuento, stock, false as is_promo, created_at
      FROM productos
      WHERE id = ${id} AND visible = true
      LIMIT 1
    `
    const product = result[0] as any
    if (!product) return null

    const variants = await client`
      SELECT id, nombre as name, precio as price, stock
      FROM producto_variantes
      WHERE producto_id = ${id}
      ORDER BY created_at ASC
    `

    return {
      id: product.id,
      category_id: product.category_id,
      title: product.title,
      subtitle: product.subtitle || "",
      image_url: sanitizeImageUrl(
        product.image_url,
        `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.title)}`,
      ),
      description: product.description || "",
      price: parsePrice(product.precio),
      stock: Number(product.stock || 0),
      variants: (variants as any[]).map((variant) => ({
        id: variant.id,
        name: variant.name,
        price: parsePrice(variant.price),
        stock: Number(variant.stock || 0),
      })),
      is_promo: product.is_promo || false,
      created_at: product.created_at,
      discount: product.descuento ? Number(product.descuento) : undefined,
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function getSiteConfig(key: string): Promise<string | null> {
  try {
    const client = getSql()
    if (!client) return null

    const result = await client`
      SELECT config_value
      FROM site_config
      WHERE config_key = ${key}
      LIMIT 1
    `

    return result[0]?.config_value || null
  } catch (error) {
    console.error(`Error fetching site config for key ${key}:`, error)
    return null
  }
}

async function getAllSiteConfigOptimizedUncached(): Promise<Record<string, string>> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] getAllSiteConfigOptimized: Database client not available")
      return {}
    }

    const result = await client`
      SELECT config_key, config_value
      FROM site_config
      WHERE config_key IN ('store_logo', 'header_logo_url', 'site_name', 'instagram_url', 'facebook_url', 'website_url', 'autogestiva_url', 'contact_whatsapp', 'store_location')
    `
    const config: Record<string, string> = {}
    for (const row of result as SiteConfig[]) {
      config[row.config_key] = row.config_value
    }
    return config
  } catch (error) {
    console.error("[v0] Error fetching site config:", error)
    return {}
  }
}

export async function getAllSiteConfig(): Promise<Record<string, string>> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] getAllSiteConfig: Database client not available")
      return {}
    }

    const result = await client`
      SELECT config_key, config_value
      FROM site_config
    `
    const config: Record<string, string> = {}
    for (const row of result as SiteConfig[]) {
      config[row.config_key] = row.config_value
    }
    return config
  } catch (error) {
    console.error("Error fetching all site config:", error)
    return {}
  }
}

async function getPromoBannerConfigUncached(): Promise<{ text: string | null; enabled: boolean }> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] getPromoBannerConfig: Database client not available")
      return { text: null, enabled: false }
    }

    const result = await client`
      SELECT config_key, config_value
      FROM site_config
      WHERE config_key IN ('banner_text', 'banner_enabled')
    `

    const config: Record<string, string> = {}
    for (const row of result as SiteConfig[]) {
      config[row.config_key] = row.config_value
    }

    const text = config["banner_text"] || null
    const enabled = config["banner_enabled"] === "true" // Convert string to boolean

    console.log("[v0] Promo banner config from DB:", { text, enabled })

    return {
      text: text,
      enabled: enabled && !!text, // Enabled only if flag is true AND text exists
    }
  } catch (error) {
    console.error("Error fetching promo banner config:", error)
    return { text: null, enabled: false }
  }
}

export async function getSubcategoriesByCategory(categoryId: string): Promise<Subcategoria[]> {
  try {
    console.log("[v0] Fetching subcategorias for category:", categoryId)
    const client = getSql()
    if (!client) {
      console.error("[v0] getSubcategoriesByCategory: Database client not available")
      return []
    }

    const result = await client`
      SELECT id, nombre, categoria_id, created_at, updated_at
      FROM subcategorias
      WHERE categoria_id = ${categoryId}
      ORDER BY nombre ASC
    `

    const subcategorias = result as Subcategoria[]
    console.log(
      "[v0] Subcategorias found:",
      subcategorias.length,
      subcategorias.map((s) => s.nombre),
    )

    return subcategorias
  } catch (error) {
    console.error("[v0] Error fetching subcategorias:", error)
    return []
  }
}

async function isBusinessOpenUncached(): Promise<boolean> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] isBusinessOpen: Database client not available")
      return false
    }

    const now = new Date()
    const dayNames = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"]
    const currentDay = dayNames[now.getDay()]
    const currentTime = now.toTimeString().slice(0, 5)

    const result = await client`
      SELECT open_time, close_time, additional_open_time, additional_close_time, is_open
      FROM business_hours
      WHERE day_of_week = ${currentDay}
      LIMIT 1
    `

    if (result.length === 0) {
      return false
    }

    const hours = result[0] as BusinessHours

    if (!hours.is_open) {
      return false
    }

    const convertTo24Hour = (time: string): string => {
      if (!time.includes("AM") && !time.includes("PM")) {
        return time
      }

      const [timeStr, period] = time.trim().split(" ")
      let [hours, minutes] = timeStr.split(":").map(Number)

      if (period === "PM" && hours !== 12) {
        hours += 12
      } else if (period === "AM" && hours === 12) {
        hours = 0
      }

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    }

    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number)
      return hours * 60 + minutes
    }

    const openTime24 = convertTo24Hour(hours.open_time)
    const closeTime24 = convertTo24Hour(hours.close_time)
    const currentMinutes = timeToMinutes(currentTime)
    const openMinutes = timeToMinutes(openTime24)
    const closeMinutes = timeToMinutes(closeTime24)

    const isInPrimaryHours = currentMinutes >= openMinutes && currentMinutes <= closeMinutes

    let isInAdditionalHours = false
    if (hours.additional_open_time && hours.additional_close_time) {
      const additionalOpenTime24 = convertTo24Hour(hours.additional_open_time)
      const additionalCloseTime24 = convertTo24Hour(hours.additional_close_time)
      const additionalOpenMinutes = timeToMinutes(additionalOpenTime24)
      const additionalCloseMinutes = timeToMinutes(additionalCloseTime24)
      isInAdditionalHours = currentMinutes >= additionalOpenMinutes && currentMinutes <= additionalCloseMinutes
    }

    const isOpen = isInPrimaryHours || isInAdditionalHours

    return isOpen
  } catch (error) {
    console.error("[v0] Error checking business hours:", error)
    return false
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    console.log("[v0] Searching products with query:", query)
    const client = getSql()
    if (!client) {
      console.error("[v0] searchProducts: Database client not available")
      return []
    }

    const searchPattern = `%${query.toLowerCase()}%`

    const result = await client`
      SELECT id, categoria as category_id, nombre as title, subcategoria,
             imagen as image_url, descripcion as description,
             precio, descuento, false as is_promo, created_at
      FROM productos
      WHERE visible = true 
        AND (
          LOWER(nombre) LIKE ${searchPattern}
          OR LOWER(descripcion) LIKE ${searchPattern}
          OR LOWER(subcategoria) LIKE ${searchPattern}
        )
      ORDER BY created_at DESC
      LIMIT 50
    `

    console.log("[v0] Search results found:", result.length)

    return (result as any[]).map((prod) => ({
      id: prod.id,
      category_id: prod.category_id,
      title: prod.title,
      subtitle: prod.subcategoria || "",
      image_url: sanitizeImageUrl(
        prod.image_url,
        `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(prod.title)}`,
      ),
      description: prod.description || "",
      price: parsePrice(prod.precio),
      is_promo: prod.is_promo || false,
      created_at: prod.created_at,
      discount: prod.descuento ? Number(prod.descuento) : undefined,
    }))
  } catch (error) {
    console.error("[v0] Error searching products:", error)
    return []
  }
}

export async function getBusinessHours(): Promise<BusinessHours[]> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] getBusinessHours: Database client not available")
      return []
    }

    const result = await client`
      SELECT id, day_of_week, open_time, close_time, additional_open_time, additional_close_time, is_open
      FROM business_hours
      ORDER BY 
        CASE day_of_week
          WHEN 'domingo' THEN 1
          WHEN 'lunes' THEN 2
          WHEN 'martes' THEN 3
          WHEN 'miercoles' THEN 4
          WHEN 'jueves' THEN 5
          WHEN 'viernes' THEN 6
          WHEN 'sabado' THEN 7
        END
    `

    return result as BusinessHours[]
  } catch (error) {
    console.error("[v0] Error fetching business hours:", error)
    return []
  }
}

export async function canOrderWhenClosed(): Promise<boolean> {
  try {
    const client = getSql()
    if (!client) {
      console.error("[v0] canOrderWhenClosed: Database client not available")
      return false
    }

    const result = await client`
      SELECT allow_orders_when_closed
      FROM business_hours_config
      ORDER BY id DESC
      LIMIT 1
    `

    if (result.length === 0) {
      return false
    }

    const allowed = result[0].allow_orders_when_closed === true
    return allowed
  } catch (error) {
    console.error("[v0] Error checking canOrderWhenClosed:", error)
    return false
  }
}

export function getSiteColors() {
  return cachedPublic(["site-colors"], getSiteColorsUncached)
}

export function getAllSiteConfigOptimized() {
  return cachedPublic(["site-config-public"], getAllSiteConfigOptimizedUncached)
}

export function getPromoBannerConfig() {
  return cachedPublic(["promo-banner-config"], getPromoBannerConfigUncached)
}

export function isBusinessOpen() {
  return cachedPublic(["business-open"], isBusinessOpenUncached)
}
