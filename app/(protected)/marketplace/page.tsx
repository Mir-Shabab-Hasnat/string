import { Metadata } from "next"
import MarketplaceContent from "@/components/marketplace/MarketplaceContent"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse and discover learning resources",
}

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-6">
      <MarketplaceContent />
    </div>
  )
} 