import { Metadata } from 'next';
import { SecureSignUp } from '@/components/auth/SecureSignUp';

export const metadata: Metadata = {
  title: 'Sign Up | Loconomy',
  description: 'Create your Loconomy account to access premium local services or offer your expertise.',
};

export default function SignUpPage() {
  return <SecureSignUp />;
}
