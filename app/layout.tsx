import type React from "react"
import type { Metadata } from "next"
import { Inter, Anton, Open_Sans } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { ViewCartButton } from "@/components/view-cart-button"
import { Toaster } from "@/components/ui/toaster"
import { getSiteColors } from "@/lib/db"

const inter = Inter({ subsets: ["latin"] })
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })

export const revalidate = 0

export const metadata: Metadata = {
  title: "Autogestiva Cantina Digital",
  description: "Tu tienda de relojes y accesorios",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const colors = await getSiteColors()

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style
          id="site-colors"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `:root {
            --color-primario: ${colors.color_primario};
            --color-secundario: ${colors.color_secundario};
            --color-acento: ${colors.color_acento};
            --color-fondo: ${colors.color_fondo};
            --color-texto: ${colors.color_texto};
          }`,
          }}
        />
      </head>
      <body className={`${inter.className} ${anton.variable} ${openSans.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              {children}
              <ViewCartButton />
            </div>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
