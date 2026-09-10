import { ServerHeader } from "@/components/server-header"
import { SectionTitle } from "@/components/section-title"
import { BottomNav } from "@/components/bottom-nav"
import { getSiteConfig } from "@/lib/db"

export default async function InformacionPage() {
  const siteDescription =
    (await getSiteConfig("site_description")) ||
    "Ofrecemos una amplia variedad de productos de calidad para satisfacer todas tus necesidades."
  const contactEmail = (await getSiteConfig("contact_email")) || "contacto@itsboutique.com"
  const contactPhone = (await getSiteConfig("contact_phone")) || "+54 9 351 123-4567"

  return (
    <main className="flex flex-col min-h-screen pb-20">
      <ServerHeader />
      <SectionTitle title="Información" backUrl="/" />
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Información General</h2>
        <p className="mb-6">{siteDescription}</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Productos</h3>
            <p className="mb-4">
              Ofrecemos una amplia variedad de productos para vapeo, incluyendo pods, líquidos y accesorios de las
              mejores marcas del mercado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Envíos</h3>
            <p className="mb-4">
              Realizamos envíos a todo el país. Los pedidos se procesan en un plazo de 24-48 horas hábiles.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Formas de pago</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Efectivo</li>
              <li>Transferencia bancaria</li>
              <li>Tarjetas de crédito y débito</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Contacto</h3>
            <p className="mb-2">
              <strong>Email:</strong> {contactEmail}
            </p>
            <p>
              <strong>Teléfono:</strong> {contactPhone}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Garantía</h3>
            <p>
              Todos nuestros productos cuentan con garantía de calidad. Si tienes algún problema, contáctanos dentro de
              los 7 días posteriores a la compra.
            </p>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
