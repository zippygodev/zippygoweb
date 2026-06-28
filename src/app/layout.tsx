import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Zippy Go - One Food Court. One Cart. One Checkout.',
    template: '%s | Zippy Go',
  },
  description: 'Order food from multiple restaurants in your food court with a single cart and checkout.',
  keywords: ['food court', 'food delivery', 'multi-restaurant', 'food ordering', 'Zippy Go'],
  authors: [{ name: 'Zippy Go' }],
  creator: 'Zippy Go',
  publisher: 'Zippy Go',
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Zippy Go',
    title: 'Zippy Go - One Food Court. One Cart. One Checkout.',
    description: 'Order food from multiple restaurants in your food court with a single cart and checkout.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zippy Go',
    description: 'Order food from multiple restaurants in your food court with a single cart and checkout.',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${plusJakarta.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
