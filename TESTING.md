# Testing Guide

Loconomy follows comprehensive testing practices to ensure code quality, reliability, and user satisfaction. This guide covers our testing strategy for React 19 Server Components, Server Actions, and modern Next.js 15 features, along with tools and best practices.

## 🧪 Testing Philosophy

We believe in **Test-Driven Development (TDD)** and maintain high test coverage across our codebase. Our testing pyramid includes:

- **Unit Tests** (70%): Fast, isolated tests for individual functions and components
- **Integration Tests** (20%): Tests for component interactions and API endpoints
- **End-to-End Tests** (10%): Full user journey testing across the application

## 🛠️ Testing Stack

### **Core Testing Tools**
- **Vitest** - Fast testing framework (Vite-powered)
- **Jest** - JavaScript testing framework (legacy support)
- **React Testing Library** - React 19 component testing
- **Playwright** - End-to-end testing with Server Components
- **MSW (Mock Service Worker)** - API mocking for Server Actions
- **Testing Library/User Event** - User interaction simulation
- **React 19 Test Utils** - Server Component testing utilities

### **Additional Tools**
- **Storybook** - Component isolation and visual testing
- **Chromatic** - Visual regression testing
- **Lighthouse CI** - Performance testing
- **Accessibility Testing** - axe-core integration

---

## 🏃‍♂️ Running Tests

### **Quick Start**

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- UserProfile.test.tsx

# Run tests matching pattern
pnpm test -- --testNamePattern="should render"
```

### **Test Scripts**

```bash
# Unit and integration tests
pnpm test                    # Run once
pnpm test:watch             # Watch mode
pnpm test:coverage          # With coverage report
pnpm test:ci                # CI mode (no watch)

# End-to-end tests
pnpm test:e2e               # Run E2E tests
pnpm test:e2e:headed        # Run with browser UI
pnpm test:e2e:debug         # Run in debug mode

# Visual tests
pnpm test:visual            # Storybook visual tests
pnpm test:chromatic         # Visual regression tests

# Performance tests
pnpm test:lighthouse        # Lighthouse performance tests

# All tests
pnpm test:all               # Run complete test suite
```

---

## 🚀 Testing React 19 Features

### **Server Components Testing**

Testing Server Components requires special handling since they run on the server:

```typescript
// __tests__/components/ProviderList.server.test.tsx
import { render } from '@testing-library/react';
import { ProviderList } from '@/components/ProviderList';

// Mock database calls
jest.mock('@/lib/database', () => ({
  getProviders: jest.fn()
}));

describe('ProviderList Server Component', () => {
  it('renders provider list from server data', async () => {
    const mockProviders = [
      { id: '1', name: 'John Doe', rating: 4.5 },
      { id: '2', name: 'Jane Smith', rating: 4.8 }
    ];
    
    (getProviders as jest.Mock).mockResolvedValue(mockProviders);
    
    const { findByText } = render(await ProviderList());
    
    expect(await findByText('John Doe')).toBeInTheDocument();
    expect(await findByText('Jane Smith')).toBeInTheDocument();
  });
});
```

### **Server Actions Testing**

Testing Server Actions involves mocking database operations and validating state changes:

```typescript
// __tests__/actions/booking.test.ts
import { bookService } from '@/lib/actions/booking';
import { createBooking } from '@/lib/database';

jest.mock('@/lib/database');

