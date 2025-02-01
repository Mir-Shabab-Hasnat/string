import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface MarketplaceItemProps {
  item: {
    id: number
    title: string
    description: string
    price: string
    category: string
    instructor: {
      name: string
      avatar: string
      rating: number
      title: string
    }
    tags: string[]
    students: number
    image: string
    featured: boolean
    rating: number
    reviewCount: number
  }
}

export function MarketplaceItem({ item }: MarketplaceItemProps) {
  if (!item) return null

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-muted">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
          {item.featured && (
            <Badge className="absolute top-2 right-2">
              Featured
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg font-semibold">
            ${item.price}
          </Badge>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.instructor.avatar} />
            <AvatarFallback>{item.instructor.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {item.instructor.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.students.toLocaleString()} students
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium ml-1">
              {item.rating}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({item.reviewCount})
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 