# Contributing to Loconomy

We're thrilled that you're interested in contributing to Loconomy! This document provides guidelines and information for contributors to help maintain the high quality and consistency of our codebase.

## 🌟 Welcome Contributors

Whether you're fixing a bug, adding a feature, improving documentation, or helping with translations, every contribution is valuable and appreciated. We believe in building an inclusive and welcoming community for all contributors.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (preferred) or npm
- **Git** for version control
- A **GitHub account**

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/loconomy.git
   cd loconomy
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-org/loconomy.git
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Configure your environment variables
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs

Before creating a bug report, please:

1. **Search existing issues** to avoid duplicates
2. **Use the latest version** of the application
3. **Provide detailed information** using our issue template

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 119.0]
- Node.js version: [e.g. 18.17.0]
- Application version: [e.g. 1.2.3]
```

### ✨ Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Use the feature request template**
3. **Provide detailed use cases**
4. **Consider implementation complexity**

### 💻 Code Contributions

#### Types of Contributions

- **Bug fixes**: Fix existing issues
- **Feature additions**: Add new functionality
- **Performance improvements**: Optimize existing code
- **UI/UX enhancements**: Improve user experience
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage

#### Development Workflow

1. **Create an issue** (if one doesn't exist)
2. **Fork and clone** the repository
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

4. **Make your changes**
   - Follow our coding standards
   - Add tests for new functionality
   - Update documentation if needed

5. **Test your changes**
   ```bash
   # Run all tests
   pnpm test
   
   # Run linting
   pnpm lint
   
   # Run type checking
   pnpm type-check
   
   # Run e2e tests
   pnpm test:e2e
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature" # See commit convention below
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request**
   - Use our PR template
   - Link to related issues
   - Provide detailed description

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for complex objects
- **Avoid `any` type** - use proper typing
- **Use meaningful variable names**
- **Add JSDoc comments** for complex functions

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  isVerified: boolean;
}

/**
 * Validates user email format and domain
 * @param email - The email address to validate
 * @returns True if email is valid, false otherwise
 */
function validateUserEmail(email: string): boolean {
  // Implementation
}

// ❌ Bad
function validate(e: any): any {
  // Implementation
}
```

### React Component Guidelines

- **Use functional components** with hooks
- **Follow naming conventions** (PascalCase for components)
- **Use TypeScript interfaces** for props
- **Implement proper error boundaries**
- **Optimize performance** with React.memo when needed

```tsx
// ✅ Good
interface UserCardProps {
  user: UserProfile;
  onUserClick: (userId: string) => void;
  isLoading?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onUserClick,
  isLoading = false
}) => {
  // Component implementation
};
```

### CSS and Styling

- **Use Tailwind CSS** for styling
- **Follow mobile-first** responsive design
- **Use CSS custom properties** for theming
- **Implement dark mode** support
- **Use semantic HTML** elements

```tsx
// ✅ Good
<article className="card-premium p-6 hover:shadow-lg transition-all duration-300">
  <header className="mb-4">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
      {title}
    </h3>
  </header>
  <main className="text-gray-600 dark:text-gray-400">
    {content}
  </main>
</article>
```

### API Guidelines

- **Use RESTful conventions**
- **Implement proper error handling**
- **Add input validation**
- **Use consistent response formats**
- **Add rate limiting**

```typescript
// ✅ Good API Route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = schema.parse(body);
    
    // Process request
    const result = await processData(validatedData);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request data'
    }, { status: 400 });
  }
}
```

## 📏 Commit Convention

We use **Conventional Commits** for consistent commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(auth): add OAuth2 authentication
fix(ui): resolve mobile navigation issue
docs(api): update API documentation
style(components): format card component
refactor(utils): optimize date formatting
perf(search): improve search algorithm
test(auth): add authentication tests
chore(deps): update dependencies
```

## 🧪 Testing Guidelines

### Unit Tests

- **Test all utility functions**
- **Test component behavior**
- **Mock external dependencies**
- **Aim for 90%+ code coverage**

```typescript
// Example test
import { validateEmail } from '../utils/validation';

describe('validateEmail', () => {
  it('should validate correct email format', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid email format', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### Integration Tests

- **Test API endpoints**
- **Test user workflows**
- **Test database interactions**

### E2E Tests

- **Test critical user journeys**
- **Test across different browsers**
- **Test responsive design**

## 📖 Documentation

### Code Documentation

- **Add JSDoc comments** for functions
- **Document complex algorithms**
- **Explain business logic**
- **Include usage examples**

### README Updates

- **Update feature lists**
- **Add new configuration options**
- **Update installation instructions**

## 🔍 Code Review Process

### For Contributors

1. **Self-review** your code before submitting
2. **Ensure all tests pass**
3. **Address feedback** promptly and professionally
4. **Update your PR** based on review comments

### Review Criteria

- **Code quality** and readability
- **Test coverage** and quality
- **Documentation** completeness
- **Performance** implications
- **Security** considerations
- **Accessibility** compliance

## 🎯 Pull Request Guidelines

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

### PR Best Practices

- **Keep PRs focused** and small
- **Write descriptive titles**
- **Link to related issues**
- **Provide context** in descriptions
- **Add screenshots** for UI changes
- **Request specific reviewers**

## 🏆 Recognition

We appreciate all contributions and recognize contributors in:

- **Release notes**
- **Contributors page**
- **Annual contributor highlights**
- **Special mentions** in project updates

## 📞 Getting Help

If you need assistance:

- **Discord**: [Join our community](https://discord.gg/loconomy)
- **GitHub Discussions**: Ask questions and share ideas
- **Email**: [developers@loconomy.com](mailto:developers@loconomy.com)
- **Office Hours**: Weekly community calls (check Discord for schedule)

## 📋 Contributor License Agreement

By contributing to Loconomy, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

## 🙏 Thank You

Thank you for contributing to Loconomy! Your efforts help make local service discovery better for millions of users worldwide. We're excited to see what you'll build with us!

---

**Questions?** Feel free to reach out to our maintainers or community for guidance. We're here to help! 🤝