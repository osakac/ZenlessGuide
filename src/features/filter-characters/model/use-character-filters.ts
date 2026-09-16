"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { emptyFilterState, type CharacterFilterState } from "./types";

/**
 * Состояние фильтров держится в query-параметрах: ссылку с выбранными
 * фильтрами можно скопировать и переслать, а кнопка «назад» работает штатно.
 */
export function useCharacterFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const state = useMemo<CharacterFilterState>(
    () => ({
      search: searchParams.get("q") ?? "",
      attribute: searchParams.get("attribute"),
      specialty: searchParams.get("specialty"),
    }),
    [searchParams],
  );

  const setState = useCallback(
    (next: Partial<CharacterFilterState>) => {
      const merged = { ...state, ...next };
      const params = new URLSearchParams();

      if (merged.search.trim()) params.set("q", merged.search.trim());
      if (merged.attribute) params.set("attribute", merged.attribute);
      if (merged.specialty) params.set("specialty", merged.specialty);

      const query = params.toString();
      router.replace(query ? `?${query}` : "?", { scroll: false });
    },
    [router, state],
  );

  const reset = useCallback(() => {
    router.replace("?", { scroll: false });
  }, [router]);

  return { state, setState, reset, emptyFilterState };
}
