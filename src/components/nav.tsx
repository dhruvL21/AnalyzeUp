
"use client";

import { usePathname } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Truck,
  BarChart3,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnalyzeUpIcon } from "./analyze-up-icon";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/inventory",
    icon: Boxes,
    label: "Inventory",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
  },
  {
    href: "/dashboard/suppliers",
    icon: Truck,
    label: "Suppliers",
  },
  {
    href: "/dashboard/reports",
    icon: BarChart3,
    label: "Reports",
  },
  {
    href: "/dashboard/reports/visualizer",
    icon: PieChart,
    label: "Visualizer"
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function Nav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
        <nav className="grid gap-2 text-lg font-medium">
            <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
                <AnalyzeUpIcon className="h-6 w-6 text-primary" />
                <span>AnalyzeUp</span>
            </Link>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        pathname === item.href && "text-primary bg-muted"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium ml-6">
      {navItems.map((item) => (
        <Link 
            key={item.href}
            href={item.href}
            className={cn("transition-colors hover:text-foreground",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
            )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
