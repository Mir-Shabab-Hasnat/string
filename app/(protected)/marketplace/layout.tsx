import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse and discover learning resources",
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
} 