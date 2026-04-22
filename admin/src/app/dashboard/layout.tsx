"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { Header } from "@/components/dashboard/layout/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    const token = localStorage.getItem("admin_token");
    if (!user || !token) {
      router.push("/login");
    } else {
      setAdmin(JSON.parse(user));
    }

    // Load saved sidebar state
    const savedSidebar = localStorage.getItem("sidebar_open");
    if (savedSidebar !== null) {
      setIsSidebarOpen(savedSidebar === "true");
    } else {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }

    const handleResizeListener = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    window.addEventListener("resize", handleResizeListener);
    return () => {
      window.removeEventListener("resize", handleResizeListener);
    };
  }, [router]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebar_open", String(newState));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/login");
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-secondary/30">
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Suspense fallback={null}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar}
          isMobileOpen={isMobileMenuOpen} 
          onCloseMobile={() => setIsMobileMenuOpen(false)} 
          onLogout={handleLogout}
        />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Suspense fallback={null}>
          <Header 
            admin={admin} 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
        </Suspense>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
