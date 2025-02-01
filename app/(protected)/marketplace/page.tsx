import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import MarketplaceContent from "@/components/marketplace/MarketplaceContent"
import { ErrorBoundary } from "react-error-boundary"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Marketplace - String",
  description: "Discover and share academic resources",
}

function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">Please try again later</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  )
}

export default async function MarketplacePage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: clerkUser.id
    }
  })

  if (!user) {
    redirect("/wizard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MarketplaceContent />
      </ErrorBoundary>
    </div>
  )
} 