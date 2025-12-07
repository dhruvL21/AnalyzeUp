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

export default function AppLayout({ children }: { children: React.ReactNode }) {

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
              <AvatarImage src={'https://github.com/shadcn.png'} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">
                Demo User
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                user@example.com
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
