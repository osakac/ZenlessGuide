import type { Metadata } from "next";

import { TierListPage } from "@/views/tierlist";

export const metadata: Metadata = {
  title: "Тир-лист персонажей",
  description:
    "Тир-лист персонажей Zenless Zone Zero с фильтрами по стихии, специализации и рангу.",
};

export default function Page() {
  return <TierListPage />;
}
