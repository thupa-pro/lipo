import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  locales,
  localeNames,
  localeFlags,
  type Locale
} from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  variant?: "default" | "mobile" | "premium";
  className?: string;
}

export function LanguageSwitcher({
  variant = "default",
  className,
}: LanguageSwitcherProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Navigation");

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;

    startTransition(() => {
      // Store the selected locale in localStorage for persistence
      localStorage.setItem("preferred-locale", newLocale);

      // Navigate to the same page with new locale
      const currentPath = pathname.replace(`/${locale}`, "");
      const newPath =
        newLocale === "en" ? currentPath : `/${newLocale}${currentPath}`;

      router.push(newPath);
      router.refresh();

      // Show success toast
      toast({
        title: t("language_changed_title"),
        description: t("language_changed_description", {
          languageName: localeNames[newLocale],
        }),
        duration: 3000,
      });
    });
  };

  if (variant === "mobile") {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        <div className="text-sm font-medium text-muted-foreground mb-2">
          {t("select_language")}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {locales.map((lang) => (
            <Button
              key={lang}
              variant={locale === lang ? "default" : "ghost"}
              size="sm"
              onClick={() => switchLanguage(lang)}
              disabled={isPending}
              className={cn(
                "justify-start gap-3 h-12 transition-all duration-200",
                locale === lang &&
                  "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20",
              )}
            >
              <span className="text-lg">{localeFlags[lang]}</span>
              <span className="font-medium">{localeNames[lang]}</span>
              {locale === lang && <Check className="ml-auto h-4 w-4" />}
              {isPending && (
                <UIIcons.Loader2 className="ml-auto h-4 w-4 animate-spin" />
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "premium") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            className={cn(
              "relative gap-2 bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300",
              "hover:shadow-lg hover:shadow-primary/20 group",
              className,
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {isPending ? (
              <UIIcons.Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {localeFlags[locale as Locale]}
            </span>
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              {(locale as string).toUpperCase()}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl"
        >
          {locales.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => switchLanguage(lang)}
              disabled={isPending || locale === lang}
              className={cn(
                "gap-3 cursor-pointer transition-all duration-200",
                locale === lang && "bg-primary/10 font-medium",
              )}
            >
              <span className="text-base">{localeFlags[lang]}</span>
              <span className="flex-1">{localeNames[lang]}</span>
              {locale === lang && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          className={cn("gap-2", className)}
        >
          {isPending ? (
            <UIIcons.Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="text-sm">
            {localeFlags[locale as Locale]} {(locale as string).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            disabled={isPending || locale === lang}
            className={cn(
              "gap-2 cursor-pointer",
              locale === lang && "font-medium",
            )}
          >
            <span>{localeFlags[lang]}</span>
            <span className="flex-1">{localeNames[lang]}</span>
            {locale === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
