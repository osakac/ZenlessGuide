import { Suspense } from "react";

import { getCharacterFilterOptions, getTierBoard } from "@/shared/api";
import { Skeleton } from "@/shared/ui/skeleton";

import { TierListContent } from "./tierlist-content";

export async function TierListPage() {
  const [board, options] = await Promise.all([
    getTierBoard(),
    getCharacterFilterOptions(),
  ]);

  const groups = board.groups.map((group) => ({
    tier: group.tier,
    entries: group.entries,
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Тир-лист</h1>

      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <TierListContent groups={groups} options={options} />
      </Suspense>
    </div>
  );
}
