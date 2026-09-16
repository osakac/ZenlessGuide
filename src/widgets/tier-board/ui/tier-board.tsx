import { CharacterTile } from '@/entities/character'
import { TierBadge, type TierGroup, type TierRole } from '@/entities/tier'
import { getTierRoleLabel } from '@/shared/config'
import { cn, getRoleTextColor, renderRoleIcon } from '@/shared/lib'
import { EmptyState } from '@/shared/ui/empty-state'

type TierBoardProps = {
  groups: TierGroup[]
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

/** Иконка и подпись роли в её цвете — у шапки колонки и у группы на узком экране. */
function RoleLabel({ role, iconClassName }: { role: TierRole; iconClassName: string }) {
  return (
    <>
      {renderRoleIcon(role, iconClassName)}
      {getTierRoleLabel(role)}
    </>
  )
}

export function TierBoard({
  groups,
  emptyMessage = 'Под выбранные фильтры никто не подошёл.',
}: TierBoardProps) {
  if (groups.every((group) => group.entries.length === 0)) {
    return <EmptyState>{emptyMessage}</EmptyState>
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Шапка колонок нужна только там, где строка действительно
          раскладывается в три колонки. У секции тира нет горизонтального
          отступа перед сеткой колонок, поэтому и здесь его нет — иначе
          сетки разойдутся по ширине. */}
      <div className={cn(gridTemplate, 'hidden gap-3')}>
        {roleOrder.map((role) => (
          <h2
            key={role}
            className={cn(
              'flex items-center justify-center gap-2 rounded-lg border bg-card px-3 py-2 text-center text-sm font-semibold tracking-wide',
              getRoleTextColor(role),
            )}
          >
            <RoleLabel role={role} iconClassName="size-4" />
          </h2>
        ))}
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

          <div className={cn(gridTemplate, 'gap-3')}>
            {roleOrder.map((role) => {
              const inRole = entries.filter((entry) => entry.role === role)

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
                      getRoleTextColor(role),
                    )}
                  >
                    <RoleLabel role={role} iconClassName="size-3.5" />
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
