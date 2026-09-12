import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { BackofficeSignInForm } from "@/components/backoffice/auth-form"

export default async function BackofficeSignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect("/backoffice")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#1e4b8e]">Backoffice</h1>
          <p className="text-sm text-gray-500 mt-1">Iniciá sesión para administrar tu tienda</p>
        </div>
        <BackofficeSignInForm />
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-[#1e4b8e] transition-colors hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Volver a la app</span>
        </Link>
      </div>
    </div>
  )
}
