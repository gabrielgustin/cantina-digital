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
      </div>
    </div>
  )
}
