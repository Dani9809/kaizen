"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Target,
  Settings, 
  LogOut, 
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ChevronDown,
  LucideIcon
} from "lucide-react";

interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "overview", name: "Dashboard", icon: LayoutDashboard },
  { id: "users", name: "User Base", icon: Users },
  { id: "squads", name: "Squad Base", icon: Target },
  { id: "settings", name: "Settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
}

export const Sidebar = ({ isOpen, onToggle, isMobileOpen, onCloseMobile, onLogout }: SidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  let activeView = searchParams.get("view") || "overview";
  if (activeView.startsWith("squads")) {
    activeView = "squads";
  }

  const [gameMenuOpen, setGameMenuOpen] = React.useState(false);

  const handleNavClick = (id: string) => {
    if (id === "game") {
      setGameMenuOpen(!gameMenuOpen);
      router.push(`/dashboard?view=game`);
    } else {
      router.push(`/dashboard?view=${id}`);
      if (window.innerWidth < 1024) onCloseMobile();
    }
  };

  const gameItems = [
    { id: "game/species-category", name: "Species Category" },
    { id: "game/species-level", name: "Species Level" },
    { id: "game/species", name: "Species" },
    { id: "game/pet", name: "Pet" },
    { id: "game/shop-item-type", name: "Shop Item Type" },
    { id: "game/shop-item", name: "Shop Item" },
    { id: "game/quest-type", name: "Quest Type" },
    { id: "game/quest", name: "Quest" },
  ];

  const isGameActive = activeView === "game" || activeView.startsWith("game/");

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-all duration-300
        ${isMobileOpen ? "translate-x-0 w-[200px]" : "-translate-x-full w-[200px] lg:translate-x-0"}
        ${!isMobileOpen && isOpen ? "lg:w-[200px]" : "lg:w-[60px]"}
        bg-white dark:bg-card border-r border-secondary/20 dark:border-white/5 flex flex-col shadow-xl shadow-secondary/5 shrink-0 h-screen
      `}
    >
      <div className={`h-20 flex items-center w-full px-3`}>
        {/* Desktop View */}
        <div className="hidden lg:flex items-center justify-center w-full">
          {isOpen ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center shadow-lg shadow-secondary/20 shrink-0">
                  <Zap className="w-5 h-5 text-white fill-current" />
                </div>
                <span className="font-bold text-lg tracking-tight text-gradient font-heading uppercase">Kaizen</span>
              </div>
              <button 
                onClick={onToggle} 
                className="p-1.5 border border-secondary/10 dark:border-white/10 hover:border-secondary/30 dark:hover:border-secondary/50 hover:bg-secondary/5 rounded-lg text-muted-foreground transition-all shadow-sm bg-white dark:bg-background group ml-4"
                title="Collapse Sidebar"
              >
                <PanelLeftClose className="w-5 h-5 group-hover:text-secondary transition-colors" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onToggle} 
              className="w-full flex items-center justify-center p-3 border border-secondary/10 dark:border-white/10 hover:border-secondary/30 dark:hover:border-secondary/50 hover:bg-secondary/5 rounded-lg text-muted-foreground transition-all shadow-sm bg-white dark:bg-background group"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="w-5 h-5 group-hover:text-secondary transition-colors" />
            </button>
          )}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 shrink-0">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gradient font-heading uppercase">Kaizen</span>
          </div>
          <button 
            onClick={onCloseMobile} 
            className="p-1.5 border border-secondary/10 dark:border-white/10 hover:border-secondary/30 dark:hover:border-secondary/50 hover:bg-secondary/5 rounded-lg text-muted-foreground transition-all shadow-sm bg-white dark:bg-background group"
            title="Close Sidebar"
          >
            <X className="w-5 h-5 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      <div className="px-3 py-4 flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          if (item.id === "settings") {
            return (
              <React.Fragment key="game-management">
                <div className="pt-2 pb-1 px-3">
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ${(!isOpen && !isMobileOpen) ? "hidden" : "block"}`}>
                    Game Engine
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleNavClick("game")}
                    className={`
                      w-full flex items-center p-3 rounded-lg transition-all relative group
                      ${isOpen || isMobileOpen ? "gap-3" : "justify-center"}
                      ${isGameActive 
                        ? "bg-secondary/10 text-secondary" 
                        : "text-muted-foreground hover:bg-secondary/5 hover:text-secondary"}
                    `}
                  >
                    <Zap className={`w-5 h-5 shrink-0 ${isGameActive ? "text-secondary" : ""}`} />
                    {(isOpen || isMobileOpen) && (
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-semibold text-sm">Game Management</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${gameMenuOpen ? "rotate-180" : ""}`} />
                      </div>
                    )}
                    {isGameActive && (
                      <div className="absolute right-0 w-1 h-6 bg-secondary rounded-l-full" />
                    )}
                  </button>

                  {(gameMenuOpen && (isOpen || isMobileOpen)) && (
                    <div className="mt-1 ml-4 pl-4 border-l border-secondary/10 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {gameItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavClick(subItem.id)}
                          className={`
                            w-full flex items-center p-2 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all
                            ${activeView === subItem.id 
                              ? "text-secondary bg-secondary/5" 
                              : "text-muted-foreground hover:text-secondary hover:bg-secondary/5"}
                          `}
                        >
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center p-3 rounded-lg transition-all relative group
                    ${isOpen || isMobileOpen ? "gap-3" : "justify-center"}
                    ${activeView === item.id 
                      ? "bg-secondary/10 text-secondary" 
                      : "text-muted-foreground hover:bg-secondary/5 hover:text-secondary"}
                  `}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? "text-secondary" : ""}`} />
                  {(isOpen || isMobileOpen) && <span className="font-semibold text-sm">{item.name}</span>}
                  {activeView === item.id && (
                    <div className="absolute right-0 w-1 h-6 bg-secondary rounded-l-full" />
                  )}
                </button>
              </React.Fragment>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center p-3 rounded-lg transition-all relative group
                ${isOpen || isMobileOpen ? "gap-3" : "justify-center"}
                ${activeView === item.id 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-muted-foreground hover:bg-secondary/5 hover:text-secondary"}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? "text-secondary" : ""}`} />
              {(isOpen || isMobileOpen) && <span className="font-semibold text-sm">{item.name}</span>}
              {activeView === item.id && (
                <div className="absolute right-0 w-1 h-6 bg-secondary rounded-l-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="px-3 py-4 mt-auto border-t border-secondary/10 dark:border-white/5">
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group
            ${isOpen || isMobileOpen ? "gap-3" : "justify-center"}
          `}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
          {(isOpen || isMobileOpen) && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
