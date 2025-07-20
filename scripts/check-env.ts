const requiredEnv = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn('Missing required environment variables:');
  missing.forEach((key) => console.warn(`  - ${key}`));
  process.exit(1);
} else {
  console.log('All required Clerk and Supabase environment variables are set.');
}