import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MountainIcon, BotIcon, ZapIcon, BarChartIcon } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Modernize Your Inventory Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    AnalyzeUp provides a powerful and intuitive platform to
                    streamline your inventory, track sales, and make data-driven
                    decisions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/1/600/400"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="dashboard analytics"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is packed with features to help you manage your
                  inventory efficiently, gain valuable insights, and grow your
                  business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BotIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">AI-Powered Insights</h3>
                </div>
                <p className="text-muted-foreground">
                  Leverage artificial intelligence to get smart reorder
                  suggestions, generate product descriptions, and analyze market
                  trends.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <ZapIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Real-Time Tracking</h3>
                </div>
                <p className="text-muted-foreground">
                  Monitor your stock levels, sales, and orders in real-time
                  from anywhere. Never miss a beat with our synchronized
                  dashboard.
                </p>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <BarChartIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">Comprehensive Reports</h3>
                </div>
                <p className="text-muted-foreground">
                  Generate detailed reports on sales, inventory value, and top-performing products to make informed business decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 AnalyzeUp. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
