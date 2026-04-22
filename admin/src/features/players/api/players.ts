import { apiFetch } from "@/lib/api";

export async function fetchPlayerDetails(id: string | number) {
  return apiFetch(`/admin/users/${id}`);
}

export async function updatePlayer(id: string | number, data: any) {
  return apiFetch(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updatePlayerStatus(id: string | number, statusId: number) {
  return apiFetch(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status_id: statusId }),
  });
}

export async function deletePlayer(id: string | number) {
  return apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
