"use client";

import Image from "next/image";

import type { FilterOptions } from "@/shared/api";
import {
  filterLabels,
  getAttributeIcon,
  getAttributeLabel,
  getSpecialtyIcon,
  getSpecialtyLabel,
} from "@/shared/config";
import { FilterSearch, FilterToggleGroup } from "@/shared/ui/filter-controls";
import { ToggleGroupItem } from "@/shared/ui/toggle-group";

import { isFilterActive } from "../lib/apply-filters";
import type { CharacterFilterState } from "../model/types";

export type CharacterFilterOptions = FilterOptions;

type CharacterFiltersProps = {
  options: CharacterFilterOptions;
  state: CharacterFilterState;
  onChange: (next: Partial<CharacterFilterState>) => void;
  onReset: () => void;
};

/** Пункт фильтра с иконкой; если иконки для ключа нет — с подписью. */
function IconOption({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: string | undefined;
}) {
  return (
    <ToggleGroupItem value={value} aria-label={label} title={label}>
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
}

export function CharacterFilters({
  options,
  state,
  onChange,
  onReset,
}: CharacterFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <FilterSearch
        id="character-search"
        value={state.search}
        onChange={(search) => onChange({ search })}
        showReset={isFilterActive(state)}
        onReset={onReset}
      />

      <FilterToggleGroup
        label={filterLabels.specialty}
        value={state.specialty}
        onChange={(specialty) => onChange({ specialty })}
      >
        {options.specialties.map((value) => (
          <IconOption
            key={value}
            value={value}
            label={getSpecialtyLabel(value)}
            icon={getSpecialtyIcon(value)}
          />
        ))}
      </FilterToggleGroup>

      <FilterToggleGroup
        label={filterLabels.attribute}
        value={state.attribute}
        onChange={(attribute) => onChange({ attribute })}
      >
        {options.attributes.map((value) => (
          <IconOption
            key={value}
            value={value}
            label={getAttributeLabel(value)}
            icon={getAttributeIcon(value)}
          />
        ))}
      </FilterToggleGroup>
    </div>
  );
}
