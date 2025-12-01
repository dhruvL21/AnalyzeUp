
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import Nav from "@/components/nav";
import { Header } from "@/components/header";
import { DataProvider } from "@/context/data-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SidebarProvider>
        <Sidebar
          collapsible="icon"
          className="border-r border-sidebar-border"
          variant="sidebar"
        >
          <SidebarHeader>
            <div className="flex h-12 items-center justify-start px-3 text-xl font-semibold text-sidebar-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
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
                <AvatarImage
                  src="https://picsum.photos/seed/avatar/40/40"
                  alt="User avatar"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-sidebar-foreground">
                  Workspace Owner
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  owner@example.com
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
    </DataProvider>
  );
}
