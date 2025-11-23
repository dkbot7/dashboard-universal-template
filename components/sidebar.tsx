"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Rocket,
  Brain,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Visão Executiva", href: "/overview", icon: BarChart3 },
  { name: "Aquisição de Leads", href: "/acquisition", icon: TrendingUp },
  { name: "Retenção de Leads", href: "/retention", icon: Users },
  { name: "Monetização", href: "/monetization", icon: DollarSign },
  { name: "Projeções e Receita", href: "/projections", icon: Rocket },
  { name: "Visão Analítica", href: "/analytics", icon: Brain },
  { name: "Acessibilidade", href: "/accessibility", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">🏦 BR Bank Dashboard</h1>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-400 text-center">
          Desenvolvido por Growth Analytics Team
        </p>
        <p className="text-xs text-gray-400 text-center">
          BR Bank • ©2025
        </p>
      </div>
    </div>
  );
}
