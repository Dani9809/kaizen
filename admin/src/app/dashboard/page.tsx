"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Overview from "@/components/dashboard/Overview";
import UserManagement from "@/components/dashboard/UserManagement";

function DashboardContent() {
  const searchParams = useSearchParams();
  const activeView = searchParams.get("view") || "overview";

  switch (activeView) {
    case "overview":
      return <Overview />;
    case "users":
      return <UserManagement />;
    case "settings":
      return (
        <div className="flex flex-col items-center justify-center h-full text-foreground/40">
          <p className="font-heading font-bold text-xl">Settings View coming soon...</p>
        </div>
      );
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
