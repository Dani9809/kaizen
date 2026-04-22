"use client";

const getApiHost = () => {
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return "http://localhost:3000";
};

export const API_HOST = getApiHost();

interface FetchOptions extends RequestInit {
  token?: string;
}

export const apiFetch = async (endpoint: string, options: FetchOptions = {}) => {
  const token = options.token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_HOST}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json();
};
