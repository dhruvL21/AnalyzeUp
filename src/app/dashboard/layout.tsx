
'use client';
import { Header } from '@/components/header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-screen">
         <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b bg-muted/40 px-4 backdrop-blur-sm lg:px-6 animate-pulse">
            <div className="h-8 w-32 bg-muted rounded"></div>
            <div className="h-8 w-64 bg-muted rounded hidden md:block"></div>
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="h-9 w-9 bg-muted rounded-full"></div>
            </div>
         </div>
         <main className="flex-1 p-4 md:p-6 bg-background">
            {/* You can add a more detailed skeleton for the content area if needed */}
         </main>
       </div>
    )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <DashboardLoading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>
    </div>
  );
}
