'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Nav from '@/components/nav';
import { Header } from '@/components/header';
import { AnalyzeUpIcon } from '@/components/analyze-up-icon';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>
    </div>
  );
}
