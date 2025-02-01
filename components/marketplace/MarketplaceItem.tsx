import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, Clock, BookOpen, Users, ChevronRight, Sparkles } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Course Image Section */}
      <div className="aspect-video relative bg-muted">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30">
          {item.featured && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Badge className="bg-primary/90 hover:bg-primary">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Course Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-xl line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg font-semibold whitespace-nowrap">
            ${item.price}
          </Badge>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-primary/10">
            <AvatarImage src={item.instructor.avatar} alt={item.instructor.name} />
            <AvatarFallback>{item.instructor.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-sm">
              {item.instructor.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.instructor.title}
            </p>
          </div>
          <div className="flex items-center bg-primary/5 px-2.5 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {item.rating}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              ({item.reviewCount})
            </span>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-muted rounded-lg">
            <Users className="h-4 w-4 mx-auto mb-1 text-primary/60" />
            <p className="text-xs text-muted-foreground">
              {item.students.toLocaleString()} students
            </p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <Clock className="h-4 w-4 mx-auto mb-1 text-primary/60" />
            <p className="text-xs text-muted-foreground">20 hours</p>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <BookOpen className="h-4 w-4 mx-auto mb-1 text-primary/60" />
            <p className="text-xs text-muted-foreground">12 modules</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="hover:bg-primary/5 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Enrollment closes in</span>
            <span className="font-medium text-primary">2 days</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>

        {/* Call to Action */}
        <Button className="w-full group" size="lg">
          Enroll Now
          <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  )
} 