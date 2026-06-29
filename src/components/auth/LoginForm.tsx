'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

/** Map role → the dashboard it belongs to */
const ROLE_DESTINATIONS: Record<string, string> = {
  CUSTOMER: '/customer',
  RESTAURANT_OWNER: '/dashboard/restaurant',
  DELIVERY_PARTNER: '/dashboard/delivery',
  MALL_ADMIN: '/dashboard/admin',
  SUPER_ADMIN: '/dashboard/superadmin',
};

/** Map role → the login URL it belongs to (for wrong-role detection) */
const ROLE_LOGIN_URLS: Record<string, string> = {
  CUSTOMER: '/auth/login/customer',
  RESTAURANT_OWNER: '/auth/login/restaurant',
  DELIVERY_PARTNER: '/auth/login/delivery',
  MALL_ADMIN: '/auth/login/mall',
  SUPER_ADMIN: '/auth/login/superadmin',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

interface LoginFormProps {
  title?: string;
  description?: string;
  registerLink?: string;
  expectedRole?: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_PARTNER' | 'MALL_ADMIN' | 'SUPER_ADMIN';
  /** Hide Google sign-in for admin/staff roles */
  showGoogle?: boolean;
}

function LoginFormInner({
  title = 'Welcome back',
  description = 'Sign in to your Zippy Go account',
  registerLink = '/auth/register',
  expectedRole,
  showGoogle = true,
}: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleError, setRoleError] = useState('');
  const callbackUrl = useSearchParams().get('callbackUrl') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  async function onSubmit(data: LoginFormData) {
    setIsSubmitting(true);
    setRoleError('');

    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error('Invalid email or password. Please try again.');
      }

      // Fetch the session to get the user's actual role
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      const userRole: string = sessionData?.user?.role || 'CUSTOMER';

      // ✅ Role validation: if this login page expects a specific role, enforce it
      if (expectedRole && userRole !== expectedRole) {
        // Sign the user back out — they used the wrong login portal
        await fetch('/api/auth/signout', { method: 'POST' });
        const correctLoginUrl = ROLE_LOGIN_URLS[userRole] || '/auth/login';
        setRoleError(
          `This account is registered as "${userRole.replace('_', ' ')}". Please use the correct login portal.`
        );
        setIsSubmitting(false);
        return;
      }

      toast.success('Welcome back!');

      // Determine redirect destination
      const destination =
        callbackUrl && callbackUrl !== '/'
          ? callbackUrl
          : ROLE_DESTINATIONS[userRole] || '/customer';

      router.push(destination);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // For Google: only redirect to the customer dashboard
  const googleCallbackUrl = expectedRole === 'CUSTOMER' || !expectedRole
    ? '/customer'
    : callbackUrl || '/customer';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {description}
        </p>
      </motion.div>

      {/* Role mismatch error */}
      {roleError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{roleError}</span>
        </motion.div>
      )}

      {/* Google OAuth — only for customer and generic logins */}
      {showGoogle && (expectedRole === 'CUSTOMER' || !expectedRole) && (
        <>
          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              className="relative w-full"
              type="button"
              onClick={() => signIn('google', { callbackUrl: googleCallbackUrl })}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="my-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or continue with email
              </span>
            </div>
          </motion.div>
        </>
      )}

      {/* Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
              className={cn(
                'pl-10',
                errors.email && touchedFields.email && 'border-destructive ring-destructive/30'
              )}
              {...register('email')}
            />
          </div>
          {errors.email && touchedFields.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={cn(
                'pl-10 pr-10',
                errors.password && touchedFields.password && 'border-destructive ring-destructive/30'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && touchedFields.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) =>
              setValue('rememberMe', checked === true)
            }
          />
          <Label
            htmlFor="rememberMe"
            className="cursor-pointer text-sm font-normal text-muted-foreground"
          >
            Remember me
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </motion.form>

      {/* Register link */}
      {registerLink && (
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href={registerLink}
              className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
            >
              Create one
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={<div className="flex h-[400px] w-full items-center justify-center text-muted-foreground text-sm">Loading...</div>}>
      <LoginFormInner {...props} />
    </Suspense>
  );
}
