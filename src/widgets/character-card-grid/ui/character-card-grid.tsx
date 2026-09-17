import { CharacterCard, type CharacterSummary } from "@/entities/character";
import { EmptyState } from "@/shared/ui/empty-state";

/**
 * Сколько карточек грузить сразу — первый ряд самой широкой сетки. На узких
 * экранах пара лишних ранних загрузок дешевле, чем поздний LCP на широких.
 */
const EAGER_CARDS = 5;

type CharacterCardGridProps = {
  characters: CharacterSummary[];
  emptyMessage?: string;
};

export function CharacterCardGrid({
  characters,
  emptyMessage = "Никто не подошёл под выбранные фильтры.",
}: CharacterCardGridProps) {
  if (characters.length === 0) return <EmptyState>{emptyMessage}</EmptyState>;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {characters.map((character, index) => (
        <li key={character.id} className="flex">
          <CharacterCard
            character={character}
            className="w-full"
            specialtyDisplay="icon"
            eager={index < EAGER_CARDS}
          />
        </li>
      ))}
    </ul>
  );
}
