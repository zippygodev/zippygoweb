'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotFormData) {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Something went wrong');
      }

      setIsSuccess(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center"
      >
        <motion.div variants={itemVariants}>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-2">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Check your email
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            We&apos;ve sent a password reset link to your email address.
            <br />
            Please check your inbox and follow the instructions.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3 w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsSuccess(false)}
          >
            <Send className="mr-2 h-4 w-4" />
            Resend email
          </Button>

          <Link href="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back link */}
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
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Forgot password?
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          No worries. Enter your email and we&apos;ll send you a reset link.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
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

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </Button>
      </motion.form>

      {/* Login link */}
      <motion.div variants={itemVariants} className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{' '}
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