describe('bookService Server Action', () => {
  it('creates booking successfully', async () => {
    const mockBooking = { id: 'booking_123', status: 'confirmed' };
    (createBooking as jest.Mock).mockResolvedValue(mockBooking);
    
    const formData = new FormData();
    formData.append('providerId', 'provider_123');
    formData.append('serviceId', 'service_456');
    formData.append('date', '2024-03-15T10:00');
    
    const result = await bookService(formData);
    
    expect(result.success).toBe(true);
    expect(result.booking).toEqual(mockBooking);
    expect(createBooking).toHaveBeenCalledWith({
      providerId: 'provider_123',
      serviceId: 'service_456',
      date: '2024-03-15T10:00'
    });
  });
  
  it('handles booking errors gracefully', async () => {
    (createBooking as jest.Mock).mockRejectedValue(
      new Error('Provider not available')
    );
    
    const formData = new FormData();
    formData.append('providerId', 'provider_123');
    
    const result = await bookService(formData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Provider not available');
  });
});
```

### **useActionState Hook Testing**

Testing components that use the new React 19 hooks:

```typescript
// __tests__/components/BookingForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingForm } from '@/components/BookingForm';

// Mock the Server Action
const mockBookService = jest.fn();
jest.mock('@/lib/actions/booking', () => ({
  bookService: mockBookService
}));

describe('BookingForm with useActionState', () => {
  it('submits form and shows success state', async () => {
    mockBookService.mockResolvedValue({ 
      success: true, 
      booking: { id: 'booking_123' } 
    });
    
    render(<BookingForm providerId="provider_123" />);
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    const dateInput = screen.getByLabelText(/date/i);
    
    fireEvent.change(dateInput, { target: { value: '2024-03-15T10:00' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    });
  });
  
  it('shows error state on failure', async () => {
    mockBookService.mockResolvedValue({ 
      success: false, 
      error: 'Provider not available' 
    });
    
    render(<BookingForm providerId="provider_123" />);
    
    const submitButton = screen.getByRole('button', { name: /book now/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/provider not available/i)).toBeInTheDocument();
    });
  });
});
```

### **useOptimistic Hook Testing**

Testing optimistic updates requires checking both immediate and eventual state:

```typescript
// __tests__/components/ProfileForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/ProfileForm';

describe('ProfileForm with useOptimistic', () => {
  it('shows optimistic updates immediately', async () => {
    const mockProvider = { 
      id: 'provider_123', 
      businessName: 'Old Name',
      bio: 'Old bio' 
    };
    
    render(<ProfileForm provider={mockProvider} />);
    
    const nameInput = screen.getByDisplayValue('Old Name');
    const submitButton = screen.getByRole('button', { name: /update/i });
    
    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(submitButton);
    
    // Should show optimistic update immediately
    expect(screen.getByDisplayValue('New Name')).toBeInTheDocument();
  });
});
```

### **Concurrent Rendering Testing**

Testing components with Suspense boundaries and concurrent features:

```typescript
// __tests__/components/SearchResults.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { SearchResults } from '@/components/SearchResults';

describe('SearchResults with Suspense', () => {
  it('shows loading state then results', async () => {
    render(
      <Suspense fallback={<div>Loading providers...</div>}>
        <SearchResults query="plumber" />
      </Suspense>
    );
    
    // Should show loading state first
    expect(screen.getByText(/loading providers/i)).toBeInTheDocument();
    
    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByTestId('provider-list')).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/loading providers/i)).not.toBeInTheDocument();
  });
});
```

---

## 🔬 Unit Testing

### **Component Testing**

```typescript
// components/UserProfile/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserProfile } from './UserProfile';

const mockUser = {
  id: 'usr_123',
  displayName: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  isVerified: true,
};

describe('UserProfile', () => {
  it('should render user information correctly', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe')).toHaveAttribute('src', mockUser.avatar);
  });

  it('should show verification badge for verified users', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByLabelText('Verified user')).toBeInTheDocument();
  });

  it('should handle edit button click', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    
    render(<UserProfile user={mockUser} onEdit={onEdit} />);
    
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('should be accessible', async () => {
    const { container } = render(<UserProfile user={mockUser} />);
    
    // Test for accessibility violations
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### **Hook Testing**

```typescript
// hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AuthProvider } from '../providers/AuthProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should return initial unauthenticated state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('user@example.com', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### **Utility Function Testing**

```typescript
// lib/utils/validation.test.ts
import { validateEmail, validatePassword, formatCurrency } from './validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });
  });
});
```

---

## 🔗 Integration Testing

### **API Route Testing**

```typescript
// app/api/providers/route.test.ts
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the database
jest.mock('@/lib/database', () => ({
  prisma: {
    provider: {
      findMany: jest.fn(),
    },
  },
}));

