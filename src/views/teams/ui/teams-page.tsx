import { Suspense } from "react";

import { getAllTeams } from "@/shared/api";
import { Skeleton } from "@/shared/ui/skeleton";

import { TeamsContent } from "./teams-content";

export async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Команды</h1>

      {/* Фильтры читают query-параметры, поэтому клиентская часть
          отделена границей Suspense — страница остаётся статической. */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <TeamsContent teams={teams} />
      </Suspense>
    </div>
  );
}
