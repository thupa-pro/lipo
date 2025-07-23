import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|es|fr|it|pt|zh|hi|ar|bn|ru|ja|pa|ur|ko|tr|th|fa|pl|nl|uk|vi|he|sw|ro|el|cs|hu|fi|da|no|sv|id|ms|tl|am|mg)/:path*']
};
