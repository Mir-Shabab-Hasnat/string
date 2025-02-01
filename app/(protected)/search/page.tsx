import { Suspense } from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader } from "@/components/ui/card"
import Link from "next/link"

interface SearchPageProps {
  searchParams: {
    q?: string
    filter?: string
  }
}

async function getSearchResults(query: string, filter: string) {
  switch (filter) {
    case "user":
      return await prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          profilePicture: true,
          organisation: true,
          role: true,
        },
      })
    default:
      return []
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q
  const filter = searchParams.filter || "user"

  if (!query) {
    notFound()
  }

  const results = await getSearchResults(query, filter)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        <p className="text-muted-foreground">
          Showing results for "{query}" in {filter}s
        </p>
      </div>

      <div className="grid gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          {results.length > 0 ? (
            results.map((user) => (
              <Link href={`/profile/${user.id}`} key={user.id}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.profilePicture || undefined}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            @{user.username}
                          </span>
                        </div>
                        {user.organisation && (
                          <span className="text-sm text-muted-foreground">
                            {user.organisation} • {user.role.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No results found for "{query}"
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching for something else
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
} 