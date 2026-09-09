import type { Metadata } from "next";

import { TeamsPage } from "@/views/teams";

export const metadata: Metadata = {
  title: "Команды",
  description:
    "Все составы команд Zenless Zone Zero из гайдов по агентам в одном списке.",
};

export default function Page() {
  return <TeamsPage />;
}
