"use client";

import { useMemo } from "react";

import { isTeamDamageType } from "@/shared/config";
import { useQueryState } from "@/shared/lib/use-query-state";

import type { TeamFilterState } from "./types";

const queryKeys = { agentName: "agent", damageType: "damageType" } as const;

export function useTeamFilters() {
  const { values, set, reset } = useQueryState(queryKeys);

  const state = useMemo<TeamFilterState>(
    () => ({
      agentName: values.agentName ?? "",
      // Параметр приходит из URL как есть: неизвестный тип урона не должен
      // превращаться в фильтр, под который не подходит ни один состав.
      damageType: isTeamDamageType(values.damageType) ? values.damageType : null,
    }),
    [values],
  );

  return { state, setState: set, reset };
}
