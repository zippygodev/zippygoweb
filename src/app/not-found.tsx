import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-black tracking-tighter text-primary">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go Home
          </Link>
          <Link
            href="/customer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium transition-colors hover:bg-accent"
          >
            Browse Food
          </Link>
        </div>
      </div>
    </div>
  );
}
