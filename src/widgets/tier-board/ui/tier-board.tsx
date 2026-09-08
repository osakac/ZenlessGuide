import { CharacterTile, type Character } from "@/entities/character";
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
 * Порядок колонок задан явно: он отражает вклад в урон
 * и не должен зависеть от порядка записей в данных.
 */
const roleOrder: TierRole[] = ["pure-dps", "anomaly-dps", "support"];

/**
 * Ширина колонки тира вынесена в константу: её держат вместе шапка и строки,
 * иначе подписи колонок разъедутся с содержимым.
 */
const gridTemplate = "lg:grid lg:grid-cols-[7rem_repeat(3,minmax(0,1fr))]";

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
    <div className="flex flex-col gap-3">
      {/* Шапка колонок нужна только там, где строка действительно
          раскладывается в три колонки. */}
      <div className={`${gridTemplate} hidden gap-3`}>
        <span aria-hidden />
        {roleOrder.map((role) => (
          <h2
            key={role}
            className="rounded-lg border bg-card px-3 py-2 text-center text-sm font-semibold tracking-wide"
          >
            {getTierRoleLabel(role)}
          </h2>
        ))}
      </div>

      {groups.map(({ tier, entries }) => (
        <section
          key={tier.id}
          className={`${gridTemplate} overflow-hidden rounded-xl border bg-card/50 lg:gap-3 lg:p-3`}
        >
          <div className="flex items-center gap-3 border-b bg-card/60 p-3 lg:flex-col lg:items-start lg:gap-2 lg:border-b-0 lg:bg-transparent lg:p-0">
            <TierBadge tierId={tier.id} label={tier.label} size="lg" />
            {tier.description ? (
              <p className="text-xs leading-snug text-muted-foreground">
                {tier.description}
              </p>
            ) : null}
          </div>

          {roleOrder.map((role) => {
            const inRole = entries.filter((entry) => entry.role === role);

            return (
              <div
                key={role}
                className="flex flex-col gap-2 p-3 lg:rounded-lg lg:bg-background/40 lg:p-2"
              >
                {/* На узких экранах колонок нет, поэтому роль подписывается
                    у каждой группы — иначе непонятно, что за агенты. */}
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase lg:hidden">
                  {getTierRoleLabel(role)}
                </h3>

                {inRole.length === 0 ? (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    —
                  </p>
                ) : (
                  <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4">
                    {inRole.map(({ character }) => (
                      <li key={character.id} className="flex">
                        <CharacterTile character={character} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
