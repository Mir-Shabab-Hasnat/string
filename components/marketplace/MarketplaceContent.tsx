"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, BookOpen, Video, FileText, Users, Star, TrendingUp, Sparkles } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  { 
    id: "programming",
    name: "Programming",
    icon: BookOpen,
    count: 245,
    color: "bg-blue-500/10 text-blue-500"
  },
  { 
    id: "design", 
    name: "Design",
    icon: Video,
    count: 182,
    color: "bg-purple-500/10 text-purple-500"
  },
  { 
    id: "business",
    name: "Business",
    icon: FileText,
    count: 321,
    color: "bg-green-500/10 text-green-500"
  },
  { 
    id: "marketing",
    name: "Marketing",
    icon: Users,
    count: 195,
    color: "bg-orange-500/10 text-orange-500"
  }
]

const featuredCourses = [
  {
    id: 1,
    title: "Advanced Machine Learning Course",
    description: "Master ML fundamentals to advanced topics with hands-on projects",
    price: "49.99",
    category: "programming",
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      rating: 4.8,
      title: "AI Research Scientist"
    },
    tags: ["Machine Learning", "AI", "Python"],
    students: 1234,
    image: "/course-ml.jpg",
    featured: true,
    rating: 4.8,
    reviewCount: 384
  },
  {
    id: 2,
    title: "Web Development Bootcamp 2024",
    description: "Complete modern web development from basics to deployment",
    price: "79.99",
    category: "programming",
    instructor: {
      name: "John Smith",
      avatar: "/avatars/john.jpg",
      rating: 4.9,
      title: "Senior Web Developer"
    },
    tags: ["Web Development", "JavaScript", "React"],
    students: 2156,
    image: "/course-web.jpg",
    featured: true,
    rating: 4.9,
    reviewCount: 567
  }
]

const topInstructors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "AI Research Scientist",
    avatar: "/avatars/sarah.jpg",
    rating: 4.8,
    students: 12453,
    courses: 8,
    specialties: ["Machine Learning", "Data Science"]
  },
  {
    id: 2,
    name: "John Smith",
    title: "Senior Web Developer",
    avatar: "/avatars/john.jpg",
    rating: 4.9,
    students: 15234,
    courses: 12,
    specialties: ["Web Development", "React"]
  }
]

export default function MarketplaceContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover Your Next Learning Adventure
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl">
            Explore thousands of courses from expert instructors around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="What do you want to learn?"
                className="pl-9 bg-white/95"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-white text-blue-600 hover:bg-white/90">
              Search Courses
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/20 to-transparent" />
      </div>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Browse Categories</h2>
          <Button variant="ghost">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card 
                key={category.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} courses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Courses</h2>
            <p className="text-muted-foreground">
              Hand-picked courses by our experts
            </p>
          </div>
          <Button variant="ghost">View All</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                  <BookOpen className="h-10 w-10 text-primary/40" />
                </div>
                {course.featured && (
                  <Badge className="absolute top-2 right-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg font-semibold">
                    ${course.price}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback>
                      {course.instructor.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.students.toLocaleString()} students
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium ml-1">
                      {course.rating}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({course.reviewCount})
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Instructors */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Top Instructors</h2>
            <p className="text-muted-foreground">
              Learn from industry experts
            </p>
          </div>
          <Button variant="ghost">View All</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {topInstructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarImage src={instructor.avatar} />
                    <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 font-semibold">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{instructor.title}</p>
                  <div className="mt-2 flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium ml-1">
                      {instructor.rating}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="text-center">
                    <p className="text-lg font-semibold">
                      {instructor.students.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold">{instructor.courses}</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
} 