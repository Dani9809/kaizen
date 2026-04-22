"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  Target, 
  Users, 
  Zap,
  TrendingUp,
  ChevronRight,
  Shield,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { fetchGroups } from "../api/groups";
import { Group } from "../types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import CreateGroupModal from "./CreateGroupModal";

export default function GroupManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadGroups = useCallback(async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      toast.error("Failed to fetch squads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleGroupClick = (id: number) => {
    router.push(`/dashboard?view=squads/id=${id}`);
  };

  const filteredGroups = groups.filter(g => 
    g.group_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          icon={Search}
          placeholder="Find squad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="w-full sm:max-w-xs"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="primary" size="md" className="flex-1 sm:flex-none gap-2">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button 
            variant="gradient" 
            size="md" 
            className="flex-1 sm:flex-none uppercase font-black"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + NEW SQUAD
          </Button>
        </div>
      </div>

      {/* Groups Table */}
      <Card className="overflow-hidden" hover={false}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/5 border-b border-secondary/10">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Squad Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Privacy</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Members</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Streak</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Longest Streak</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Created At</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {filteredGroups.map((group) => (
                <tr 
                  key={group.group_id} 
                  className="hover:bg-secondary/5 transition-colors group cursor-pointer"
                  onClick={() => handleGroupClick(group.group_id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-foreground">{group.group_name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={group.isSharable ? "success" : "neutral"} className="text-[9px] px-2 py-0.5 h-auto uppercase font-black tracking-tighter">
                      {group.isSharable ? "Public" : "Private"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">{group._count?.members || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-lg flex items-center justify-center">
                         <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                      </div>
                      <span className="text-sm font-black text-foreground">{group.group_streak}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-sm font-bold text-foreground">{group.longest_streak}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs">{new Date(group.group_created).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="p-1.5 hover:bg-secondary/10 dark:hover:bg-white/5 rounded-lg border border-transparent hover:border-secondary/20 text-foreground/40 hover:text-secondary transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredGroups.length === 0 && !loading && (
            <div className="py-20 flex flex-col items-center justify-center text-foreground/30">
               <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center mb-4">
                 <Search className="w-8 h-8" />
               </div>
               <p className="font-black text-xs uppercase tracking-widest">No squads found</p>
            </div>
          )}
          {loading && (
            <div className="py-20 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </Card>

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={loadGroups} 
      />
    </div>
  );
}
