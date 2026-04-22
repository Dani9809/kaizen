"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { 
  ChevronDown, 
  User as UserIcon, 
  Shield, 
  Trash2, 
  Plus,
  Users,
  Search,
  UserPlus,
  CheckCircle2,
  X,
  ListPlus,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupId: number;
}

export default function MemberModal({ isOpen, onClose, onSuccess, groupId }: MemberModalProps) {
  const [roster, setRoster] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  
  // Search & Selection state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRoleId, setNewRoleId] = useState<string>("");

  // Bulk Adding state
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "danger" | "warning";
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "danger"
  });

  const fetchRoster = useCallback(async () => {
    try {
      const data = await apiFetch(`/admin/groups/${groupId}`);
      setRoster(data.members || []);
    } catch (err) {
      toast.error("Failed to fetch squad roster");
    }
  }, [groupId]);

  const fetchMetadata = useCallback(async () => {
    try {
      const [usersData, rolesData] = await Promise.all([
        apiFetch("/admin/users"),
        apiFetch("/admin/roles")
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      toast.error("Failed to fetch metadata");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRoster();
      fetchMetadata();
      setSearchTerm("");
      setSelectedUser(null);
      setNewRoleId("");
      setPendingMembers([]);
    }
  }, [isOpen, fetchRoster, fetchMetadata]);

  const filteredAvailableUsers = useMemo(() => {
    return users
      .filter(u => !roster.some(m => m.account_id === u.account_id))
      .filter(u => !pendingMembers.some(p => p.account_id === u.account_id))
      .filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);
  }, [users, roster, pendingMembers, searchTerm]);

  const checkOwnerConflict = (roleId: number) => {
    const targetRole = roles.find(r => r.role_id === roleId);
    if (targetRole?.role_name === 'Owner') {
      const existingOwnerInRoster = roster.find(m => m.role.role_name === 'Owner');
      const existingOwnerInPending = pendingMembers.find(p => p.role_name === 'Owner');
      
      if (existingOwnerInRoster) return existingOwnerInRoster.account.username;
      if (existingOwnerInPending) return existingOwnerInPending.username;
    }
    return null;
  };

  const handleQueueMember = () => {
    if (!selectedUser || !newRoleId) return;

    const role = roles.find(r => r.role_id === Number(newRoleId));
    const ownerConflict = checkOwnerConflict(Number(newRoleId));

    const addToQueue = () => {
      setPendingMembers([...pendingMembers, {
        account_id: selectedUser.account_id,
        username: selectedUser.username,
        email: selectedUser.email,
        role_id: role.role_id,
        role_name: role.role_name
      }]);
      setSelectedUser(null);
      setNewRoleId("");
      setSearchTerm("");
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    };

    if (ownerConflict) {
      setConfirmConfig({
        isOpen: true,
        title: "Ownership Conflict",
        description: `${ownerConflict} is already queued or set as the Owner. Proceed?`,
        onConfirm: addToQueue,
        variant: "warning",
        confirmLabel: "Queue Anyway"
      });
      return;
    }

    addToQueue();
  };

  const handleRemovePending = (index: number) => {
    setPendingMembers(pendingMembers.filter((_, i) => i !== index));
  };

  const handleConfirmBulkAdd = async () => {
    if (pendingMembers.length === 0) return;
    
    setIsSaving(true);
    try {
      await apiFetch(`/admin/groups/${groupId}/members/bulk`, {
        method: "POST",
        body: JSON.stringify({
          members: pendingMembers.map(p => ({
            account_id: p.account_id,
            role_id: p.role_id
          }))
        })
      });
      toast.success(`Successfully added ${pendingMembers.length} members`);
      setPendingMembers([]);
      fetchRoster();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to add members");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRole = async (memberId: number, roleId: number) => {
    const ownerConflict = checkOwnerConflict(roleId);
    if (ownerConflict) {
      setConfirmConfig({
        isOpen: true,
        title: "Transfer Ownership?",
        description: `${ownerConflict} is already the Owner. Transfer ownership to this member?`,
        onConfirm: async () => {
          try {
            await apiFetch(`/admin/groups/members/${memberId}`, {
              method: "PATCH",
              body: JSON.stringify({ role_id: roleId })
            });
            toast.success("Ownership transferred");
            fetchRoster();
            onSuccess();
          } catch (err: any) {
            toast.error(err.message || "Failed to transfer ownership");
          } finally {
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          }
        },
        variant: "warning",
        confirmLabel: "Transfer"
      });
      return;
    }

    try {
      await apiFetch(`/admin/groups/members/${memberId}`, {
        method: "PATCH",
        body: JSON.stringify({ role_id: roleId })
      });
      toast.success("Role updated");
      fetchRoster();
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Member",
      description: "Are you sure you want to remove this player from the squad?",
      onConfirm: async () => {
        try {
          await apiFetch(`/admin/groups/members/${memberId}`, { method: "DELETE" });
          toast.success("Member removed");
          fetchRoster();
          onSuccess();
        } catch (err: any) {
          toast.error(err.message || "Failed to remove member");
        } finally {
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      },
      variant: "danger",
      confirmLabel: "Remove"
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Manage Squad Roster"
        size="xl"
      >
        <div className="space-y-6">
          {/* Discovery / Selection Section */}
          <div className="bg-secondary/5 border border-secondary/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Discovery</h3>
              </div>
              <Badge variant="neutral" className="text-[10px] font-bold opacity-60">
                {users.length - roster.length - pendingMembers.length} available
              </Badge>
            </div>

            {!selectedUser ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter potential members..."
                    className="pl-10 bg-white dark:bg-card border-secondary/10 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchTerm && filteredAvailableUsers.map((user) => (
                    <button
                      key={user.account_id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center justify-between p-3 bg-white dark:bg-card border border-secondary/5 rounded-xl hover:border-secondary/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 shrink-0 bg-secondary/5 rounded-lg flex items-center justify-center text-secondary/40 font-black group-hover:text-secondary group-hover:bg-secondary/10 transition-colors uppercase text-xs">
                          {user.username[0]}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-xs font-bold text-foreground truncate">{user.username}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-xl">
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary border border-secondary rounded-xl flex items-center justify-center text-white font-black shadow-sm uppercase">
                    {selectedUser.username[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-foreground leading-none">{selectedUser.username}</p>
                    <p className="text-[10px] text-secondary font-bold mt-1 uppercase">Selected</p>
                  </div>
                </div>
                
                <div className="w-full sm:w-48 flex items-center gap-2">
                  <div className="flex-1 relative group">
                    <select
                      className="w-full bg-white dark:bg-card border border-secondary/10 rounded-xl p-3 text-sm focus:outline-none focus:border-secondary/30 transition-all appearance-none pr-10 font-bold"
                      value={newRoleId}
                      onChange={(e) => setNewRoleId(e.target.value)}
                    >
                      <option value="">Role...</option>
                      {roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-3 text-muted-foreground hover:text-red-500 hover:bg-white/50 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Button 
                  variant="gradient" 
                  onClick={handleQueueMember} 
                  className="w-full sm:w-auto px-6 rounded-xl font-black uppercase text-[10px]"
                >
                  <ListPlus className="w-4 h-4 mr-2" /> Queue
                </Button>
              </div>
            )}
          </div>

          {/* Pending Members Section (Bulk) */}
          {pendingMembers.length > 0 && (
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Pending Additions</h3>
                </div>
                <Button 
                  variant="gradient" 
                  size="sm" 
                  onClick={handleConfirmBulkAdd}
                  loading={isSaving}
                  className="text-[9px] font-black uppercase px-4 h-8"
                >
                  Confirm & Add {pendingMembers.length}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {pendingMembers.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2 pl-2 pr-1 py-1 bg-white dark:bg-card border border-amber-500/20 rounded-lg shadow-sm group">
                    <span className="text-[11px] font-bold text-foreground">{p.username}</span>
                    <Badge variant="warning" className="text-[8px] h-4 px-1">{p.role_name}</Badge>
                    <button 
                      onClick={() => handleRemovePending(idx)}
                      className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Roster Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Roster</h3>
              </div>
              <Badge variant="neutral" className="text-[10px] font-bold">{roster.length} Members</Badge>
            </div>

            <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-1 space-y-2">
              {roster.map((member) => (
                <div 
                  key={member.group_member_id}
                  className="flex items-center justify-between p-3 bg-secondary/5 hover:bg-secondary/10 border border-secondary/5 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center text-secondary font-black border border-secondary/10 shadow-sm uppercase">
                      {member.account.username[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground leading-none flex items-center gap-2">
                        {member.account.username}
                        {member.role.role_name === 'Owner' && <Shield className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">{member.account.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative group/role">
                      <select
                        className={`bg-transparent border-none text-xs font-black uppercase tracking-wider focus:outline-none cursor-pointer appearance-none pr-5 text-right transition-colors
                          ${member.role.role_name === 'Owner' ? 'text-amber-500' : 'text-secondary'}
                        `}
                        value={member.role_id}
                        onChange={(e) => handleUpdateRole(member.group_member_id, Number(e.target.value))}
                      >
                        {roles.map((role) => (
                          <option key={role.role_id} value={role.role_id} className="text-foreground bg-white dark:bg-card">
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary/40 pointer-events-none group-hover/role:text-secondary transition-colors" />
                    </div>
                    
                    <button
                      onClick={() => handleRemoveMember(member.group_member_id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl border-secondary/10 hover:bg-secondary/5"
            >
              Finished Management
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        confirmLabel={confirmConfig.confirmLabel}
      />
    </>
  );
}
