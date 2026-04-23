"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Zap, 
  Target, 
  ShoppingCart, 
  Layers, 
  Dna, 
  Trophy,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Smile
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const entities = [
  {
    id: "game/species-category",
    name: "Species Category",
    description: "Group species into distinct categories.",
    icon: LayoutGrid,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "game/species-level",
    name: "Species Level",
    description: "Configure level requirements and rewards.",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: "game/species",
    name: "Species",
    description: "Define different pet species and their traits.",
    icon: Dna,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "game/pet",
    name: "Pet",
    description: "Manage virtual companions and their base stats.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "game/shop-item-type",
    name: "Shop Item Type",
    description: "Categorize shop items (Consumables, etc).",
    icon: LayoutGrid,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    id: "game/shop-item",
    name: "Shop Item",
    description: "Manage items available in the global shop.",
    icon: ShoppingCart,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    id: "game/quest-type",
    name: "Quest Type",
    description: "Define quest categories (Daily, Squad, etc).",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "game/quest",
    name: "Quest",
    description: "Configure specific quests and reward pools.",
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "game/mood",
    name: "Mood",
    description: "Manage emotional tracking labels for user reflections.",
    icon: Smile,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

export default function GameOverview() {
  const router = useRouter();

  const handleCardClick = (id: string) => {
    router.push(`/dashboard?view=${id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black tracking-tight text-foreground uppercase">In Game Management</h2>
        <p className="text-sm text-muted-foreground">Configure and manage the core engine of Kaizen's gamified experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {entities.map((entity) => (
          <Card 
            key={entity.id}
            onClick={() => handleCardClick(entity.id)}
            className="p-6 cursor-pointer group hover:border-secondary/30 transition-all relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${entity.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <entity.icon className={`w-6 h-6 ${entity.color}`} />
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">
              {entity.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {entity.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              Manage Entity <ArrowRight className="w-3 h-3" />
            </div>

            {/* Decorative background element */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${entity.bg} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
