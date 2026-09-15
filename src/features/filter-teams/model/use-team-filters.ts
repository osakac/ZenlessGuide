"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { TeamDamageType } from "@/entities/team";

import { emptyFilterState, type TeamFilterState } from "./types";

/**
 * Состояние фильтров держится в query-параметрах: ссылку с выбранными
 * фильтрами можно скопировать и переслать, а кнопка «назад» работает штатно.
 */
export function useTeamFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useMemo<TeamFilterState>(
    () => ({
      agentName: searchParams.get("agent") ?? "",
      damageType: searchParams.get("damageType") as TeamDamageType | null,
    }),
    [searchParams],
  );

  const setState = useCallback(
    (next: Partial<TeamFilterState>) => {
      const merged = { ...state, ...next };
      const params = new URLSearchParams();

      if (merged.agentName.trim()) params.set("agent", merged.agentName.trim());
      if (merged.damageType) params.set("damageType", merged.damageType);

      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router, state],
  );

  const reset = useCallback(() => {
    router.replace("?", { scroll: false });
  }, [router]);

  return { state, setState, reset, emptyFilterState };
}
