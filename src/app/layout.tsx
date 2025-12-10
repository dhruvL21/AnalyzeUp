import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';
import { DataProvider } from '@/context/data-context';
import ClientOnly from '@/components/ClientOnly';
import { TaskProvider } from '@/context/task-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="font-body antialiased h-full bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientOnly>
            <FirebaseClientProvider>
                <TaskProvider>
                  <DataProvider>
                    {children}
                    <FirebaseErrorListener />
                  </DataProvider>
                </TaskProvider>
            </FirebaseClientProvider>
          </ClientOnly>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
