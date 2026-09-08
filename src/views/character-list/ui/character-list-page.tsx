import { Suspense } from "react";

import {
  getAllCharacters,
  getCharacterFilterOptions,
  getTiersByCharacterId,
} from "@/shared/api";
import { Skeleton } from "@/shared/ui/skeleton";

import { CharacterListContent } from "./character-list-content";

export async function CharacterListPage() {
  const [characters, options, tiers] = await Promise.all([
    getAllCharacters(),
    getCharacterFilterOptions(),
    getTiersByCharacterId(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Персонажи</h1>
        <p className="text-muted-foreground">
          Все персонажи с их стихией, специализацией и местом в тир-листе.
        </p>
      </div>

      {/* Фильтры читают query-параметры, поэтому клиентская часть
          отделена границей Suspense — страница остаётся статической. */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <CharacterListContent
          characters={characters}
          tiers={tiers}
          options={options}
        />
      </Suspense>
    </div>
  );
}
