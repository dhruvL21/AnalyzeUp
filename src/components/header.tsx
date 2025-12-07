
'use client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThemeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, Menu } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Nav from './nav';
import Link from 'next/link';
import { AnalyzeUpIcon } from './analyze-up-icon';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet';
import { useUser, useAuth } from '@/firebase';
import { signOut } from '@/firebase/auth/auth-service';


export function Header() {
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();


  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b bg-muted/40 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex flex-shrink-0 items-center gap-2 font-semibold">
        <Link href="/dashboard" className="flex items-center gap-2">
          <AnalyzeUpIcon className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold">AnalyzeUp</span>
        </Link>
      </div>

      <div className="hidden flex-1 justify-center md:flex">
        <Nav />
      </div>

      <div className="flex flex-shrink-0 items-center justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Log out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ThemeToggle />
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user?.photoURL || ''}
              alt="User avatar"
            />
            <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Nav isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
