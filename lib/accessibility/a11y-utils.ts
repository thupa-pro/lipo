import { useEffect, useRef } from "react";

// Accessibility constants
export const ARIA_LIVE_REGIONS = {
  POLITE: "polite" as const,
  ASSERTIVE: "assertive" as const,
  OFF: "off" as const,
};

export const ARIA_ROLES = {
  ALERT: "alert" as const,
  BANNER: "banner" as const,
  BUTTON: "button" as const,
  COMPLEMENTARY: "complementary" as const,
  CONTENTINFO: "contentinfo" as const,
  DIALOG: "dialog" as const,
  FORM: "form" as const,
  MAIN: "main" as const,
  NAVIGATION: "navigation" as const,
  REGION: "region" as const,
  SEARCH: "search" as const,
  STATUS: "status" as const,
  TAB: "tab" as const,
  TABPANEL: "tabpanel" as const,
  TABLIST: "tablist" as const,
};

// Focus management utilities
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        container.dispatchEvent(new CustomEvent("escape-pressed"));
      }
    }

    document.addEventListener("keydown", handleTabKey);
    document.addEventListener("keydown", handleEscapeKey);

    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleTabKey);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}

// Screen reader announcements
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite",
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.style.width = "1px";
  announcement.style.height = "1px";
  announcement.style.overflow = "hidden";

  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.textContent = message;
  }, 10);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Keyboard navigation helpers
export function handleArrowKeyNavigation(
  event: React.KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: "horizontal" | "vertical" = "vertical",
) {
  const { key } = event;
  let newIndex = currentIndex;

  if (orientation === "vertical") {
    if (key === "ArrowDown") {
      newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    } else if (key === "ArrowUp") {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  } else {
    if (key === "ArrowRight") {
      newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    } else if (key === "ArrowLeft") {
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    }
  }

  if (newIndex !== currentIndex) {
    event.preventDefault();
    items[newIndex]?.focus();
    return newIndex;
  }

  return currentIndex;
}

// Generate unique IDs for accessibility
let idCounter = 0;
export function generateId(prefix = "a11y"): string {
  return `${prefix}-${++idCounter}`;
}

// Accessible button props generator
export function getButtonProps(
  label: string,
  isPressed?: boolean,
  isExpanded?: boolean,
  controls?: string,
) {
  return {
    "aria-label": label,
    ...(isPressed !== undefined && { "aria-pressed": isPressed }),
    ...(isExpanded !== undefined && { "aria-expanded": isExpanded }),
    ...(controls && { "aria-controls": controls }),
  };
}

// Form field accessibility helpers
export function getFormFieldProps(
  id: string,
  labelId?: string,
  errorId?: string,
  descriptionId?: string,
  required = false,
) {
  const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(" ");

  return {
    id,
    "aria-required": required,
    ...(labelId && { "aria-labelledby": labelId }),
    ...(ariaDescribedBy && { "aria-describedby": ariaDescribedBy }),
    ...(errorId && { "aria-invalid": "true" }),
  };
}

// Modal/Dialog accessibility helpers
export function getDialogProps(
  isOpen: boolean,
  titleId: string,
  descriptionId?: string,
) {
  return {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": titleId,
    ...(descriptionId && { "aria-describedby": descriptionId }),
    ...(isOpen && { "aria-hidden": "false" }),
    ...(!isOpen && { "aria-hidden": "true" }),
  };
}

// Skip link component props
export function getSkipLinkProps(target: string) {
  return {
    href: `#${target}`,
    className:
      "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-blue-600 text-white p-2 rounded",
  };
}

// Loading state accessibility
export function getLoadingProps(
  isLoading: boolean,
  loadingText = "Loading...",
) {
  return {
    "aria-busy": isLoading,
    ...(isLoading && { "aria-label": loadingText }),
  };
}

// Reduced motion detection
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// High contrast detection
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

// Focus visible utilities
export function addFocusVisiblePolyfill() {
  if (typeof document === "undefined") return;

  document.addEventListener("keydown", () => {
    document.body.classList.add("keyboard-user");
  });

  document.addEventListener("mousedown", () => {
    document.body.classList.remove("keyboard-user");
  });
}

// Accessibility testing helpers (for development)
export function checkAccessibility(element: Element): string[] {
  const issues: string[] = [];

  const images = element.querySelectorAll("img");
  images.forEach((img) => {
    if (!img.getAttribute("alt")) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });

  const inputs = element.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    const hasLabel =
      input.getAttribute("aria-label") ||
      input.getAttribute("aria-labelledby") ||
      element.querySelector(`label[for="${input.id}"]`);

    if (!hasLabel) {
      issues.push(`Form input missing label: ${input.tagName}`);
    }
  });

  const headings = Array.from(
    element.querySelectorAll("h1, h2, h3, h4, h5, h6"),
  );
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      issues.push(
        `Heading level skip detected: jumped from h${lastLevel} to h${level}`,
      );
    }
    lastLevel = level;
  });

  return issues;
}
