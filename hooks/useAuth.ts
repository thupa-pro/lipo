// Export the secure auth hook as the main auth hook
export { useSecureAuth as useAuth } from './useSecureAuth';

// Re-export types for backward compatibility
export type { 
  User, 
  AuthState,
  SignInData,
  SignUpData 
} from './useSecureAuth';
