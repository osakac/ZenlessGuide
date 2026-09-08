import { Suspense } from "react";

import { getAllCharacters, getCharacterFilterOptions } from "@/shared/api";
import { Skeleton } from "@/shared/ui/skeleton";

import { CharacterListContent } from "./character-list-content";

export async function CharacterListPage() {
  const [characters, options] = await Promise.all([
    getAllCharacters(),
    getCharacterFilterOptions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Агенты</h1>
        <p className="text-muted-foreground">
          Все агенты с их атрибутом и специализацией.
        </p>
      </div>

      {/* Фильтры читают query-параметры, поэтому клиентская часть
          отделена границей Suspense — страница остаётся статической. */}
      <Suspense fallback={<Skeleton className="h-16 w-full" />}>
        <CharacterListContent characters={characters} options={options} />
      </Suspense>
    </div>
  );
}
