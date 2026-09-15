"use client";

import { X } from "lucide-react";

import type { TeamDamageType } from "@/entities/team";
import { filterLabels, getTierRoleLabel } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

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
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-56 flex-1 flex-col gap-1.5">
        <label
          htmlFor="team-agent-search"
          className="text-xs font-medium text-muted-foreground"
        >
          {filterLabels.agent}
        </label>
        <Input
          id="team-agent-search"
          value={state.agentName}
          placeholder="Например, Мияби"
          onChange={(event) => onChange({ agentName: event.target.value })}
        />
      </div>

      <div className="flex min-w-40 flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {filterLabels.damageType}
        </span>
        <Select
          value={state.damageType ?? ALL}
          onValueChange={(value) =>
            onChange({
              damageType: value === ALL ? null : (value as TeamDamageType),
            })
          }
        >
          <SelectTrigger aria-label={filterLabels.damageType}>
            <SelectValue placeholder={filterLabels.all} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{filterLabels.all}</SelectItem>
            {damageTypes.map((value) => (
              <SelectItem key={value} value={value}>
                {getTierRoleLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFilterActive(state) ? (
        <Button variant="ghost" onClick={onReset}>
          <X />
          {filterLabels.reset}
        </Button>
      ) : null}
    </div>
  );
}
