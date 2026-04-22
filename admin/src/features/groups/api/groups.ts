import { apiFetch } from "@/lib/api";
import { Group, GroupDetails } from "../types";

export const fetchGroups = async (): Promise<Group[]> => {
  return apiFetch("/admin/groups");
};

export const fetchGroupDetails = async (id: number | string): Promise<GroupDetails> => {
  return apiFetch(`/admin/groups/${id}`);
};

export const createGroup = async (data: any): Promise<Group> => {
  return apiFetch("/admin/groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
