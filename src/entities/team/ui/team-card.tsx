import Link from "next/link";

import { Portrait } from "@/shared/ui/portrait";
import { routes } from "@/shared/config";
import { cn } from "@/shared/lib";

import type { Team, TeamMember } from "../model/types";

type TeamCardProps = {
  team: Team;
  /**
   * Агент, на чьей странице показан состав: он же не ссылается сам на себя.
   * В общем списке команд текущего агента нет, и ссылками становятся все трое.
   */
  currentCharacterId?: string;
};

function MemberPortrait({ member }: { member: TeamMember }) {
  return (
    <Portrait
      src={member.image}
      alt={member.name}
      sizes="(max-width: 640px) 28vw, 120px"
      className="aspect-4/5 w-full rounded-lg border transition-colors group-hover:border-primary/60"
    />
  );
}

export function TeamCard({ team, currentCharacterId }: TeamCardProps) {
  return (
    <div className="h-full rounded-lg border bg-background p-3">
      <ul className="grid grid-cols-3 gap-2">
        {team.members.map((member) => {
          const isCurrent = member.id === currentCharacterId;

          return (
            <li key={member.id} className="min-w-0">
              {isCurrent ? (
                <div className="flex flex-col gap-1">
                  <Portrait
                    src={member.image}
                    alt={member.name}
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
    </div>
  );
}
