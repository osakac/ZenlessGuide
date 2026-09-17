import { getTeamKey, TeamCard, type Team } from "@/entities/team";
import { EmptyState } from "@/shared/ui/empty-state";

type TeamGridProps = {
  teams: Team[];
  emptyMessage?: string;
};

export function TeamGrid({
  teams,
  emptyMessage = "Составов пока нет.",
}: TeamGridProps) {
  if (teams.length === 0) return <EmptyState>{emptyMessage}</EmptyState>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <li key={getTeamKey(team)}>
          <TeamCard team={team} from="teams" badgeInset="sm" />
        </li>
      ))}
    </ul>
  );
}
