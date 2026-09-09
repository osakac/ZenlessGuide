import { TeamCard, type Team } from "@/entities/team";

type TeamGridProps = {
  teams: Team[];
  emptyMessage?: string;
};

export function TeamGrid({
  teams,
  emptyMessage = "Составов пока нет.",
}: TeamGridProps) {
  if (teams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {/* Ключ — набор участников: он уникален по схеме данных,
          и ничего другого в составе нет. */}
      {teams.map((team) => (
        <li key={team.members.map((member) => member.id).join("|")}>
          <TeamCard team={team} />
        </li>
      ))}
    </ul>
  );
}
