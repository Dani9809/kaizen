"use client";

import { useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export const useSettings = () => {
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/users/${id}`);
      return data;
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch profile");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccountInfo = useCallback(async (id: number, data: { username?: string; email?: string; subscription_tier_id?: number; currency_balance?: number; account_updated?: Date }) => {
    setLoading(true);
    try {
      const updatedUser = await apiFetch(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      
      // Update local storage if username/email changed
      const currentAdmin = JSON.parse(localStorage.getItem("admin_user") || "{}");
      localStorage.setItem("admin_user", JSON.stringify({
        ...currentAdmin,
        username: updatedUser.username,
        email: updatedUser.email
      }));

      toast.success("Account information updated successfully");
      return updatedUser;
    } catch (err: any) {
      toast.error(err.message || "Failed to update account info");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (id: number, data: { password: string }) => {
    setLoading(true);
    try {
      await apiFetch(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      toast.success("Password updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateAccount = useCallback(async (id: number) => {
    setLoading(true);
    try {
      // Status ID 2 is likely 'Deactivated' or 'Suspended' as per UserManagement.tsx
      await apiFetch(`/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status_id: 2 }),
      });
      toast.success("Account deactivated successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Failed to deactivate account");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    fetchProfile,
    updateAccountInfo,
    changePassword,
    deactivateAccount
  };
};
