"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Target, 
  TrendingUp,
  Zap,
  Activity,
  CheckCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiFetch("/admin/dashboard/stats");
        setStats(data);
      } catch (err) {
        // Silent fail for stats
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Players", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
    { name: "Active Squads", value: stats?.totalGroups || 0, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+5%" },
    { name: "Quest Sync", value: `${stats?.completionRate || 0}%`, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+8%" },
    { name: "Live Quests", value: stats?.activeQuests || 0, icon: Activity, color: "text-violet-500", bg: "bg-violet-500/10", trend: "-2%" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse border border-secondary/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.name} className="p-4 group relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.trend}
              </div>
            </div>
            <div className="mt-3 relative z-10">
              <h3 className="text-xl font-black text-foreground font-heading">{stat.value}</h3>
              <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">{stat.name}</p>
            </div>
            {/* Background Accent */}
            <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${stat.bg} rounded-full blur-2xl opacity-50`} />
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 p-6" hover={false}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-foreground font-heading uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" /> User Engagement
            </h3>
            <div className="flex gap-1">
              {['7D', '30D', '90D'].map(t => (
                <button key={t} className="px-2 py-1 text-[10px] font-bold rounded-lg hover:bg-secondary/10 transition-colors">{t}</button>
              ))}
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-1.5">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 40, 85, 30, 60, 45, 70, 55, 90, 65, 80].map((h, i) => (
              <div key={i} className="flex-1 group relative h-full flex items-end">
                <div 
                  className="w-full bg-secondary/10 rounded-t-sm transition-all group-hover:bg-secondary group-hover:shadow-[0_0_12px_rgba(104,224,220,0.5)] cursor-pointer" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-foreground/30 font-bold uppercase">
            <span>Monday</span><span>Wednesday</span><span>Friday</span><span>Sunday</span>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6" hover={false}>
          <h3 className="text-sm font-black text-foreground font-heading uppercase tracking-widest flex items-center gap-2 mb-8">
            <CheckCircle className="w-4 h-4 text-secondary" /> Completion Metrics
          </h3>
          <div className="space-y-5">
            {[
              { label: "Daily Quests", value: 85, color: "bg-blue-500", icon: "💎" },
              { label: "Squad Tasks", value: 62, color: "bg-violet-500", icon: "🛡️" },
              { label: "Solo Focus", value: 45, color: "bg-emerald-500", icon: "⚡" },
              { label: "Reflections", value: 30, color: "bg-amber-500", icon: "📖" },
            ].map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-foreground/60 flex items-center gap-1.5">
                    <span className="text-sm">{item.icon}</span> {item.label}
                  </span>
                  <span className="font-black text-foreground">{item.value}%</span>
                </div>
                <div className="h-1.5 bg-secondary/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${item.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
