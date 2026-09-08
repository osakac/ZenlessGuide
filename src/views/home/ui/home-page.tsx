import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CharacterCard } from "@/entities/character";
import { TierBadge } from "@/entities/tier";
import { getTierBoard } from "@/shared/api";
import { routes } from "@/shared/config";

export async function HomePage() {
  const board = await getTierBoard();
  const topTier = board.groups[0];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12">
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          Гайды и тир-лист <span className="text-primary">Zenless Zone Zero</span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Разбираемся, кого качать и как собирать. Тир-лист показывает
          расстановку сил, страницы персонажей — оружие, дисководы, приоритет
          статов и рабочие команды.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href={routes.tierlist}
          className="group flex flex-col gap-2 rounded-xl border bg-card p-6 transition-colors hover:border-primary/60"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Тир-лист
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Персонажи по тирам с фильтрами по стихии, специализации и рангу.
          </p>
        </Link>

        <Link
          href={routes.characters}
          className="group flex flex-col gap-2 rounded-xl border bg-card p-6 transition-colors hover:border-primary/60"
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            Персонажи
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </h2>
          <p className="text-sm text-muted-foreground">
            Полный список с переходом на подробный гайд по каждому.
          </p>
        </Link>
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
            {topTier.entries.map(({ character }) => (
              <li key={character.id} className="flex">
                <CharacterCard character={character} className="w-full" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
