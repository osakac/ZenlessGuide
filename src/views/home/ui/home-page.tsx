import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CharacterCard } from "@/entities/character";
import { TierBadge } from "@/entities/tier";
import { getTierBoard } from "@/shared/api";
import { routes } from "@/shared/config";

/** Разделы сайта: одинаковые карточки, поэтому описаны данными, а не разметкой. */
const sections = [
  {
    href: routes.tierlist,
    title: "Тир-лист",
    text: "Агенты по тирам с фильтрами по атрибуту и специализации.",
  },
  {
    href: routes.characters,
    title: "Агенты",
    text: "Полный список с переходом на подробный гайд по каждому.",
  },
  {
    href: routes.teams,
    title: "Команды",
    text: "Все составы одним списком — кто с кем работает.",
  },
];

export async function HomePage() {
  const [topTier] = await getTierBoard();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Гайды и тир-лист <span className="text-primary">Zenless Zone Zero</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Разбираемся, кого качать и как собирать. Тир-лист показывает
          расстановку сил, страницы агентов — оружие, драйв-диски, приоритет
          статов и рабочие команды.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex flex-col gap-2 rounded-xl border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              {section.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </h2>
            <p className="text-sm text-muted-foreground">{section.text}</p>
          </Link>
        ))}
      </section>

      {topTier && topTier.entries.length > 0 ? (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <TierBadge tierId={topTier.tier.id} label={topTier.tier.label} />
            <h2 className="text-xl font-semibold tracking-tight">
              Верхний тир
            </h2>
            <Link
              href={routes.tierlist}
              className="ml-auto text-sm text-muted-foreground hover:text-primary"
            >
              Весь тир-лист
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {topTier.entries.map(({ character }, index) => (
              <li key={character.id} className="flex">
                <CharacterCard
                  character={character}
                  className="w-full"
                  // Первый ряд сетки из пяти колонок виден без прокрутки.
                  eager={index < 5}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
