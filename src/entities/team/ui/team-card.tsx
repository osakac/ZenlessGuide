import Link from 'next/link'

import { Portrait } from '@/shared/ui/portrait'
import { routes, getTierRoleLabel, type BackSource } from '@/shared/config'
import { cn, getRoleBadgeStyle, renderRoleIcon } from '@/shared/lib'

import type { Team, TeamDamageType, TeamMember } from '../model/types'

type TeamCardProps = {
  team: Team
  /**
   * Агент, на чьей странице показан состав: он же не ссылается сам на себя.
   * В общем списке команд текущего агента нет, и ссылками становятся все трое.
   */
  currentCharacterId?: string
  /** Откуда переход: страница агента вернёт по кнопке «назад» туда же. */
  from?: BackSource
}

function MemberPortrait({
  member,
  isCurrent,
}: {
  member: TeamMember
  isCurrent: boolean
}) {
  return (
    <>
      <Portrait
        src={member.image}
        alt={member.name}
        sizes="(max-width: 640px) 28vw, 120px"
        className={cn(
          'aspect-4/5 w-full rounded-xl shadow-sm',
          isCurrent
            ? 'border-2 border-primary shadow-primary/20'
            : 'border border-border/60 transition-all duration-200 group-hover:border-primary/60 group-hover:shadow-md',
        )}
      />
      <span
        className={cn(
          'truncate text-center text-[13px]',
          isCurrent
            ? 'font-medium text-primary'
            : 'text-muted-foreground transition-colors group-hover:text-primary',
        )}
      >
        {member.name}
      </span>
    </>
  )
}

function DamageTypeBadge({ damageType }: { damageType: TeamDamageType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        getRoleBadgeStyle(damageType),
      )}
    >
      {renderRoleIcon(damageType, 'size-3')}
      {getTierRoleLabel(damageType)}
    </span>
  )
}

export function TeamCard({ team, currentCharacterId, from }: TeamCardProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col gap-3 rounded-xl border border-border/60 bg-card px-3 py-2',
        'shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg',
      )}
    >
      {team.damageType ? (
        <div className="flex justify-start">
          <DamageTypeBadge damageType={team.damageType} />
        </div>
      ) : null}

      <ul className="grid grid-cols-3 gap-2.5">
        {team.members.map((member) => {
          const isCurrent = member.id === currentCharacterId

          return (
            <li key={member.id} className="min-w-0">
              {isCurrent ? (
                <div className="flex flex-col gap-1.5">
                  <MemberPortrait member={member} isCurrent />
                </div>
              ) : (
                <Link
                  href={routes.character(member.slug, from)}
                  className={cn(
                    'group flex flex-col gap-1.5 rounded-xl',
                    'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  )}
                >
                  <MemberPortrait member={member} isCurrent={false} />
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
