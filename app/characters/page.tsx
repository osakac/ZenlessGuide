import type { Metadata } from "next";

import { CharacterListPage } from "@/views/character-list";

export const metadata: Metadata = {
  title: "Агенты",
  description:
    "Все агенты Zenless Zone Zero: атрибут, специализация, ранг и место в тир-листе.",
};

export default function Page() {
  return <CharacterListPage />;
}
