"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BuilderAsset, BuilderGallery, BuilderHero } from "@/components/ui/builder-asset";
import { PremiumSection } from "@/components/ui/premium-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Layout, 
  Zap,
  Star,
  ArrowRight,
  Download,
  Eye,
  Heart
} from "lucide-react";

// Builder.io Asset URLs provided by the user
const builderAssets = [
  {
    id: 1,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2Ffbc0df5e4f5b4125b6e3c0bdf6e3c05c?alt=media&token=3e51fb62-b684-428e-9f97-c3fe336cb66a&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Hero Design Asset",
    description: "Premium hero section visual",
    category: "hero",
    tags: ["premium", "hero", "main"]
  },
  {
    id: 2,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2F647d287b961648c9855489fa80f07fe8?alt=media&token=f38711d0-af05-46ea-a413-074f1e6786e4&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Feature Showcase",
    description: "Interactive feature demonstration",
    category: "features",
    tags: ["features", "interactive", "demo"]
  },
  {
    id: 3,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2F872ad85713284d568c6dff934145ea22?alt=media&token=9fea256a-7dfe-4c0b-bcd1-9c1369638825&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Service Gallery",
    description: "Professional service showcase",
    category: "gallery",
    tags: ["services", "gallery", "showcase"]
  },
  {
    id: 4,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2Fbd0a3b3c5e044bd6baa005bf4de9d5ec?alt=media&token=8f39ed10-c357-4f57-bcc4-c26bcc593c71&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Provider Profiles",
    description: "Elite provider showcase design",
    category: "profiles",
    tags: ["providers", "profiles", "elite"]
  },
  {
    id: 5,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2Fde2c95ade8f24183a8a06bb07c4ed2de?alt=media&token=dea7d4d8-401f-456f-8e93-c3b92ae92a5c&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Interactive Elements",
    description: "Dynamic UI components",
    category: "components",
    tags: ["ui", "components", "interactive"]
  },
  {
    id: 6,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2F43d64e779cff4e9d9e6458838d607604?alt=media&token=82631bd7-4b11-49dc-a854-6c46199487b4&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Premium Cards",
    description: "Luxury service card designs",
    category: "cards",
    tags: ["cards", "premium", "luxury"]
  },
  {
    id: 7,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2F6a10ff57f50244ea92614be256666ee6?alt=media&token=e4e49092-b850-4282-aeef-4d70b42c5148&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Background Patterns",
    description: "Sophisticated background designs",
    category: "backgrounds",
    tags: ["backgrounds", "patterns", "design"]
  },
  {
    id: 8,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2F7daf3f20607842e590f31d4b64f508e7?alt=media&token=7567f2d0-d864-485b-b0c3-5f93e34a4171&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Call-to-Action",
    description: "Compelling CTA section design",
    category: "cta",
    tags: ["cta", "conversion", "action"]
  },
  {
    id: 9,
    src: "https://cdn.builder.io/o/assets%2F66c9b92010dd4132850c810a663b63b7%2Fd325a9c3d318485b989516d2ab25967c?alt=media&token=02fbe470-b143-4cb9-99e2-8b02a0138e9e&apiKey=66c9b92010dd4132850c810a663b63b7",
    title: "Footer Elements",
    description: "Complete footer section design",
    category: "footer",
    tags: ["footer", "complete", "section"]
  }
];

