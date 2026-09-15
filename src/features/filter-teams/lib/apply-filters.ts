import type { Team } from "@/entities/team";

import type { TeamFilterState } from "../model/types";

/** Чистая функция фильтрации: используется и в UI, и в тестах. */
export function applyTeamFilters(teams: Team[], state: TeamFilterState): Team[] {
  const search = state.agentName.trim().toLowerCase();

  return teams.filter((team) => {
    if (
      search &&
      !team.members.some((member) => member.name.toLowerCase().includes(search))
    ) {
      return false;
    }

    if (state.damageType && team.damageType !== state.damageType) return false;

    return true;
  });
}

export function isFilterActive(state: TeamFilterState): boolean {
  return Boolean(state.agentName.trim() || state.damageType);
}
