"use client";

import React, { useEffect, useState, useCallback } from "react";
import { 
  CreditCard, 
  Edit2, 
  Trash2,
  Plus,
  Users, 
  ListTodo, 
  DollarSign,
  AlertCircle,
  ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface SubscriptionTier {
  subscription_tier_id: number;
  subscription_tier_name: string;
  monthly_price: number;
  max_active_groups: number;
  max_custom_tasks: number;
}

export default function SubscriptionManagement() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit/Create Modal State
  const [editingTier, setEditingTier] = useState<Partial<SubscriptionTier> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

  // Delete Modal State
  const [tierToDelete, setTierToDelete] = useState<SubscriptionTier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTiers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/admin/subscriptions/tiers");
      setTiers(data);
    } catch (err) {
      toast.error("Failed to fetch subscription tiers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);

  const handleCreate = () => {
    setModalMode("create");
    setEditingTier({
      subscription_tier_name: "",
      monthly_price: 0,
      max_active_groups: 1,
      max_custom_tasks: 5
    });
    setIsModalOpen(true);
  };

  const handleEdit = (tier: SubscriptionTier) => {
    setModalMode("edit");
    setEditingTier({ ...tier });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingTier) return;
    
    try {
      setIsSaving(true);
      const method = modalMode === "create" ? "POST" : "PATCH";
      const url = modalMode === "create" 
        ? "/admin/subscriptions/tiers" 
        : `/admin/subscriptions/tiers/${editingTier.subscription_tier_id}`;

      await apiFetch(url, {
        method,
        body: JSON.stringify({
          subscription_tier_name: editingTier.subscription_tier_name,
          monthly_price: Number(editingTier.monthly_price),
          max_active_groups: Number(editingTier.max_active_groups),
          max_custom_tasks: Number(editingTier.max_custom_tasks)
        })
      });
      
      toast.success(`Subscription tier ${modalMode === "create" ? "created" : "updated"} successfully`);
      setIsModalOpen(false);
      fetchTiers();
    } catch (err) {
      toast.error(`Failed to ${modalMode} tier`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!tierToDelete) return;
    
    try {
      setIsDeleting(true);
      await apiFetch(`/admin/subscriptions/tiers/${tierToDelete.subscription_tier_id}`, {
        method: "DELETE"
      });
      
      toast.success("Subscription tier deleted successfully");
      setTierToDelete(null);
      fetchTiers();
    } catch (err) {
      toast.error("Failed to delete tier. Ensure no accounts are using this tier.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black text-foreground tracking-tight uppercase font-heading">
          Subscription Tiers
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage platform access levels, pricing, and feature limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Button
          variant="primary"
          onClick={handleCreate}
          className="h-full min-h-[160px] border-dashed border-2 bg-transparent hover:bg-secondary/5 flex flex-col items-center justify-center gap-3 group transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-secondary" />
          </div>
          <span className="font-black uppercase tracking-widest text-xs">New Tier</span>
        </Button>

        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-secondary/5"><div /></Card>
          ))
        ) : (
          tiers.map((tier) => (
            <Card 
              key={tier.subscription_tier_id} 
              className="relative group overflow-hidden cursor-pointer" 
              hover={true}
              onClick={() => handleEdit(tier)}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20">
                      <CreditCard className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tight text-foreground truncate max-w-[150px]">
                        {tier.subscription_tier_name}
                      </h3>
                      <div className="flex items-center gap-1 text-secondary font-black text-sm">
                        <DollarSign className="w-3 h-3" />
                        {tier.monthly_price}/mo
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {tier.subscription_tier_id !== 1 && (
                      <Button 
                        variant="ghost" 
                        size="md" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTierToDelete(tier);
                        }}
                        className="h-12 w-12 p-0 rounded-full bg-secondary/5 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-6 h-6 text-muted-foreground hover:text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Users className="w-3 h-3" /> Max Squads
                    </div>
                    <div className="text-xl font-black text-foreground">
                      {tier.max_active_groups}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <ListTodo className="w-3 h-3" /> Max Tasks
                    </div>
                    <div className="text-xl font-black text-foreground">
                      {tier.max_custom_tasks}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-secondary/50 opacity-20" />
            </Card>
          ))
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Create New Subscription Tier" : `Edit Tier: ${editingTier?.subscription_tier_name}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} loading={isSaving}>
              {modalMode === "create" ? "Create Tier" : "Save Changes"}
            </Button>
          </>
        }
      >
        {editingTier && (
          <div className="space-y-4">
            <Input
              label="Tier Name"
              value={editingTier.subscription_tier_name}
              onChange={(e) => setEditingTier({ ...editingTier, subscription_tier_name: e.target.value })}
              maxLength={50}
              placeholder="e.g. Premium"
            />
            <Input
              label="Monthly Price"
              type="number"
              value={editingTier.monthly_price}
              onChange={(e) => setEditingTier({ ...editingTier, monthly_price: Number(e.target.value) })}
              icon={DollarSign}
              placeholder="0.00"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Active Squads"
                type="number"
                value={editingTier.max_active_groups}
                onChange={(e) => setEditingTier({ ...editingTier, max_active_groups: Number(e.target.value) })}
                icon={Users}
              />
              <Input
                label="Max Custom Tasks"
                type="number"
                value={editingTier.max_custom_tasks}
                onChange={(e) => setEditingTier({ ...editingTier, max_custom_tasks: Number(e.target.value) })}
                icon={ListTodo}
              />
            </div>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs text-amber-500/80 leading-relaxed font-medium">
                Changes to subscription tiers will apply immediately to all users assigned to this tier.
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!tierToDelete}
        onClose={() => setTierToDelete(null)}
        title="Delete Subscription Tier"
        footer={
          <>
            <Button variant="ghost" onClick={() => setTierToDelete(null)}>
              Keep Tier
            </Button>
            <Button 
              variant="primary" 
              className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
              onClick={handleDelete} 
              loading={isDeleting}
            >
              Delete Tier
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-black text-lg uppercase tracking-tight">Are you absolutely sure?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are about to delete the <span className="font-bold text-foreground underline decoration-red-500">{tierToDelete?.subscription_tier_name}</span> tier. 
              This action cannot be undone if no users are currently assigned to this tier.
            </p>
          </div>
          
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="text-xs text-red-500/80 leading-relaxed font-medium">
              If accounts are still linked to this tier, the deletion will fail to protect data integrity.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
