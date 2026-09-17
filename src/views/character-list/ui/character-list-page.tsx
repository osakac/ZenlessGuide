import { getCharacterSummaries, getCharacterFilterOptions } from "@/shared/api";

import { CharacterListContent } from "./character-list-content";

export async function CharacterListPage() {
  const [characters, options] = await Promise.all([
    getCharacterSummaries(),
    getCharacterFilterOptions(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Агенты</h1>

      <CharacterListContent characters={characters} options={options} />
    </div>
  );
}