describe('/api/providers', () => {
  it('should return providers successfully', async () => {
    const mockProviders = [
      {
        id: 'prv_123',
        businessName: 'Test Provider',
        category: 'cleaning',
      },
    ];

    (prisma.provider.findMany as jest.Mock).mockResolvedValue(mockProviders);

    const request = new NextRequest('http://localhost:3000/api/providers');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.providers).toEqual(mockProviders);
  });

  it('should handle database errors', async () => {
    (prisma.provider.findMany as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new NextRequest('http://localhost:3000/api/providers');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
```

### **Database Integration Testing**

```typescript
// lib/database/providers.test.ts
import { createProvider, getProviderById } from './providers';
import { setupTestDatabase, cleanupTestDatabase } from '../test-utils';

describe('Provider Database Operations', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('createProvider', () => {
    it('should create a new provider', async () => {
      const providerData = {
        businessName: 'Test Cleaning Service',
        email: 'test@cleaning.com',
        category: 'cleaning',
        location: {
          city: 'San Francisco',
          state: 'CA',
        },
      };

      const provider = await createProvider(providerData);

      expect(provider.id).toBeDefined();
      expect(provider.businessName).toBe(providerData.businessName);
      expect(provider.email).toBe(providerData.email);
    });

    it('should reject duplicate email addresses', async () => {
      const providerData = {
        businessName: 'Another Service',
        email: 'test@cleaning.com', // Already exists
        category: 'plumbing',
      };

      await expect(createProvider(providerData)).rejects.toThrow(
        'Email already exists'
      );
    });
  });
});
```

---

## 🌐 End-to-End Testing

### **User Journey Testing**

```typescript
// tests/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('should complete full booking journey', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Search for providers
    await page.fill('[data-testid="search-input"]', 'cleaning services');
    await page.fill('[data-testid="location-input"]', 'San Francisco, CA');
    await page.click('[data-testid="search-button"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="provider-card"]');
    
    // Select first provider
    await page.click('[data-testid="provider-card"]:first-child');
    
    // View provider details
    await expect(page.locator('h1')).toContainText('Elite Cleaning Services');
    
    // Click book now
    await page.click('[data-testid="book-now-button"]');
    
    // Fill booking form
    await page.selectOption('[data-testid="service-select"]', 'residential-cleaning');
    await page.fill('[data-testid="date-input"]', '2024-03-15');
    await page.fill('[data-testid="time-input"]', '10:00');
    await page.fill('[data-testid="address-input"]', '123 Test Street');
    await page.fill('[data-testid="notes-input"]', 'Please focus on kitchen');
    
    // Proceed to payment
    await page.click('[data-testid="proceed-payment-button"]');
    
    // Fill payment details (test mode)
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    // Complete booking
    await page.click('[data-testid="complete-booking-button"]');
    
    // Verify confirmation
    await expect(page.locator('[data-testid="booking-confirmation"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Booking Confirmed');
  });

  test('should handle booking errors gracefully', async ({ page }) => {
    await page.goto('/providers/invalid-provider-id');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Provider not found'
    );
  });
});
```

### **Mobile Testing**

```typescript
// tests/e2e/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test.describe('Mobile Experience', () => {
  test('should work correctly on mobile devices', async ({ page }) => {
    await page.goto('/');
    
    // Test mobile navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    
    // Test responsive search
    await page.fill('[data-testid="mobile-search-input"]', 'plumber');
    await page.click('[data-testid="mobile-search-button"]');
    
    // Verify mobile-optimized results
    await expect(page.locator('[data-testid="mobile-provider-card"]')).toBeVisible();
  });
});
```

---

## 📊 Performance Testing

### **Lighthouse CI Configuration**

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/browse',
        'http://localhost:3000/pricing',
      ],
      startServerCommand: 'pnpm start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'lhci',
      serverBaseUrl: 'https://lighthouse-ci.loconomy.com',
    },
  },
};
```

### **Load Testing**

```javascript
// tests/load/booking-flow.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 20 },
    { duration: '5m', target: 20 },
    { duration: '2m', target: 0 },
  ],
};

export default function () {
  // Test provider search
  let response = http.get('http://localhost:3000/api/providers?location=SF');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
  
  // Test booking creation
  let bookingData = {
    providerId: 'prv_123',
    serviceId: 'svc_cleaning',
    scheduledFor: '2024-03-15T10:00:00Z',
  };
  
  response = http.post(
    'http://localhost:3000/api/bookings',
    JSON.stringify(bookingData),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test_token',
      },
    }
  );
  
  check(response, {
    'booking created': (r) => r.status === 201,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  sleep(2);
}
```

