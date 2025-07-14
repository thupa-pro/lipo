import type React from "react"
import type { ReactElement } from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { jest } from "@jest/globals" // Import jest to fix the undeclared variable error

// Mock Supabase client for testing
export const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signIn: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    signOut: jest.fn(() => Promise.resolve({ error: null })),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
    })),
    insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
    update: jest.fn(() => Promise.resolve({ data: [], error: null })),
    delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
  })),
}

// Test wrapper component
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from "@testing-library/react"
export { customRender as render }

// Mock data generators
export const mockUser = {
  id: "user-123",
  email: "test@example.com",
  name: "Test User",
  created_at: new Date().toISOString(),
}

export const mockJob = {
  id: "job-123",
  title: "Fix leaky faucet",
  description: "Kitchen faucet is dripping constantly",
  category: "plumbing",
  budget: 150,
  status: "open",
  user_id: "user-123",
  created_at: new Date().toISOString(),
}

export const mockProvider = {
  id: "provider-123",
  business_name: "Quick Fix Plumbing",
  services: ["plumbing", "handyman"],
  hourly_rate: 75,
  rating: 4.8,
  reviews_count: 127,
  user_id: "user-456",
}

// Test helpers
export const waitForLoadingToFinish = () => new Promise((resolve) => setTimeout(resolve, 0))

export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }))
}

export const mockGeolocation = () => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success) =>
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      }),
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  }
}
