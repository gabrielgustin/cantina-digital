import { headers } from "next/headers"
import { auth } from "@/lib/auth"

/**
 * Verifies the current request has a valid Better Auth session.
 * Must be called at the top of every backoffice API route handler —
 * the proxy only does an optimistic cookie check, this is the real check.
 */
export async function requireBackofficeSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}
