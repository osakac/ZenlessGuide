"use client";

import { X } from "lucide-react";

import {
  filterLabels,
  getAttributeLabel,
  getSpecialtyLabel,
} from "@/shared/config";
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
import type { CharacterFilterState } from "../model/types";

export type CharacterFilterOptions = {
  attributes: string[];
  specialties: string[];
  rarities: string[];
};

type CharacterFiltersProps = {
  options: CharacterFilterOptions;
  state: CharacterFilterState;
  onChange: (next: Partial<CharacterFilterState>) => void;
  onReset: () => void;
};

const ALL = "__all__";

export function CharacterFilters({
  options,
  state,
  onChange,
  onReset,
}: CharacterFiltersProps) {
  const selects = [
    {
      key: "attribute" as const,
      label: filterLabels.attribute,
      values: options.attributes,
      format: getAttributeLabel,
    },
    {
      key: "specialty" as const,
      label: filterLabels.specialty,
      values: options.specialties,
      format: getSpecialtyLabel,
    },
    {
      key: "rarity" as const,
      label: filterLabels.rarity,
      values: options.rarities,
      format: (value: string) => value,
    },
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-56 flex-1 flex-col gap-1.5">
        <label
          htmlFor="character-search"
          className="text-xs font-medium text-muted-foreground"
        >
          {filterLabels.search}
        </label>
        <Input
          id="character-search"
          value={state.search}
          placeholder="Например, Мияби"
          onChange={(event) => onChange({ search: event.target.value })}
        />
      </div>

      {selects.map(({ key, label, values, format }) => (
        <div key={key} className="flex min-w-40 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <Select
            value={state[key] ?? ALL}
            onValueChange={(value) =>
              onChange({ [key]: value === ALL ? null : value })
            }
          >
            <SelectTrigger aria-label={label}>
              <SelectValue placeholder={filterLabels.all} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{filterLabels.all}</SelectItem>
              {values.map((value) => (
                <SelectItem key={value} value={value}>
                  {format(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      {isFilterActive(state) ? (
        <Button variant="ghost" onClick={onReset}>
          <X />
          {filterLabels.reset}
        </Button>
      ) : null}
    </div>
  );
}
