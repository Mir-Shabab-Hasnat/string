"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Tag, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/Badge"

interface TrendingItem {
  id: string
  title: string
  price: number
  image: string
}

interface TrendingTag {
  id: number
  name: string
  count: number
}

interface UserPreferences {
  interests: string[]
  theme: string
}

export default function RightSidebar() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([])
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([])
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, tagsRes, prefsRes] = await Promise.all([
          fetch('/api/marketplace/trending'),
          fetch('/api/trending/tags'),
          fetch('/api/user/preferences')
        ])

        const [items, tags, prefs] = await Promise.all([
          itemsRes.json(),
          tagsRes.json(),
          prefsRes.json()
        ])

        setTrendingItems(items)
        setTrendingTags(tags)
        setPreferences(prefs)
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* User Preferences Card */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <h3 className="font-semibold">Your Interests</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {preferences?.interests.map((interest, index) => (
            <Badge key={index} variant="secondary">
              {interest}
            </Badge>
          ))}
          {preferences?.interests.length === 0 && (
            <p className="text-sm text-muted-foreground">No interests set yet</p>
          )}
        </div>
      </Card>

      {/* Trending Tags Card */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          <h3 className="font-semibold">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="flex items-center gap-1">
              {tag.name}
              <span className="text-xs text-muted-foreground">({tag.count})</span>
            </Badge>
          ))}
          {trendingTags.length === 0 && (
            <p className="text-sm text-muted-foreground">No trending tags yet</p>
          )}
        </div>
      </Card>

      {/* Trending Items Card */}
      <Card className="p-4 space-y-3 bg-background/25">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <h3 className="font-semibold">Trending in Marketplace</h3>
        </div>
        <div className="space-y-3">
          {trendingItems.slice(0, 3).map((item) => (
            <Link href={`/marketplace/${item.id}`} key={item.id}>
              <Card className="p-2 hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {trendingItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No trending items yet</p>
          )}
        </div>
      </Card>
    </div>
  )
} 