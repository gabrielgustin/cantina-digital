import type React from "react"
import { redirect } from "next/navigation"
import { requireBackofficeSession } from "@/lib/backoffice-auth"
import { SessionGuard } from "@/components/backoffice/session-guard"
import { SignOutButton } from "@/components/backoffice/sign-out-button"
import PreviewButton from "@/components/backoffice/preview-button"

// Real, authoritative session check for every backoffice admin page.
// The proxy only does an optimistic cookie-presence check (fast, but it
// can't validate the session), so this is what actually protects the
// backoffice UI from being reached with a stale or forged cookie.
export default async function ProtectedBackofficeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await requireBackofficeSession()

  if (!session?.user) {
    redirect("/backoffice/sign-in")
  }

  return (
    <>
      <SessionGuard />
      <div className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-end gap-1 bg-[#1e4b8e] px-4">
        <PreviewButton />
        <SignOutButton />
      </div>
      {children}
    </>
  )
}