---

## 🎨 Visual Testing

### **Storybook Testing**

```typescript
// stories/UserProfile.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from '../components/UserProfile';

const meta: Meta<typeof UserProfile> = {
  title: 'Components/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      id: 'usr_123',
      displayName: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      isVerified: true,
    },
  },
};

export const Unverified: Story = {
  args: {
    user: {
      ...Default.args.user,
      isVerified: false,
    },
  },
};

export const Loading: Story = {
  args: {
    user: null,
    isLoading: true,
  },
};
```

### **Visual Regression Testing**

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage should match visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('provider card should match visual baseline', async ({ page }) => {
    await page.goto('/browse');
    await page.waitForSelector('[data-testid="provider-card"]');
    
    const providerCard = page.locator('[data-testid="provider-card"]').first();
    await expect(providerCard).toHaveScreenshot('provider-card.png');
  });
});
```

---

## 🛡️ Security Testing

### **Authentication Testing**

```typescript
// tests/security/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Security', () => {
  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/auth/signin');
  });

  test('should handle invalid credentials properly', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="signin-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'Invalid credentials'
    );
  });
});
```

### **Input Validation Testing**

```typescript
// tests/security/validation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Input Validation', () => {
  test('should prevent XSS in search input', async ({ page }) => {
    await page.goto('/');
    
    const maliciousScript = '<script>alert("XSS")</script>';
    await page.fill('[data-testid="search-input"]', maliciousScript);
    await page.click('[data-testid="search-button"]');
    
    // Verify script is escaped/sanitized
    const searchResults = page.locator('[data-testid="search-results"]');
    await expect(searchResults).not.toContainText('<script>');
  });
});
```

---

## 🏗️ Test Organization

### **File Structure**

```
tests/
├── __mocks__/              # Mock files
│   ├── fileMock.js
│   └── styleMock.js
├── e2e/                    # End-to-end tests
│   ├── auth/
│   ├── booking/
│   └── search/
├── integration/            # Integration tests
│   ├── api/
│   └── database/
├── load/                   # Performance tests
├── security/              # Security tests
├── visual/                # Visual regression tests
├── fixtures/              # Test data
├── utils/                 # Test utilities
└── setup/                 # Test setup files
    ├── jest.config.js
    ├── playwright.config.ts
    └── test-utils.tsx
```

### **Test Utilities**

```typescript
// tests/utils/test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 📈 Coverage Reports

### **Coverage Configuration**

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
```

### **Coverage Reports**

```bash
# Generate coverage report
pnpm test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html

# Upload to codecov
codecov --token=$CODECOV_TOKEN
```

---

## 🔄 Continuous Integration

### **GitHub Actions Workflow**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:ci
      
      - name: Run E2E tests
        run: pnpm test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 🚀 Best Practices

### **Writing Good Tests**

1. **Follow AAA Pattern**: Arrange, Act, Assert
2. **Use descriptive test names** that explain the behavior
3. **Test behavior, not implementation**
4. **Keep tests isolated** and independent
5. **Use data-testid** attributes for reliable element selection
6. **Mock external dependencies** appropriately
7. **Test edge cases** and error conditions

### **Performance Testing**

1. **Test critical user journeys** under load
2. **Monitor Core Web Vitals** in CI/CD
3. **Set performance budgets** and fail builds when exceeded
4. **Test on various network conditions**

### **Accessibility Testing**

1. **Include accessibility tests** in component testing
2. **Test keyboard navigation**
3. **Verify screen reader compatibility**
4. **Check color contrast ratios**

---

## 📞 Support

For testing questions and support:

- **Documentation**: [docs.loconomy.com/testing](https://docs.loconomy.com/testing)
- **GitHub Issues**: [Report testing issues](https://github.com/loconomy/loconomy/issues)
- **Discord**: [#testing channel](https://discord.gg/loconomy)
- **Email**: [qa@loconomy.com](mailto:qa@loconomy.com)

---

*This testing guide is updated regularly. For the latest testing practices and tools, check our documentation website.*