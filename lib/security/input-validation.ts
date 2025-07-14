import { z } from "zod"

// Common validation schemas
export const emailSchema = z.string().email("Invalid email address")
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain uppercase, lowercase, number and special character",
  )

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")

export const jobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  category: z.enum(["plumbing", "electrical", "cleaning", "moving", "handyman", "other"]),
  budget: z.number().min(10, "Minimum budget is $10").max(10000, "Maximum budget is $10,000"),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  urgency: z.enum(["low", "medium", "high", "emergency"]),
  scheduledFor: z.date().min(new Date(), "Scheduled time must be in the future"),
})

export const providerProfileSchema = z.object({
  businessName: z.string().min(2, "Business name is required").max(100),
  services: z.array(z.string()).min(1, "At least one service is required"),
  experience: z.number().min(0).max(50),
  hourlyRate: z.number().min(10, "Minimum rate is $10/hour").max(500),
  serviceRadius: z.number().min(1, "Minimum radius is 1 mile").max(100),
  bio: z.string().max(500, "Bio must be less than 500 characters"),
  certifications: z.array(z.string()).optional(),
  insurance: z.boolean(),
})

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000),
  jobId: z.string().uuid("Invalid job ID"),
  recipientId: z.string().uuid("Invalid recipient ID"),
})

// Sanitization functions
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// Validation middleware
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (req: Request): Promise<{ success: boolean; data?: T; error?: string }> => {
    try {
      const body = await req.json()
      const data = schema.parse(body)
      return { success: true, data }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
        }
      }
      return { success: false, error: "Invalid request data" }
    }
  }
}
