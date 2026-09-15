"use client";

import { useMemo } from "react";

import type { Team } from "@/entities/team";
import {
  applyTeamFilters,
  TeamFilters,
  useTeamFilters,
} from "@/features/filter-teams";
import { TeamGrid } from "@/widgets/team-grid";

type TeamsContentProps = {
  teams: Team[];
};

export function TeamsContent({ teams }: TeamsContentProps) {
  const { state, setState, reset } = useTeamFilters();

  const visible = useMemo(() => applyTeamFilters(teams, state), [teams, state]);

  return (
    <>
      <TeamFilters state={state} onChange={setState} onReset={reset} />

      <p className="text-sm text-muted-foreground">
        Найдено: {visible.length} из {teams.length}
      </p>

      <TeamGrid
        teams={visible}
        emptyMessage="Составы не найдены. Попробуйте изменить фильтры."
      />
    </>
  );
}
