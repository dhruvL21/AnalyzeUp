import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { DataProvider } from '@/context/data-context';
import ClientOnly from '@/components/ClientOnly';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'AnalyzeUp',
  description: 'A modern inventory management platform for growing businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="antialiased h-full bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientOnly>
            <FirebaseClientProvider>
                <DataProvider>
                  {children}
                  <FirebaseErrorListener />
                </DataProvider>
            </FirebaseClientProvider>
          </ClientOnly>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
