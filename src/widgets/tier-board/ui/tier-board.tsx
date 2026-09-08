import { CharacterCard, type Character } from "@/entities/character";
import { TierBadge, type Tier, type TierRole } from "@/entities/tier";
import { getTierRoleLabel } from "@/shared/config";

export type TierBoardEntry = {
  character: Character;
  role: TierRole;
  note?: string;
};

export type TierBoardGroup = {
  tier: Tier;
  entries: TierBoardEntry[];
};

type TierBoardProps = {
  groups: TierBoardGroup[];
  emptyMessage?: string;
};

/**
 * Порядок ролей внутри тира задан явно: он отражает вклад в урон
 * и не должен зависеть от порядка записей в данных.
 */
const roleOrder: TierRole[] = ["dps", "sub-dps", "support"];

export function TierBoard({
  groups,
  emptyMessage = "Под выбранные фильтры никто не подошёл.",
}: TierBoardProps) {
  const isEmpty = groups.every((group) => group.entries.length === 0);

  if (isEmpty) {
    return (
      <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ tier, entries }) => (
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

          {entries.length === 0 ? (
            <p className="flex-1 self-center text-sm text-muted-foreground">
              В этом тире никого нет.
            </p>
          ) : (
            <div className="flex flex-1 flex-col gap-5">
              {roleOrder.map((role) => {
                const inRole = entries.filter((entry) => entry.role === role);

                if (inRole.length === 0) return null;

                return (
                  <div key={role} className="flex flex-col gap-2">
                    <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {getTierRoleLabel(role)}
                    </h3>
                    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {inRole.map(({ character }) => (
                        <li key={character.id} className="flex">
                          <CharacterCard
                            character={character}
                            className="w-full"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
