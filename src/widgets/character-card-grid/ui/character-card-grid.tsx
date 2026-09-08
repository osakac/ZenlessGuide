import { CharacterCard, type Character } from "@/entities/character";
import { TierBadge, type Tier } from "@/entities/tier";

type CharacterCardGridProps = {
  characters: Character[];
  /** Тир по id персонажа — если известен, показывается на карточке. */
  tiers?: Record<string, Tier>;
  emptyMessage?: string;
};

export function CharacterCardGrid({
  characters,
  tiers,
  emptyMessage = "Никто не подошёл под выбранные фильтры.",
}: CharacterCardGridProps) {
  if (characters.length === 0) {
    return (
      <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {characters.map((character) => {
        const tier = tiers?.[character.id];

        return (
          <li key={character.id} className="flex">
            <CharacterCard
              character={character}
              className="w-full"
              badge={
                tier ? <TierBadge tierId={tier.id} label={tier.label} /> : null
              }
            />
          </li>
        );
      })}
    </ul>
  );
}
