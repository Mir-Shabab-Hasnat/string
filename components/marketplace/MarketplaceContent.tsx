"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, BookOpen, Video, FileText, Users, Star, TrendingUp, Sparkles, Clock, Award, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

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

const stats = [
  { label: "Active Students", value: "50K+", icon: Users },
  { label: "Total Courses", value: "1.2K+", icon: BookOpen },
  { label: "Success Rate", value: "94%", icon: TrendingUp },
  { label: "Expert Instructors", value: "200+", icon: Award },
]

export default function MarketplaceContent() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* Hero Section with Improved Styling */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Learn from the Best
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Discover expert-led courses and elevate your skills with our curated learning resources
          </p>
          
          {/* Enhanced Search and Filter */}
          <div className="flex gap-4 max-w-xl">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-48 h-48 opacity-80">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary" />
          </div>
        </div>
      </div>

      {/* Add Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 transform translate-x-8 -translate-y-8">
                <div className="absolute inset-0 bg-primary/10 rounded-full" />
              </div>
              <CardContent className="p-6">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Categories Grid with Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Card 
              key={category.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`${category.color} p-4 rounded-xl transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
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

      {/* Add Top Instructors Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Top Instructors</h2>
            <p className="text-muted-foreground mt-1">Learn from industry experts</p>
          </div>
          <Button variant="outline">View All Instructors</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {topInstructors.map((instructor) => (
            <Card key={instructor.id} className="hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={instructor.avatar} />
                    <AvatarFallback>{instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{instructor.name}</h3>
                  <p className="text-sm text-muted-foreground">{instructor.title}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center">
                      {instructor.rating}
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Students</span>
                    <span className="font-medium">{instructor.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Courses</span>
                    <span className="font-medium">{instructor.courses}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex flex-wrap gap-2">
                  {instructor.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked courses to get you started
            </p>
          </div>
          <Button>View All Courses</Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300">
              <div className="aspect-video relative bg-muted rounded-t-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/30">
                  {course.featured && (
                    <Badge className="absolute top-4 right-4 bg-primary/90 hover:bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-xl line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg font-semibold whitespace-nowrap">
                    ${course.price}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {course.instructor.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {course.instructor.title}
                    </p>
                  </div>
                  <div className="flex items-center bg-primary/5 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-medium">
                      {course.rating}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="hover:bg-primary/5">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Add course stats */}
                <div className="grid grid-cols-3 gap-4 my-4">
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {course.students.toLocaleString()} students
                    </p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">20 hours</p>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg">
                    <BookOpen className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">12 modules</p>
                  </div>
                </div>

                {/* Add progress bar for limited time offer */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrollment closes in</span>
                    <span className="font-medium text-primary">2 days</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>

                {/* Add call to action */}
                <Button className="w-full mt-6 group">
                  Enroll Now
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add Testimonials or Reviews Section */}
      <section className="mt-16 bg-muted/50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">What Our Students Say</h2>
          <p className="text-muted-foreground mt-2">Join thousands of satisfied learners</p>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-6 pb-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-[400px] shrink-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Sarah Thompson</p>
                      <p className="text-sm text-muted-foreground">Web Development Graduate</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    &ldquo;The course exceeded my expectations. The instructor was knowledgeable and 
                    supportive, and the content was well-structured and practical.&rdquo;
                  </p>
                  <div className="flex items-center mt-4">
                    {Array(5).fill(null).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  )
} 