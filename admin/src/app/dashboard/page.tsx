"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Overview from "@/components/dashboard/Overview";
import UserManagement from "@/components/dashboard/UserManagement";
import Settings from "@/features/settings/components/Settings";

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "overview";

  switch (activeView) {
    case "overview":
      return <Overview />;
    case "users":
      return <UserManagement />;
    case "settings":
      return <Settings />;
    default:
      return <Overview />;
  }
}

export default function MasterDashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
