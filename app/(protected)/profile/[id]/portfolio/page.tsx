import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
  GraduationCap, 
  
  Trophy, 
  
  
  
  
 
  Rocket,
  Star,
  Code,
  
  GraduationCap as Education
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import Image from "next/image"

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params
}: {
  params: { id: string }
}) {
  const [profile, viewer] = await Promise.all([
    prisma.user.findUnique({
      where: { id: params.id }
    }),
    currentUser()
  ])

  if (!profile) {
    notFound()
  }

  const isOwner = viewer?.id === profile.id

  const roleConfig = {
    STUDENT: {
      icon: GraduationCap,
      color: "bg-blue-500",
      sections: [
        {
          title: "Academic Projects",
          icon: Rocket,
          items: [
            {
              title: "Machine Learning Research",
              description: "Developed a novel approach to neural networks",
              date: "2023 - Present",
              tags: ["AI", "Python", "TensorFlow"]
            }
          ]
        },
        {
          title: "Skills & Technologies",
          icon: Code,
          items: [
            {
              category: "Programming",
              skills: ["Python", "JavaScript", "Java", "C++"]
            },
            {
              category: "Web Technologies",
              skills: ["React", "Node.js", "Next.js", "TypeScript"]
            }
          ]
        },
        {
          title: "Achievements",
          icon: Trophy,
          items: [
            {
              title: "Dean's List",
              description: "Achieved academic excellence for 3 consecutive semesters",
              date: "2023"
            }
          ]
        },
        {
          title: "Education",
          icon: Education,
          items: [
            {
              school: "University of Technology",
              degree: "Bachelor of Computer Science",
              date: "2021 - Present",
              gpa: "3.8/4.0"
            }
          ]
        }
      ]
    }
  }

  const config = roleConfig[profile.role] || roleConfig.STUDENT
  const RoleIcon = config.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative w-40 h-40">
              <Image
                src={profile.profilePicture || "/default-avatar.png"}
                alt={`${profile.firstName}'s profile`}
                fill
                className="rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            
            {/* Profile Info */}
            <div className="text-center md:text-left text-white">
              <h1 className="text-4xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-xl opacity-90 mt-2">
                {profile.role} at {profile.organisation}
              </p>
              {isOwner && (
                <Button 
                  variant="secondary" 
                  className="mt-4"
                  asChild
                >
                  <Link href={`/profile/${profile.id}/portfolio/edit`}>
                    Edit Portfolio
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Skills & Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {config.sections[1].items.map((item, index) => (
                    <div key={index}>
                      <h3 className="font-medium text-foreground mb-2">{item.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Education className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {config.sections[3].items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-semibold text-lg text-foreground">{item.school}</h3>
                    <p className="text-muted-foreground">{item.degree}</p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{item.date}</span>
                      <span>GPA: {item.gpa}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Projects Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Academic Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {config.sections[0].items.map((item, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                    <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex gap-2">
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {config.sections[2].items.map((item, index) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                    <span className="text-sm text-muted-foreground block mt-2">{item.date}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 