
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
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
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
