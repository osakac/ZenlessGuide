import { getAllTeams } from "@/shared/api";
import { TeamGrid } from "@/widgets/team-grid";

export async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Команды</h1>
        <p className="text-muted-foreground">
          Составы из гайдов по агентам, собранные в один список. Каждый портрет
          ведёт на страницу агента.
        </p>
      </div>

      <TeamGrid teams={teams} />
    </div>
  );
}
