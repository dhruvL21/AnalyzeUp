
'use client';

import { BarChart3, Boxes, ShoppingCart, DollarSign, Truck, Package, TrendingUp } from "lucide-react";

const featureCards = [
    {
        icon: <Boxes size={32} strokeWidth={1.5} />,
        label: "Inventory",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
        icon: <TrendingUp size={32} strokeWidth={1.5} />,
        label: "Sales",
        className: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    {
        icon: <Truck size={32} strokeWidth={1.5} />,
        label: "Suppliers",
        className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
        icon: <BarChart3 size={32} strokeWidth={1.5} />,
        label: "Reports",
        className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
];


export function AnimatedHero() {
  return (
    <div className="relative w-full max-w-2xl mx-auto p-4">
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {featureCards.map((card, index) => (
                <div key={index} className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border transition-all ${card.className} aspect-square`}>
                    {card.icon}
                    <p className="font-semibold text-sm sm:text-base">{card.label}</p>
                </div>
            ))}
        </div>
    </div>
  );
}
