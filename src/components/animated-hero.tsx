
'use client';

import { BarChart3, Boxes, ShoppingCart, DollarSign, Truck, Sparkles } from "lucide-react";

export function AnimatedHero() {
  return (
    <div className="relative w-[250px] h-[250px] [perspective:1000px]">
      <div className="cube w-full h-full">
        <div className="cube-face front">
            <Boxes size={80} strokeWidth={1.5} />
        </div>
        <div className="cube-face back">
            <ShoppingCart size={80} strokeWidth={1.5} />
        </div>
        <div className="cube-face right">
            <BarChart3 size={80} strokeWidth={1.5} />
        </div>
        <div className="cube-face left">
             <DollarSign size={80} strokeWidth={1.5} />
        </div>
        <div className="cube-face top">
            <Truck size={80} strokeWidth={1.5} />
        </div>
        <div className="cube-face bottom">
             <Sparkles size={80} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
