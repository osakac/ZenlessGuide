import type { Metadata } from "next";

import { CharacterListPage } from "@/views/character-list";

export const metadata: Metadata = {
  title: "Персонажи",
  description:
    "Все персонажи Zenless Zone Zero: стихия, специализация, ранг и место в тир-листе.",
};

export default function Page() {
  return <CharacterListPage />;
}
