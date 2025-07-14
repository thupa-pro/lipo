import pino from "pino"

const isDevelopment = process.env.NODE_ENV === "development"

export const logger = pino({
  level: isDevelopment ? "debug" : "info",
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
    log: (object) => ({
      ...object,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
    }),
  },
})

// Structured logging helpers
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    },
    "Application error occurred",
  )
}

export const logUserAction = (userId: string, action: string, metadata?: Record<string, any>) => {
  logger.info(
    {
      userId,
      action,
      metadata,
      type: "user_action",
    },
    `User action: ${action}`,
  )
}

export const logApiRequest = (method: string, path: string, duration: number, statusCode: number) => {
  logger.info(
    {
      method,
      path,
      duration,
      statusCode,
      type: "api_request",
    },
    `${method} ${path} - ${statusCode} (${duration}ms)`,
  )
}

export const logJobEvent = (jobId: string, event: string, metadata?: Record<string, any>) => {
  logger.info(
    {
      jobId,
      event,
      metadata,
      type: "job_event",
    },
    `Job event: ${event}`,
  )
}
