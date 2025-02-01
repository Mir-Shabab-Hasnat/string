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
    <div className="space-y-6">
      <div className="border-b pb-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse and discover event tickets, academic resources, books and more!
          </p>
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
} 