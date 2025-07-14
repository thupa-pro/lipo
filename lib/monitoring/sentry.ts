import * as Sentry from "@sentry/nextjs"

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    debug: process.env.NODE_ENV === "development",
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["localhost", /^https:\/\/loconomy\.vercel\.app/],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event) {
      // Filter out non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0]
        if (error?.type === "ChunkLoadError" || error?.type === "ResizeObserver loop limit exceeded") {
          return null
        }
      }
      return event
    },
  })
}

export { Sentry }

// Custom error boundary
export function captureException(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.keys(context).forEach((key) => {
        scope.setTag(key, context[key])
      })
    }
    Sentry.captureException(error)
  })
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  Sentry.captureMessage(message, level)
}
