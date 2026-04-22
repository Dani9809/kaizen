"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GroupManagement from "@/features/groups/components/GroupManagement";
import GroupDetails from "@/features/groups/components/GroupDetails";

function GroupsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (id) {
    return <GroupDetails id={id} />;
  }

  return <GroupManagement />;
}

export default function GroupsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GroupsContent />
    </Suspense>
  );
}
