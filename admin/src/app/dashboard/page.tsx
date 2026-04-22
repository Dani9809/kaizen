"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  User,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

// Import view components
import Overview from "@/components/dashboard/Overview";
import UserManagement from "@/components/dashboard/UserManagement";

export default function MasterDashboard() {
  const [activeView, setActiveView] = useState<string>("overview");
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

    // Auto-collapse sidebar on smaller screens
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/login");
  };

  const navItems = [
    { id: "overview", name: "Dashboard", icon: LayoutDashboard },
    { id: "users", name: "User Base", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "overview": return <Overview />;
      case "users": return <UserManagement />;
      default: return <Overview />;
    }
  };

  if (!admin) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
       <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-secondary/30">
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-all duration-300
          ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 lg:w-auto lg:translate-x-0"}
          ${!isMobileMenuOpen && isSidebarOpen ? "lg:w-64" : "lg:w-20"}
          bg-white border-r border-secondary/20 flex flex-col shadow-xl shadow-secondary/5
        `}
      >
        <div className={`h-20 flex items-center ${isSidebarOpen ? "px-6 justify-between" : "justify-center"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20 animate-float shrink-0">
              <span className="text-white font-bold text-lg font-heading">K</span>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <span className="font-bold text-lg tracking-tight text-gradient font-heading">KAIZEN</span>
            )}
          </div>
          {(isSidebarOpen || isMobileMenuOpen) && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 text-foreground/40">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-3 py-4 flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center p-3 rounded-xl transition-all relative group
                ${isSidebarOpen || isMobileMenuOpen ? "gap-3" : "justify-center"}
                ${activeView === item.id 
                  ? "bg-secondary/10 text-secondary" 
                  : "text-foreground/40 hover:bg-secondary/5 hover:text-secondary"}
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeView === item.id ? "text-secondary" : ""}`} />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-sm">{item.name}</span>}
              {activeView === item.id && (
                <div className="absolute right-0 w-1 h-6 bg-secondary rounded-l-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-secondary/10">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center p-3 rounded-xl text-red-400 hover:bg-red-50 transition-all group
              ${isSidebarOpen || isMobileMenuOpen ? "gap-3" : "justify-center"}
            `}
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-semibold text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Navbar */}
        <header className="h-20 shrink-0 glass z-30 px-4 lg:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-secondary/10 rounded-lg text-foreground/60"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 hover:bg-secondary/10 rounded-lg text-foreground/40"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-secondary/20 hidden sm:block" />
            <h2 className="text-lg font-bold text-foreground font-heading truncate max-w-[150px] sm:max-w-none">
              {navItems.find(i => i.id === activeView)?.name}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <button className="relative p-2 text-foreground/40 hover:text-secondary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-white animate-pulse-soft" />
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-6 border-l border-secondary/20">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground leading-tight">{admin.username}</p>
                <p className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" /> {admin.type || "ADMIN"}
                </p>
              </div>
              <div className="w-9 h-9 gamified-gradient rounded-full flex items-center justify-center border-2 border-white shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
