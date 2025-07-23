"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Tag, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function BlogPage() {
  const { toast } = useToast()
  const router = useRouter()

  const blogPosts = [
    {
      id: 1,
      title: "5 Tips for Hiring the Best House Cleaner in Your Area",
      date: "March 10, 2024",
      category: "Customer Tips",
      image: "/placeholder.svg",
      summary: "Discover essential tips to ensure you find a reliable and efficient house cleaning professional through Loconomy.",
      link: "#",
    },
    {
      id: 2,
      title: "How to Optimize Your Provider Profile for More Job Matches",
      date: "February 28, 2024",
      category: "Provider Growth",
      image: "/placeholder.svg",
      summary: "Learn the secrets to creating a compelling profile that attracts more customers and job opportunities on Loconomy.",
      link: "#",
    },
    {
      id: 3,
      title: "The Rise of Hyperlocal Services: What It Means for Your Community",
      date: "February 15, 2024",
      category: "Industry Insights",
      image: "/placeholder.svg",
      summary: "Explore the growing trend of hyperlocal services and its positive impact on local economies and convenience.",
      link: "#",
    },
    {
      id: 4,
      title: "Understanding Loconomy's Secure Payment System",
      date: "January 30, 2024",
      category: "Safety & Trust",
      image: "/placeholder.svg",
      summary: "A deep dive into how our escrow and payment protection features keep your transactions safe and secure.",
      link: "#",
    },
  ]

  const categories = ["Customer Tips", "Provider Growth", "Industry Insights", "Safety & Trust", "Company News"]

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Loconomy Blog
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Insights, tips, and news from the world of local services.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <Input placeholder="Search blog posts..." className="flex-1" />
            <Button onClick={() => toast({ title: "Search Blog", description: "Searching blog posts... (Simulated)", variant: "default" })}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_250px] gap-8">
            {/* Blog Posts */}
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                    <img src={post.image} alt={post.title} className="w-full md:w-48 h-32 md:h-auto object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {post.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.summary}</p>
                      <Button variant="outline" onClick={() => toast({ title: "Read Article", description: `Opening blog post: ${post.title}... (Simulated)`, variant: "default" })}>
                        Read Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => toast({ title: "Filter by Category", description: `Filtering posts by category: ${category}... (Simulated)`, variant: "default" })}>
                          {category}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Subscribe to our newsletter for the latest blog posts and company news.
                  </p>
                  <Input placeholder="Your email address" />
                  <Button className="w-full" onClick={() => toast({ title: "Subscribed!", description: "You've subscribed to our blog newsletter.", variant: "default" })}>Subscribe</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}