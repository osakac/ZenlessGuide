"use client";

import { useMemo } from "react";

import { useQueryState } from "@/shared/lib/use-query-state";

import type { CharacterFilterState } from "./types";

const queryKeys = {
  search: "q",
  attribute: "attribute",
  specialty: "specialty",
} as const;

export function useCharacterFilters() {
  const { values, set, reset } = useQueryState(queryKeys);

  const state = useMemo<CharacterFilterState>(
    () => ({ ...values, search: values.search ?? "" }),
    [values],
  );

  return { state, setState: set, reset };
}
