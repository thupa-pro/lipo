import { Metadata } from 'next';
import { SecureSignIn } from '@/components/auth/SecureSignIn';

export const metadata: Metadata = {
  title: 'Sign In | Loconomy',
  description: 'Sign in to your Loconomy account to access premium local services.',
};

export default function SignInPage() {
  return <SecureSignIn />;
}
