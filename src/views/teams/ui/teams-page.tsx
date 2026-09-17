import { getAllTeams } from "@/shared/api";

import { TeamsContent } from "./teams-content";

export async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Команды</h1>

      <TeamsContent teams={teams} />
    </div>
  );
}
