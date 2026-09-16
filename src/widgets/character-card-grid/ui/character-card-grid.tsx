import { CharacterCard, type Character } from "@/entities/character";
import { EmptyState } from "@/shared/ui/empty-state";

type CharacterCardGridProps = {
  characters: Character[];
  emptyMessage?: string;
};

export function CharacterCardGrid({
  characters,
  emptyMessage = "Никто не подошёл под выбранные фильтры.",
}: CharacterCardGridProps) {
  if (characters.length === 0) return <EmptyState>{emptyMessage}</EmptyState>;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {characters.map((character) => (
        <li key={character.id} className="flex">
          <CharacterCard character={character} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
