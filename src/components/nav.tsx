
"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
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

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/inventory",
    icon: Boxes,
    label: "Inventory",
  },
  {
    href: "/orders",
    icon: ShoppingCart,
    label: "Orders",
  },
  {
    href: "/suppliers",
    icon: Truck,
    label: "Suppliers",
  },
  {
    href: "/reports",
    icon: BarChart3,
    label: "Reports",
  },
  {
    href: "/reports/visualizer",
    icon: PieChart,
    label: "Visualizer"
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href) && (item.href !== '/reports' || pathname === '/reports')}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
