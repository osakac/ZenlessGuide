"use client";

import Image from "next/image";
import { X } from "lucide-react";

import {
  filterLabels,
  getAttributeIcon,
  getAttributeLabel,
  getSpecialtyIcon,
  getSpecialtyLabel,
} from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

import { isFilterActive } from "../lib/apply-filters";
import type { CharacterFilterState } from "../model/types";

export type CharacterFilterOptions = {
  attributes: string[];
  specialties: string[];
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
  return (
    <div className="flex flex-col gap-3">
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

        {isFilterActive(state) ? (
          <Button variant="ghost" onClick={onReset}>
            <X />
            {filterLabels.reset}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {filterLabels.specialty}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          value={state.specialty ?? ALL}
          onValueChange={(value) =>
            onChange({ specialty: !value || value === ALL ? null : value })
          }
          aria-label={filterLabels.specialty}
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
          {options.specialties.map((value) => {
            const icon = getSpecialtyIcon(value);
            const label = getSpecialtyLabel(value);

            return (
              <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
                {icon ? (
                  <Image
                    src={icon}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className="size-6 object-contain"
                  />
                ) : (
                  label
                )}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {filterLabels.attribute}
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          size="lg"
          value={state.attribute ?? ALL}
          onValueChange={(value) =>
            onChange({ attribute: !value || value === ALL ? null : value })
          }
          aria-label={filterLabels.attribute}
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
          {options.attributes.map((value) => {
            const icon = getAttributeIcon(value);
            const label = getAttributeLabel(value);

            return (
              <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
                {icon ? (
                  <Image
                    src={icon}
                    alt=""
                    width={24}
                    height={24}
                    unoptimized
                    className="size-6 object-contain"
                  />
                ) : (
                  label
                )}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>
    </div>
  );
}
