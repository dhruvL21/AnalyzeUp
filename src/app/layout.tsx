
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MountainIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export const metadata: Metadata = {
  title: 'AnalyzeUp',
  description: 'A modern inventory management platform for growing businesses.',
};

function PublicHeader() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-background sticky top-0 z-50 border-b">
      <Link href="#" className="flex items-center justify-center">
        <MountainIcon className="h-6 w-6 text-primary" />
        <span className="sr-only">AnalyzeUp</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          href="#features"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Features
        </Link>
        <Link
          href="/login"
        >
          <Button variant="outline">Sign In</Button>
        </Link>
        <Link href="/register">
          <Button>Sign Up</Button>
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased h-full bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
