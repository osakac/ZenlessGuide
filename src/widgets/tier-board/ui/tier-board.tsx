import { CharacterTile, type Character } from '@/entities/character'
import {
  TierBadge,
  getTierRoleColor,
  getTierRoleIcon,
  type Tier,
  type TierRole,
} from '@/entities/tier'
import { getTierRoleLabel } from '@/shared/config'
import { cn } from '@/shared/lib'

export type TierBoardEntry = {
  character: Character
  role: TierRole
  note?: string
}

export type TierBoardGroup = {
  tier: Tier
  entries: TierBoardEntry[]
}

type TierBoardProps = {
  groups: TierBoardGroup[]
  emptyMessage?: string
}

/**
 * Порядок колонок задан явно: он отражает вклад в урон
 * и не должен зависеть от порядка записей в данных.
 */
const roleOrder: TierRole[] = ['pure-dps', 'anomaly-dps', 'support']

/**
 * Раскладка колонок ролей вынесена в константу: её держат вместе шапка и строки,
 * иначе подписи колонок разъедутся с содержимым.
 */
const gridTemplate = 'lg:grid lg:grid-cols-3'

export function TierBoard({
  groups,
  emptyMessage = 'Под выбранные фильтры никто не подошёл.',
}: TierBoardProps) {
  const isEmpty = groups.every((group) => group.entries.length === 0)

  if (isEmpty) {
    return (
      <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Шапка колонок нужна только там, где строка действительно
          раскладывается в три колонки. У секции тира нет горизонтального
          отступа перед сеткой колонок, поэтому и здесь его нет — иначе
          сетки разойдутся по ширине. */}
      <div className={`${gridTemplate} hidden gap-3`}>
        {roleOrder.map((role) => {
          const RoleIcon = getTierRoleIcon(role)

          return (
            <h2
              key={role}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg border bg-card px-3 py-2 text-center text-sm font-semibold tracking-wide',
                getTierRoleColor(role),
              )}
            >
              {RoleIcon ? <RoleIcon className="size-4" aria-hidden /> : null}
              {getTierRoleLabel(role)}
            </h2>
          )
        })}
      </div>

      {groups.map(({ tier, entries }) => (
        <section key={tier.id} className="overflow-hidden rounded-xl bg-card">
          <div className="flex items-center gap-3 bg-card/60 mb-3 lg:bg-transparent">
            <TierBadge
              tierId={tier.id}
              label={tier.label}
              size="lg"
              className="w-full"
            />
          </div>

          <div className={`${gridTemplate} gap-3`}>
            {roleOrder.map((role) => {
              const inRole = entries.filter((entry) => entry.role === role)
              const RoleIcon = getTierRoleIcon(role)

              return (
                <div
                  key={role}
                  className="flex flex-col gap-2 p-3 lg:rounded-lg lg:bg-background/40 lg:p-2"
                >
                  {/* На узких экранах колонок нет, поэтому роль подписывается
                      у каждой группы — иначе непонятно, что за агенты. */}
                  <h3
                    className={cn(
                      'flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide uppercase lg:hidden',
                      getTierRoleColor(role),
                    )}
                  >
                    {RoleIcon ? (
                      <RoleIcon className="size-3.5" aria-hidden />
                    ) : null}
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
                          <CharacterTile
                            character={character}
                            from="tierlist"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
