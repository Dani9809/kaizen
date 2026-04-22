"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Shield, 
  ShieldAlert,
  UserCheck,
  Ban,
  Mail,
  Zap
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const data = await apiFetch("/admin/users");
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch players");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusUpdate = async (accountId: number, statusId: number) => {
    try {
      await apiFetch(`/admin/users/${accountId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status_id: statusId })
      });
      toast.success("Player status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          icon={Search}
          placeholder="Find player..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="w-full sm:max-w-xs"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="primary" size="md" className="flex-1 sm:flex-none gap-2">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
          <Button variant="gradient" size="md" className="flex-1 sm:flex-none uppercase font-black">
            + NEW PLAYER
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Card className="overflow-hidden" hover={false}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/5 border-b border-secondary/10">
                <th className="px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Player Profile</th>
                <th className="px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Rank/Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest">Currency</th>
                <th className="px-6 py-4 text-[10px] font-black text-foreground/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/5">
              {filteredUsers.map((user) => (
                <tr key={user.account_id} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform">
                        <UserCheck className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{user.username}</p>
                        <p className="text-[10px] text-foreground/40 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.type?.type_name === 'Admin' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                      )}
                      <span className="text-[11px] font-black uppercase tracking-tight text-foreground/70">
                        {user.type?.type_name || "MEMBER"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={user.status?.account_status_name === 'Active' ? 'success' : 'danger'} 
                      dot
                    >
                      {user.status?.account_status_name}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-amber-100 rounded-lg flex items-center justify-center">
                         <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                      </div>
                      <span className="text-sm font-black text-foreground">{user.currency_balance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleStatusUpdate(user.account_id, user.account_status_id === 1 ? 2 : 1)}
                        className="p-1.5 hover:bg-secondary/10 dark:hover:bg-white/5 rounded-lg border border-transparent hover:border-secondary/20 text-foreground/40 hover:text-secondary transition-all"
                        title={user.account_status_id === 1 ? "Suspend" : "Activate"}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-500/20 text-foreground/40 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-secondary/10 dark:hover:bg-white/5 rounded-lg border border-transparent hover:border-secondary/20 text-foreground/40 hover:text-secondary transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && !loading && (
            <div className="py-20 flex flex-col items-center justify-center text-foreground/30">
               <div className="w-16 h-16 bg-secondary/5 rounded-full flex items-center justify-center mb-4">
                 <Search className="w-8 h-8" />
               </div>
               <p className="font-black text-xs uppercase tracking-widest">No players found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
