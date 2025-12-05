'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Nav from '@/components/nav';
import { Header } from '@/components/header';
import { AnalyzeUpIcon } from '@/components/analyze-up-icon';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r-0"
        variant="sidebar"
      >
        <SidebarHeader>
          <div className="flex h-12 items-center justify-start px-3 text-xl font-semibold">
            <AnalyzeUpIcon className="h-6 w-6 text-primary" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden text-sidebar-foreground">
              AnalyzeUp
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.displayName || 'User'}
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                {user?.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
