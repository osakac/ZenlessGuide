import type { Metadata } from "next";

import { TierListPage } from "@/views/tierlist";

export const metadata: Metadata = {
  title: "Тир-лист агентов",
  description:
    "Тир-лист агентов Zenless Zone Zero с фильтрами по атрибуту, специализации и рангу.",
};

export default function Page() {
  return <TierListPage />;
}
