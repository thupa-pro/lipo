import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Edit, Eye, EyeOff, Filter, Globe, BarChart3, Upload, Download, Copy,
  Image, Video, Mic, Tag,
  CheckCircle, XCircle, AlertCircle,
  TrendingUp, Target,
  BookOpen, Bookmark, Share2, ExternalLink, RefreshCw, Save, Code, Layout, Palette, Type, AlignLeft, Bold, Italic, Underline, List, ListOrdered, Quote, LinkIcon, ImageIcon, Monitor, Smartphone, Tablet, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  type: "page" | "blog" | "service" | "landing";
  status: "draft" | "published" | "scheduled" | "archived";
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  scheduledAt?: Date;
  views: number;
  likes: number;
  shares: number;
  category: string;
  tags: string[];
  excerpt: string;
  content: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
    ogImage?: string;
    schema?: string;
  };
  analytics: {
    sessions: number;
    bounceRate: number;
    avgTimeOnPage: number;
    conversions: number;
  };
}

interface SEOAnalysis {
  score: number;
  issues: {
    type: "error" | "warning" | "info";
    message: string;
    suggestion: string;
  }[];
  recommendations: string[];
  keywords: {
    keyword: string;
    density: number;
    position: number;
    difficulty: number;
  }[];
}

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  size: number;
  uploadedAt: Date;
  usedIn: string[];
  alt?: string;
  dimensions?: { width: number; height: number };
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState("content");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editorView, setEditorView] = useState<"edit" | "preview">("edit");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Mock data
  const mockContentItems: ContentItem[] = [
    {
      id: "1",
      title: "Complete Guide to Home Cleaning Services",
      slug: "complete-guide-home-cleaning-services",
      type: "blog",
      status: "published",
      author: { name: "Sarah Johnson", avatar: "👩‍💼" },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 12450,
      likes: 89,
      shares: 34,
      category: "Home Services",
      tags: ["cleaning", "home", "tips", "guide"],
      excerpt: "Everything you need to know about professional home cleaning, services, from what to expect to how to prepare your home.",
      content: "# Complete Guide to Home Cleaning Services\n\nFinding the right cleaning service...",
      seo: {
        title: "Complete Guide to Home Cleaning Services | Loconomy",
        description: "Discover everything about professional home cleaning services. Get, tips, pricing, guides, and find the best cleaners in your area.",
        keywords: ["home cleaning", "cleaning services", "professional cleaners", "house cleaning"],
        ogImage: "/blog/cleaning-guide-og.jpg",
      },
      analytics: {
        sessions: 8945,
        bounceRate: 32.5,
        avgTimeOnPage: 245,
        conversions: 156,
      },
    },
    {
      id: "2",
      title: "Why Choose Local Service Providers",
      slug: "why-choose-local-service-providers",
      type: "blog",
      status: "draft",
      author: { name: "Mike Chen", avatar: "👨‍💻" },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      views: 0,
      likes: 0,
      shares: 0,
      category: "Business",
      tags: ["local", "community", "business"],
      excerpt: "Supporting local service providers benefits your community and often provides better personalized service.",
      content: "# Why Choose Local Service Providers\n\nSupporting local businesses...",
      seo: {
        title: "Benefits of Choosing Local Service Providers",
        description: "Learn why choosing local service providers benefits your community and delivers better service.",
        keywords: ["local services", "community support", "local business"],
      },
      analytics: {
        sessions: 0,
        bounceRate: 0,
        avgTimeOnPage: 0,
        conversions: 0,
      },
    },
    {
      id: "3",
      title: "Professional Cleaning Services Landing Page",
      slug: "professional-cleaning-services",
      type: "landing",
      status: "published",
      author: { name: "Emma Wilson", avatar: "👩‍🎨" },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      views: 45680,
      likes: 234,
      shares: 89,
      category: "Landing Pages",
      tags: ["cleaning", "landing", "conversion"],
      excerpt: "Professional cleaning services for your home or office. Book now and get your first cleaning at 20% off.",
      content: "Hero section with booking form...",
      seo: {
        title: "Professional Cleaning Services | Book Online | Loconomy",
        description: "Professional cleaning services for homes and offices. Trusted, insured cleaners. Book online and save 20% on your first cleaning.",
        keywords: ["cleaning services", "professional cleaners", "home cleaning", "office cleaning"],
        canonicalUrl: "https://loconomy.com/services/cleaning",
        ogImage: "/landing/cleaning-hero.jpg",
      },
      analytics: {
        sessions: 32145,
        bounceRate: 28.3,
        avgTimeOnPage: 180,
        conversions: 892,
      },
    },
  ];

  const mockSeoAnalysis: SEOAnalysis = {
    score: 85,
    issues: [
      {
        type: "warning",
        message: "Meta description is too short",
        suggestion: "Expand your meta description to 150-160 characters for better search visibility",
      },
      {
        type: "info",
        message: "Consider adding more internal links",
        suggestion: "Add 2-3 internal links to related content to improve site navigation",
      },
    ],
    recommendations: [
      "Add alt text to all images",
      "Improve page loading speed",
      "Add structured data markup",
      "Optimize for mobile devices",
    ],
    keywords: [
      { keyword: "cleaning services", density: 2.3, position: 1, difficulty: 65 },
      { keyword: "professional cleaners", density: 1.8, position: 3, difficulty: 45 },
      { keyword: "home cleaning", density: 3.1, position: 2, difficulty: 55 },
    ],
  };

  const mockMediaItems: MediaItem[] = [
    {
      id: "img_1",
      name: "cleaning-hero.jpg",
      type: "image",
      url: "/images/cleaning-hero.jpg",
      size: 245680,
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      usedIn: ["Professional Cleaning Services Landing Page"],
      alt: "Professional cleaner working in modern kitchen",
      dimensions: { width: 1920, height: 1080 },
    },
    {
      id: "img_2",
      name: "cleaning-guide-og.jpg",
      type: "image",
      url: "/images/cleaning-guide-og.jpg",
      size: 156420,
      uploadedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      usedIn: ["Complete Guide to Home Cleaning Services"],
      alt: "Home cleaning guide illustration",
      dimensions: { width: 1200, height: 630 },
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setContentItems(mockContentItems);
      setMediaItems(mockMediaItems);
      setSeoAnalysis(mockSeoAnalysis);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "draft":
        return <Edit className="w-4 h-4 text-gray-600" />;
      case "scheduled":
        return <OptimizedIcon name="Clock" className="w-4 h-4 text-blue-600" />;
      case "archived":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 bg-green-50 border-green-200";
      case "draft":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "scheduled":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "archived":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredContent = contentItems.filter(item => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and optimize your content for better SEO performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Content
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <NavigationIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="page">Pages</SelectItem>
                    <SelectItem value="blog">Blog Posts</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="landing">Landing Pages</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredContent.map((content) => (
              <Card key={content.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{content.title}</h3>
                        <Badge variant="outline">{content.type}</Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(content.status)}
                          <Badge className={getStatusColor(content.status)}>
                            {content.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3 line-clamp-2">{content.excerpt}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <NavigationIcons.User className="w-4 h-4" />
                          <span>{content.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BusinessIcons.Calendar className="w-4 h-4" />
                          <span>{content.updatedAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{content.views.toLocaleString()} views</span>
                        </div>
                        {content.status === "published" && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{content.analytics.conversions} conversions</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {content.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContent(content)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <NavigationIcons.Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={editorView === "edit" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditorView("edit")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant={editorView === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setEditorView("preview")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
            
            {editorView === "preview" && (
              <div className="flex items-center gap-2">
                <Button
                  variant={devicePreview === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDevicePreview("desktop")}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={devicePreview === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDevicePreview("tablet")}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button
                  variant={devicePreview === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDevicePreview("mobile")}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Content Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Content Editor</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button size="sm">
                        <Globe className="w-4 h-4 mr-2" />
                        Publish
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input placeholder="Enter content title..." className="text-lg font-semibold" />
                  </div>
                  
                  <div>
                    <Label>Slug</Label>
                    <Input placeholder="url-friendly-slug" />
                  </div>

                  <div>
                    <Label>Excerpt</Label>
                    <Textarea 
                      placeholder="Brief description of the content..." 
                      rows={3}
                    />
                  </div>

                  {editorView === "edit" ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label>Content</Label>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Underline className="w-4 h-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-6" />
                          <Button variant="ghost" size="sm">
                            <List className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Quote className="w-4 h-4" />
                          </Button>
                          <Separator orientation="vertical" className="h-6" />
                          <Button variant="ghost" size="sm">
                            <LinkIcon className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ImageIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        placeholder="Start writing your content..." 
                        rows={15}
                        className="font-mono"
                      />
                    </div>
                  ) : (
                    <div className={`border rounded-lg p-4 ${
                      devicePreview === "mobile" ? "max-w-sm mx-auto" :
                      devicePreview === "tablet" ? "max-w-2xl mx-auto" :
                      "w-full"
                    }`}>
                      <div className="prose max-w-none">
                        <h1>Sample Blog Post Title</h1>
                        <p className="lead">This is a sample excerpt that would appear at the beginning of the blog post.</p>
                        <p>This is where the main content would be rendered. The preview shows how the content will look to visitors.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Status</Label>
                    <Select defaultValue="draft">
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select defaultValue="blog">
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="landing">Landing Page</SelectItem>
                        <SelectItem value="service">Service Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Category</Label>
                    <Select>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home-services">Home Services</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="tips">Tips & Guides</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input placeholder="Add tags..." className="h-8 text-sm" />
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">cleaning</Badge>
                    <Badge variant="secondary" className="text-xs">tips</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload featured image</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          {seoAnalysis && (
            <>
              {/* SEO Score */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getSeoScoreColor(seoAnalysis.score)}`}>
                      {seoAnalysis.score}/100
                    </div>
                    <p className="text-muted-foreground">SEO Score</p>
                    <Progress value={seoAnalysis.score} className="mt-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Issues & Suggestions</h4>
                      <div className="space-y-2">
                        {seoAnalysis.issues.map((issue, index) => (
                          <div key={index} className="flex gap-3 p-3 border rounded-lg">
                            <div className="mt-0.5">
                              {issue.type === "error" && <XCircle className="w-4 h-4 text-red-600" />}
                              {issue.type === "warning" && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                              {issue.type === "info" && <CheckCircle className="w-4 h-4 text-blue-600" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{issue.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">{issue.suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Keyword Analysis</h4>
                      <div className="space-y-3">
                        {seoAnalysis.keywords.map((keyword) => (
                          <div key={keyword.keyword} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{keyword.keyword}</span>
                              <span className="text-sm text-muted-foreground">
                                Rank #{keyword.position}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Density: </span>
                                <span>{keyword.density}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Difficulty: </span>
                                <span>{keyword.difficulty}/100</span>
                              </div>
                            </div>
                            <Progress value={keyword.difficulty} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>SEO Title</Label>
                    <Input placeholder="Page title for search engines..." />
                    <p className="text-xs text-muted-foreground mt-1">
                      55 characters recommended
                    </p>
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea 
                      placeholder="Brief description for search results..." 
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      150-160 characters recommended
                    </p>
                  </div>

                  <div>
                    <Label>Keywords</Label>
                    <Input placeholder="keyword1, keyword2, keyword3..." />
                  </div>

                  <div>
                    <Label>Canonical URL</Label>
                    <Input placeholder="https://example.com/canonical-url" />
                  </div>

                  <div>
                    <Label>Open Graph Image</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Image URL for social sharing" />
                      <Button variant="outline">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Schema Markup</Label>
                    <Textarea 
                      placeholder="JSON-LD structured data..." 
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Media Library</h3>
              <p className="text-sm text-muted-foreground">
                Manage, images, videos, and other media files
              </p>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3">
                  <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                    {item.type === "image" && <Image className="w-8 h-8 text-muted-foreground" />}
                    {item.type === "video" && <Video className="w-8 h-8 text-muted-foreground" />}
                    {item.type === "audio" && <Mic className="w-8 h-8 text-muted-foreground" />}
                    {item.type === "document" && <FileText className="w-8 h-8 text-muted-foreground" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                    {item.dimensions && (
                      <p className="text-xs text-muted-foreground">
                        {item.dimensions.width}×{item.dimensions.height}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45,680</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-muted-foreground">Conversions</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">32.5%</div>
                  <div className="text-sm text-muted-foreground">Bounce Rate</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">3:45</div>
                  <div className="text-sm text-muted-foreground">Avg. Time</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentItems
                  .filter(item => item.status === "published")
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">{content.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{content.views.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
