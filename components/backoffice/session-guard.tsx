"use client"

import { useEffect } from "react"

/**
 * The backoffice session must only stay open while the admin is actively
 * browsing it. Closing the tab/browser or refreshing the page should end
 * the session, sending the admin back to /backoffice/sign-in on their next
 * visit. Client-side (SPA) navigation between backoffice pages via <Link>
 * does NOT unload the document, so it does not trigger this and the
 * session correctly stays open while navigating the panel.
 */
export function SessionGuard() {
  useEffect(() => {
    const endSession = () => {
      // fetch with keepalive survives the page unload, unlike a normal fetch.
      fetch("/api/auth/sign-out", {
        method: "POST",
        keepalive: true,
        credentials: "include",
      }).catch(() => {})
    }

    window.addEventListener("pagehide", endSession)
    return () => window.removeEventListener("pagehide", endSession)
  }, [])

  return null
}
