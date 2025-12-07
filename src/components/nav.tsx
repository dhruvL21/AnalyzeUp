
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

export default function Nav() {
  const pathname = usePathname();

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
