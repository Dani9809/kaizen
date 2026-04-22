"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Overview from "@/components/dashboard/Overview";
import UserManagement from "@/components/dashboard/UserManagement";
import Settings from "@/features/settings/components/Settings";
import GroupManagement from "@/features/groups/components/GroupManagement";
import GroupDetails from "@/features/groups/components/GroupDetails";
import GameOverview from "@/features/gamification/components/GameOverview";
import GameManagement from "@/features/gamification/components/GameManagement";

function DashboardContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "overview";

  if (view.startsWith("squads")) {
    const parts = view.split("/id=");
    if (parts.length > 1) {
      return <GroupDetails id={parts[1]} />;
    }
    return <GroupManagement />;
  }

  if (view === "game") {
    return <GameOverview />;
  }

  if (view.startsWith("game/")) {
    const entity = view.replace("game/", "");
    return <GameManagement entity={entity} />;
  }

  switch (view) {
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
