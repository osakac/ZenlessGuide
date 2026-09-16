"use client";

import { X } from "lucide-react";

import type { TeamDamageType } from "@/entities/team";
import { filterLabels, getTierRoleLabel } from "@/shared/config";
import { cn, getRoleToggleStyle, renderRoleIcon } from "@/shared/lib";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

import { isFilterActive } from "../lib/apply-filters";
import type { TeamFilterState } from "../model/types";

type TeamFiltersProps = {
  state: TeamFilterState;
  onChange: (next: Partial<TeamFilterState>) => void;
  onReset: () => void;
};

const ALL = "__all__";

const damageTypes: TeamDamageType[] = ["pure-dps", "anomaly-dps"];

export function TeamFilters({ state, onChange, onReset }: TeamFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-56 flex-1 flex-col gap-1.5">
          <label
            htmlFor="team-agent-search"
            className="text-xs font-medium text-muted-foreground"
          >
            {filterLabels.search}
          </label>
          <Input
            id="team-agent-search"
            value={state.agentName}
            placeholder="Например, Мияби"
            onChange={(event) => onChange({ agentName: event.target.value })}
          />
        </div>

        {isFilterActive(state) ? (
          <Button variant="ghost" onClick={onReset}>
            <X />
            {filterLabels.reset}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {filterLabels.damageType}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          value={state.damageType ?? ALL}
          onValueChange={(value) =>
            onChange({
              damageType: !value || value === ALL ? null : (value as TeamDamageType),
            })
          }
          aria-label={filterLabels.damageType}
          className="flex-wrap"
        >
          <ToggleGroupItem
            value={ALL}
            aria-label={filterLabels.all}
            title={filterLabels.all}
          >
            <span className="flex size-6 translate-y-0.5 items-center justify-center text-xl font-semibold leading-none">
              *
            </span>
          </ToggleGroupItem>
          {damageTypes.map((value) => {
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
        </ToggleGroup>
      </div>
    </div>
  );
}
