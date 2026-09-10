"use client"

import { useState } from "react"
import { Menu, Search } from "lucide-react"
import { SideMenuClient } from "./side-menu-client"
import { SearchModal } from "./search-modal"

interface HeaderProps {
  logoUrl?: string | null
  siteName?: string
  instagramUrl?: string | null
  facebookUrl?: string | null
  websiteUrl?: string | null
  autogestivaUrl?: string | null
  whatsappUrl?: string | null
  hasAddress?: boolean
  showSearch?: boolean
}

export function Header({
  logoUrl = null,
  siteName = "M&M Relojes",
  instagramUrl = null,
  facebookUrl = null,
  websiteUrl = null,
  autogestivaUrl = null,
  whatsappUrl = null,
  hasAddress = false,
  showSearch = true,
}: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  return (
    <>
      <header
        className="w-full py-3 md:py-5 px-4 md:px-5 shadow-md relative h-16 md:h-20"
        style={{ backgroundColor: "var(--color-fondo)" }}
      >
        <div className="flex items-center h-full">
          {/* Left section: Menu + Logo */}
          <div className="flex items-center">
            <button
              className="hover:opacity-80 transition-opacity mr-3"
              style={{ color: "var(--color-primario)" }}
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              <Menu size={30} strokeWidth={2.5} className="md:w-9 md:h-9" />
            </button>
            {logoUrl && <img src={logoUrl || "/placeholder.svg"} alt={siteName} className="h-16 md:h-20 w-auto" />}
          </div>

          {/* Center: Site name */}

          {/* Right: Search button - conditionally rendered */}
          {showSearch && (
            <div className="absolute right-4 md:right-5">
              <button
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--color-primario)" }}
                onClick={toggleSearch}
                aria-label="Buscar productos"
              >
                <Search size={28} strokeWidth={2.5} className="md:w-8 md:h-8" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Menú lateral */}
      <SideMenuClient
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        instagramUrl={instagramUrl}
        facebookUrl={facebookUrl}
        websiteUrl={websiteUrl}
        autogestivaUrl={autogestivaUrl}
        whatsappUrl={whatsappUrl}
        hasAddress={hasAddress}
      />

      {/* Search modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
