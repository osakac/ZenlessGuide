import Link from "next/link";

import { CharacterPortrait } from "@/entities/character";
import { routes } from "@/shared/config";
import type { Team, TeamMember } from "@/shared/api";
import { cn } from "@/shared/lib";

type TeamCardProps = {
  team: Team;
  /** Агент, на чьей странице показан состав: он же не ссылается сам на себя. */
  currentCharacterId: string;
};

function MemberPortrait({ member }: { member: TeamMember }) {
  return (
    <CharacterPortrait
      src={member.image}
      name={member.name}
      sizes="(max-width: 640px) 28vw, 120px"
      className="aspect-4/5 w-full rounded-lg border transition-colors group-hover:border-primary/60"
    />
  );
}

export function TeamCard({ team, currentCharacterId }: TeamCardProps) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="font-medium">{team.name}</p>

      <ul className="mt-2.5 grid grid-cols-3 gap-2">
        {team.members.map((member) => {
          const isCurrent = member.id === currentCharacterId;

          return (
            <li key={member.id} className="min-w-0">
              {isCurrent ? (
                <div className="flex flex-col gap-1">
                  <CharacterPortrait
                    src={member.image}
                    name={member.name}
                    sizes="(max-width: 640px) 28vw, 120px"
                    className="aspect-4/5 w-full rounded-lg border-2 border-primary"
                  />
                  <span className="truncate text-center text-xs font-medium text-primary">
                    {member.name}
                  </span>
                </div>
              ) : (
                <Link
                  href={routes.character(member.slug)}
                  className={cn(
                    "group flex flex-col gap-1 rounded-lg",
                    "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  )}
                >
                  <MemberPortrait member={member} />
                  <span className="truncate text-center text-xs text-muted-foreground group-hover:text-primary">
                    {member.name}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {team.note ? (
        <p className="mt-2.5 text-sm text-muted-foreground">{team.note}</p>
      ) : null}
    </div>
  );
}
