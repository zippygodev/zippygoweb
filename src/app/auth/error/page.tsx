'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please contact support if this is an error.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The verification link may have expired or already been used. Please try again.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'There was a problem signing you in with your social account. Please try again.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'There was a problem completing the sign in. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'There was a problem creating your account. Please try again or use email.',
  },
  EmailCreateAccount: {
    title: 'Account Creation Error',
    description: 'There was a problem creating your account with this email. Please try another.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'There was a problem with the authentication callback. Please try again.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred during sign in. Please try again.',
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error') || 'Default';
  const error = errorMessages[errorCode] || errorMessages.Default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4"
    >
      <div className="w-full max-w-md space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10"
        >
          <AlertCircle className="h-10 w-10 text-destructive" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{error.title}</h1>
          <p className="text-sm text-muted-foreground">{error.description}</p>
          {errorCode !== 'Default' && (
            <p className="text-xs text-muted-foreground/60">Error code: {errorCode}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/auth/login">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
