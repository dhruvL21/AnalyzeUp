
'use client';

import { BarChart3, Boxes, ShoppingCart, DollarSign, Truck } from "lucide-react";

export function AnimatedHero() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6 p-4 bg-muted/20 rounded-2xl border border-border/20 shadow-inner">
        <Boxes size={32} strokeWidth={1.5} className="text-foreground/80" />
        <ShoppingCart size={32} strokeWidth={1.5} className="text-foreground/80" />
        <BarChart3 size={32} strokeWidth={1.5} className="text-foreground/80" />
        <DollarSign size={32} strokeWidth={1.5} className="text-foreground/80" />
        <Truck size={32} strokeWidth={1.5} className="text-foreground/80" />
    </div>
  );
}
