"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cookie, Info, Settings, Shield, Mail, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CookiePolicyPage() {
  const { toast } = useToast()
  const router = useRouter()

  const cookieSections = [
    {
      icon: Info,
      title: "1. What Are Cookies?",
      description: "An explanation of what cookies are and how they function.",
      content: [
        "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.",
        "Cookies can be 'persistent' or 'session' cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.",
      ],
    },
    {
      icon: CheckCircle,
      title: "2. How We Use Cookies",
      description: "Details on the purposes for which Loconomy uses cookies.",
      content: [
        "We use cookies for various purposes, including to enable certain functions of the Service, to provide analytics, to store your preferences, and to enable advertisements delivery, including behavioral advertising.",
        "We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:",
        "**Essential cookies:** These cookies are strictly necessary to provide you with services available through our Website and to enable you to use some of its features. Without these cookies, we cannot provide you with services like secure login or shopping carts.",
        "**Analytics cookies:** These cookies allow us to collect information about how you use our Website, such as which pages you visit most often, and if you experience any errors. These cookies do not collect information that identifies you. All information these cookies collect is aggregated and therefore anonymous. It is only used to improve how our Website works.",
        "**Preference cookies:** These cookies allow our Website to remember choices you make when you use our Website, such as remembering your login details or language preference. The purpose of these cookies is to provide you with a more personal experience and to avoid you having to re-enter your preferences every time you visit our Website.",
        "**Advertising cookies:** These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaigns.",
      ],
    },
    {
      icon: Settings,
      title: "3. Your Choices Regarding Cookies",
      description: "How you can manage or opt-out of cookies.",
      content: [
        "If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.",
        "For the Chrome web browser, please visit this page from Google: [https://support.google.com/accounts/answer/32050](https://support.google.com/accounts/answer/32050)",
        "For the Internet Explorer web browser, please visit this page from Microsoft: [http://support.microsoft.com/kb/278835](http://support.microsoft.com/kb/278835)",
        "For the Firefox web browser, please visit this page from Mozilla: [https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored](https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored)",
        "For the Safari web browser, please visit this page from Apple: [https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac](https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac)",
        "For any other web browser, please visit your web browser's official web pages.",
      ],
    },
    {
      icon: Shield,
      title: "4. Changes to This Cookie Policy",
      description: "How we will notify you of updates to our cookie practices.",
      content: [
        "We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the 'Last updated' date.",
        "You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.",
      ],
    },
  ]

  // Helper function to render content with bolding
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g); // Split by bolded text
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-16 px-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <div className="container mx-auto max-w-4xl">
          <Cookie className="w-16 h-16 text-orange-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Understanding how Loconomy uses cookies to enhance your experience.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: October 26, 2023</p>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Privacy and Our Use of Cookies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We use cookies to provide you with a better browsing experience and to understand how you interact with our platform.
            </p>
          </div>

          <div className="space-y-12">
            {cookieSections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <section.icon className="w-5 h-5 mr-2 text-primary" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-muted-foreground text-sm leading-relaxed">
                      {renderContent(paragraph)}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/50 dark:bg-muted/30 text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Questions About Our Cookie Policy?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            If you have any questions regarding this Cookie Policy, please contact us.
          </p>
          <Button size="lg" onClick={() => toast({ title: "Email Privacy Team", description: "Opening your email client to privacy@loconomy.com...", variant: "default" })}>
            <Mail className="w-4 h-4 mr-2" />
            Contact Our Privacy Team
          </Button>
        </div>
      </section>
    </div>
  )
}