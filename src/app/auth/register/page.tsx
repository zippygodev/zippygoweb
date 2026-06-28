'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  Store,
  Bike,
  UserCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { validatePhone } from '@/lib/utils';
import toast from 'react-hot-toast';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email'),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || validatePhone(val), {
        message: 'Please enter a valid phone number',
      }),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER', 'DELIVERY_PARTNER'], {
      required_error: 'Please select a role',
    }),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: 'CUSTOMER' as const,
    label: 'Customer',
    description: 'Order from your favourite restaurants',
    icon: UserCircle,
  },
  {
    value: 'RESTAURANT_OWNER' as const,
    label: 'Restaurant Owner',
    description: 'Manage your restaurant and menu',
    icon: Store,
  },
  {
    value: 'DELIVERY_PARTNER' as const,
    label: 'Delivery Partner',
    description: 'Deliver orders and earn money',
    icon: Bike,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'CUSTOMER',
      acceptTerms: false as unknown as true,
    },
  });

  const selectedRole = watch('role');
  const acceptTerms = watch('acceptTerms');
  const watchedPassword = watch('password');

  async function onSubmit(data: RegisterFormData) {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        const fieldError =
          result.fieldErrors?.name?.[0] ||
          result.fieldErrors?.email?.[0] ||
          result.fieldErrors?.phone?.[0] ||
          result.fieldErrors?.password?.[0] ||
          result.fieldErrors?.role?.[0];
        throw new Error(fieldError || result.error || 'Registration failed');
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/auth/login');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Create an account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join Zippy Go and get started
        </p>
      </motion.div>

      {/* Role Selection */}
      <motion.div variants={itemVariants} className="mb-6">
        <Label className="mb-3 block">I am a...</Label>
        <div className="grid grid-cols-3 gap-2">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setValue('role', role.value, { shouldValidate: true })}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all duration-200',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/60 hover:border-border hover:bg-accent/50'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-semibold leading-tight',
                    isSelected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {role.label}
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {role.description}
                </span>
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.role.message}
          </p>
        )}
      </motion.div>

      <Separator className="mb-6" />

      {/* Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              autoFocus
              className={cn(
                'pl-10',
                errors.name && touchedFields.name && 'border-destructive ring-destructive/30'
              )}
              {...register('name')}
            />
          </div>
          {errors.name && touchedFields.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

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

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone{' '}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              className={cn(
                'pl-10',
                errors.phone && touchedFields.phone && 'border-destructive ring-destructive/30'
              )}
              {...register('phone')}
            />
          </div>
          {errors.phone && touchedFields.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              autoComplete="new-password"
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
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className={cn(
                'pl-10 pr-10',
                errors.confirmPassword &&
                  touchedFields.confirmPassword &&
                  'border-destructive ring-destructive/30'
              )}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && touchedFields.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="acceptTerms"
            checked={acceptTerms === true}
            onCheckedChange={(checked) =>
              setValue('acceptTerms', checked === true ? (true as unknown as true) : (false as unknown as true), {
                shouldValidate: true,
              })
            }
            className="mt-0.5"
          />
          <Label
            htmlFor="acceptTerms"
            className="cursor-pointer text-sm font-normal leading-5 text-muted-foreground"
          >
            I agree to the{' '}
            <Link href="/terms" className="text-primary underline-offset-2 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">
            {errors.acceptTerms.message}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className="mt-2 w-full"
          size="lg"
          loading={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </motion.form>

      {/* Login link */}
      <motion.div variants={itemVariants} className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
