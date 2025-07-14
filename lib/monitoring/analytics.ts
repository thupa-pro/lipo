import { PostHog } from "posthog-node"

const posthogClient = process.env.POSTHOG_API_KEY
  ? new PostHog(process.env.POSTHOG_API_KEY, {
      host: process.env.POSTHOG_HOST || "https://app.posthog.com",
    })
  : null

export const analytics = {
  track: (userId: string, event: string, properties?: Record<string, any>) => {
    if (posthogClient) {
      posthogClient.capture({
        distinctId: userId,
        event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
        },
      })
    }
  },

  identify: (userId: string, properties?: Record<string, any>) => {
    if (posthogClient) {
      posthogClient.identify({
        distinctId: userId,
        properties,
      })
    }
  },

  page: (userId: string, page: string, properties?: Record<string, any>) => {
    if (posthogClient) {
      posthogClient.capture({
        distinctId: userId,
        event: "$pageview",
        properties: {
          $current_url: page,
          ...properties,
        },
      })
    }
  },

  shutdown: async () => {
    if (posthogClient) {
      await posthogClient.shutdown()
    }
  },
}

// Event tracking helpers
export const trackJobPosted = (userId: string, jobData: any) => {
  analytics.track(userId, "job_posted", {
    category: jobData.category,
    budget: jobData.budget,
    urgency: jobData.urgency,
  })
}

export const trackProviderMatched = (userId: string, jobId: string, providerId: string) => {
  analytics.track(userId, "provider_matched", {
    job_id: jobId,
    provider_id: providerId,
  })
}

export const trackPaymentCompleted = (userId: string, amount: number, jobId: string) => {
  analytics.track(userId, "payment_completed", {
    amount,
    job_id: jobId,
    currency: "USD",
  })
}