export function BuilderAssetsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry" | "carousel">("grid");

  const categories = [
    { id: "all", name: "All Assets", icon: Layout },
    { id: "hero", name: "Hero", icon: Sparkles },
    { id: "features", name: "Features", icon: Zap },
    { id: "gallery", name: "Gallery", icon: ImageIcon },
    { id: "profiles", name: "Profiles", icon: Star },
    { id: "components", name: "Components", icon: Palette }
  ];

  const filteredAssets = selectedCategory === "all" 
    ? builderAssets 
    : builderAssets.filter(asset => asset.category === selectedCategory);

  return (
    <PremiumSection
      variant="gradient"
      badge={{ icon: Palette, text: "Builder.io Assets" }}
      title="Premium Design Assets Showcase"
      description="Explore our collection of high-quality design assets optimized for the Loconomy platform"
    >
      {/* Hero Asset Demo */}
      <div className="mb-16">
        <BuilderHero
          src={builderAssets[0].src}
          alt="Premium Hero Design"
          title="Elite Service Experience"
          subtitle="Powered by Builder.io"
          description="Experience the future of local services with our AI-powered platform featuring premium design assets"
          cta={{
            text: "Explore Features",
            href: "#features",
            variant: "primary"
          }}
        />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all duration-300"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          {(["grid", "masonry", "carousel"] as const).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Asset Gallery */}
      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="showcase">Asset Showcase</TabsTrigger>
          <TabsTrigger value="implementations">Implementations</TabsTrigger>
          <TabsTrigger value="customizations">Customizations</TabsTrigger>
        </TabsList>

        <TabsContent value="showcase" className="space-y-8">
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <BuilderAsset
                      src={asset.src}
                      alt={asset.title}
                      variant="card"
                      className="h-48"
                      animate={true}
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{asset.title}</CardTitle>
                          <CardDescription>{asset.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {asset.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {viewMode === "masonry" && (
            <BuilderGallery
              assets={filteredAssets.map(asset => ({
                src: asset.src,
                alt: asset.title,
                title: asset.title,
                description: asset.description
              }))}
              variant="masonry"
              columns={3}
              gap="md"
            />
          )}
        </TabsContent>

        <TabsContent value="implementations" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Hero Section Implementation
                </CardTitle>
                <CardDescription>
                  How to integrate Builder.io assets into hero sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BuilderAsset
                  src={builderAssets[0].src}
                  alt="Hero Implementation"
                  variant="card"
                  overlay={true}
                  className="h-32 mb-4"
                >
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Hero Section</h3>
                    <p className="text-sm opacity-90">With Builder.io Asset</p>
                  </div>
                </BuilderAsset>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`<BuilderHero
  src="builder-asset-url"
  title="Your Title"
  subtitle="Your Subtitle"
  cta={{ text: "CTA", href: "#" }}
/>`}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5" />
                  Gallery Implementation
                </CardTitle>
                <CardDescription>
                  Creating galleries with multiple Builder.io assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {builderAssets.slice(0, 4).map((asset, index) => (
                    <BuilderAsset
                      key={index}
                      src={asset.src}
                      alt={asset.title}
                      variant="thumbnail"
                      className="h-16"
                    />
                  ))}
                </div>
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`<BuilderGallery
  assets={builderAssets}
  variant="grid"
  columns={3}
/>`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customizations" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Customization Options</h3>
            <p className="text-muted-foreground mb-8">
              Our Builder.io asset integration supports extensive customization options including 
              overlay effects, aspect ratios, animation presets, and responsive behavior.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Different Aspect Ratios */}
            <Card>
              <CardHeader>
                <CardTitle>Aspect Ratios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BuilderAsset
                  src={builderAssets[2].src}
                  alt="Square aspect ratio"
                  aspectRatio="square"
                  className="w-full"
                />
                <code className="text-xs">aspectRatio="square"</code>
              </CardContent>
            </Card>

            {/* With Overlay */}
            <Card>
              <CardHeader>
                <CardTitle>Overlay Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BuilderAsset
                  src={builderAssets[3].src}
                  alt="With overlay"
                  variant="card"
                  overlay={true}
                  className="h-32"
                >
                  <div className="text-center">
                    <h4 className="font-semibold">Overlay Content</h4>
                  </div>
                </BuilderAsset>
                <code className="text-xs">overlay={true}</code>
              </CardContent>
            </Card>

            {/* Animation Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Animation Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BuilderAsset
                  src={builderAssets[4].src}
                  alt="Animated asset"
                  variant="card"
                  animate={true}
                  className="h-32"
                />
                <code className="text-xs">animate={true}</code>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Integrate These Assets?</h3>
            <p className="text-lg mb-6 opacity-90">
              Start using these premium Builder.io assets in your Loconomy platform today
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-100">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </PremiumSection>
  );
}
