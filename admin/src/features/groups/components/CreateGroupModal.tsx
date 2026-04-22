"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Search, 
  UserPlus, 
  UserMinus, 
  Check, 
  Shield, 
  Users,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { createGroup } from "../api/groups";

interface User {
  account_id: number;
  username: string;
  email: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface SelectedMember {
  account_id: number;
  username: string;
  role_name: 'Owner' | 'Admin' | 'Member';
}

export default function CreateGroupModal({ isOpen, onClose, onSuccess }: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [isSharable, setIsSharable] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    } else {
      // Reset form
      setName("");
      setIsSharable(false);
      setSelectedMembers([]);
      setSearch("");
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/admin/users");
      setAvailableUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (user: User) => {
    const exists = selectedMembers.find(m => m.account_id === user.account_id);
    if (exists) {
      setSelectedMembers(selectedMembers.filter(m => m.account_id !== user.account_id));
    } else {
      setSelectedMembers([...selectedMembers, { 
        account_id: user.account_id, 
        username: user.username, 
        role_name: selectedMembers.length === 0 ? 'Owner' : 'Member' 
      }]);
    }
  };

  const updateRole = (accountId: number, role: 'Owner' | 'Admin' | 'Member') => {
    setSelectedMembers(selectedMembers.map(m => {
      if (m.account_id === accountId) return { ...m, role_name: role };
      // If we're setting a new owner, demote the old one to member
      if (role === 'Owner' && m.role_name === 'Owner') return { ...m, role_name: 'Member' };
      return m;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return toast.error("Squad name is required");
    if (selectedMembers.length < 2) return toast.error("A squad must have at least 2 members");
    if (!selectedMembers.some(m => m.role_name === 'Owner')) return toast.error("Exactly one Owner is required");

    setSubmitting(true);
    try {
      await createGroup({
        name,
        isSharable,
        members: selectedMembers.map(m => ({
          account_id: m.account_id,
          role_name: m.role_name
        }))
      });
      toast.success("Squad created successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to create squad");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ).filter(u => !selectedMembers.find(m => m.account_id === u.account_id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-secondary/20 scale-in-center">
        {/* Header */}
        <div className="p-6 border-b border-secondary/10 flex items-center justify-between bg-secondary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight font-heading">Construct New Squad</h2>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Assemble your elite team</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary/10 rounded-lg text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Squad Designation</label>
                <Input
                  placeholder="e.g. Phoenix Vanguard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Privacy Protocol</label>
                <div className="flex items-center gap-4 h-[42px]">
                  <button
                    type="button"
                    onClick={() => setIsSharable(false)}
                    className={`flex-1 h-full rounded-xl flex items-center justify-center gap-2 border transition-all font-bold text-xs uppercase
                      ${!isSharable ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-transparent border-secondary/10 text-muted-foreground hover:bg-secondary/5'}`}
                  >
                    Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSharable(true)}
                    className={`flex-1 h-full rounded-xl flex items-center justify-center gap-2 border transition-all font-bold text-xs uppercase
                      ${isSharable ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'bg-transparent border-secondary/10 text-muted-foreground hover:bg-secondary/5'}`}
                  >
                    Public
                  </button>
                </div>
              </div>
            </div>

            {/* Member Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-secondary/10">
              {/* User Discovery */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-secondary" /> Discovery
                  </h3>
                  <span className="text-[10px] font-bold text-muted-foreground">{filteredUsers.length} available</span>
                </div>
                <Input
                  icon={Search}
                  placeholder="Filter potential members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-secondary/5"
                />
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {loading ? (
                    <div className="py-10 flex justify-center">
                      <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredUsers.map(user => (
                    <div 
                      key={user.account_id}
                      className="group flex items-center justify-between p-3 bg-secondary/5 border border-transparent hover:border-secondary/20 rounded-xl transition-all cursor-pointer"
                      onClick={() => toggleUser(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white dark:bg-card rounded-lg flex items-center justify-center font-bold text-xs text-secondary border border-secondary/10">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{user.username}</p>
                          <p className="text-[10px] text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <button type="button" className="p-1.5 bg-secondary/10 text-secondary rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && !loading && (
                    <div className="py-10 text-center text-muted-foreground text-xs font-bold uppercase italic opacity-50">No users found</div>
                  )}
                </div>
              </div>

              {/* Squad Roster */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-secondary" /> Squad Roster
                  </h3>
                  <Badge variant={selectedMembers.length >= 2 ? "success" : "neutral"} className="text-[9px]">
                    {selectedMembers.length} / 2 Minimum
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-2">
                  {selectedMembers.map(member => (
                    <div 
                      key={member.account_id}
                      className="flex flex-col p-4 bg-secondary/5 border border-secondary/10 rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-xs text-white">
                            {member.username[0].toUpperCase()}
                          </div>
                          <p className="text-sm font-bold text-foreground">{member.username}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => toggleUser({ account_id: member.account_id, username: member.username, email: "" })}
                          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {['Owner', 'Admin', 'Member'].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => updateRole(member.account_id, role as any)}
                            className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all
                              ${member.role_name === role 
                                ? 'bg-secondary text-white border-secondary shadow-sm' 
                                : 'bg-white dark:bg-card text-muted-foreground border-secondary/10 hover:border-secondary/30'}`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {selectedMembers.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-secondary/10 rounded-2xl">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-xs font-bold uppercase tracking-widest italic opacity-50 text-center px-6">Select members from discovery to build your squad</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-secondary/10 bg-secondary/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
               {!selectedMembers.some(m => m.role_name === 'Owner') && selectedMembers.length > 0 && (
                 <p className="text-[10px] text-red-500 font-bold uppercase flex items-center gap-1.5 animate-pulse">
                   <AlertCircle className="w-3 h-3" /> Missing Owner
                 </p>
               )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
              <Button 
                variant="gradient" 
                type="submit" 
                loading={submitting}
                className="px-10 font-black"
                disabled={selectedMembers.length < 2 || !selectedMembers.some(m => m.role_name === 'Owner') || !name.trim()}
              >
                DEPLOY SQUAD
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
