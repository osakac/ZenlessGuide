"use client";

import {
  filterLabels,
  getTierRoleLabel,
  isTeamDamageType,
  teamDamageTypes,
} from "@/shared/config";
import { cn, getRoleToggleStyle, renderRoleIcon } from "@/shared/lib";
import { FilterSearch, FilterToggleGroup } from "@/shared/ui/filter-controls";
import { ToggleGroupItem } from "@/shared/ui/toggle-group";

import { isFilterActive } from "../lib/apply-filters";
import type { TeamFilterState } from "../model/types";

type TeamFiltersProps = {
  state: TeamFilterState;
  onChange: (next: Partial<TeamFilterState>) => void;
  onReset: () => void;
};

export function TeamFilters({ state, onChange, onReset }: TeamFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterSearch
        id="team-agent-search"
        value={state.agentName}
        onChange={(agentName) => onChange({ agentName })}
        showReset={isFilterActive(state)}
        onReset={onReset}
      />

      <FilterToggleGroup
        label={filterLabels.damageType}
        value={state.damageType}
        onChange={(value) =>
          onChange({ damageType: isTeamDamageType(value) ? value : null })
        }
      >
        {teamDamageTypes.map((value) => {
          const label = getTierRoleLabel(value);

          return (
            <ToggleGroupItem
              key={value}
              value={value}
              aria-label={label}
              title={label}
              className={cn("gap-2", getRoleToggleStyle(value))}
            >
              {renderRoleIcon(value, "size-4")}
              {label}
            </ToggleGroupItem>
          );
        })}
      </FilterToggleGroup>
    </div>
  );
}
