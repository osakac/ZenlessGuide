import { CharacterCard, type Character } from "@/entities/character";
import { TierBadge, type Tier } from "@/entities/tier";

export type TierBoardGroup = {
  tier: Tier;
  characters: Character[];
};

type TierBoardProps = {
  groups: TierBoardGroup[];
  emptyMessage?: string;
};

export function TierBoard({
  groups,
  emptyMessage = "Под выбранные фильтры никто не подошёл.",
}: TierBoardProps) {
  const isEmpty = groups.every((group) => group.characters.length === 0);

  if (isEmpty) {
    return (
      <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ tier, characters }) => (
        <section
          key={tier.id}
          className="flex flex-col gap-4 rounded-xl border bg-card/50 p-4 sm:flex-row"
        >
          <div className="flex shrink-0 gap-3 sm:w-56 sm:flex-col">
            <TierBadge tierId={tier.id} label={tier.label} size="lg" />
            {tier.description ? (
              <p className="text-sm text-muted-foreground">
                {tier.description}
              </p>
            ) : null}
          </div>

          {characters.length === 0 ? (
            <p className="flex-1 self-center text-sm text-muted-foreground">
              В этом тире никого нет.
            </p>
          ) : (
            <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {characters.map((character) => (
                <li key={character.id} className="flex">
                  <CharacterCard character={character} className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
