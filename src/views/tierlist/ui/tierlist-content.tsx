"use client";

import { useMemo } from "react";

import type { TierGroup } from "@/entities/tier";
import {
  CharacterFilters,
  matchesCharacterFilters,
  useCharacterFilters,
  type CharacterFilterOptions,
} from "@/features/filter-characters";
import { TierBoard } from "@/widgets/tier-board";

type TierListContentProps = {
  groups: TierGroup[];
  options: CharacterFilterOptions;
};

export function TierListContent({ groups, options }: TierListContentProps) {
  const { state, setState, reset } = useCharacterFilters();

  const visibleGroups = useMemo(() => {
    const matches = matchesCharacterFilters(state);

    return groups.map((group) => ({
      ...group,
      // Фильтры работают по персонажу, но запись тир-листа несёт ещё и роль,
      // поэтому фильтруем записи, а не вынутых из них персонажей.
      entries: group.entries.filter((entry) => matches(entry.character)),
    }));
  }, [groups, state]);

  return (
    <>
      <CharacterFilters
        options={options}
        state={state}
        onChange={setState}
        onReset={reset}
      />

      <TierBoard groups={visibleGroups} />
    </>
  );
}
