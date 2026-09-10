"use client"

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PreviewButton() {
  const handlePreview = () => {
    // Open the main store page in a new tab
    window.open("/", "_blank")
  }

  return (
    <Button
      onClick={handlePreview}
      variant="outline"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-white shadow-md hover:shadow-lg"
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      Vista Previa
    </Button>
  )
}
