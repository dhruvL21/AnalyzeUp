
'use client';

import { BarChart3, Boxes, ShoppingCart, DollarSign, Truck } from "lucide-react";

export function AnimatedHero() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center gap-8 p-6 bg-muted/20 rounded-2xl border border-border/20 shadow-inner">
        <Boxes size={40} strokeWidth={1.5} className="text-foreground/80" />
        <ShoppingCart size={40} strokeWidth={1.5} className="text-foreground/80" />
        <BarChart3 size={40} strokeWidth={1.5} className="text-foreground/80" />
        <DollarSign size={40} strokeWidth={1.5} className="text-foreground/80" />
        <Truck size={40} strokeWidth={1.5} className="text-foreground/80" />
    </div>
  );
}
