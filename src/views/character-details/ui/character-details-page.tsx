import { Suspense } from "react";
import { notFound } from "next/navigation";

import { AttributeBadge, RarityBadge } from "@/entities/character";
import { TierBadge } from "@/entities/tier";
import {
  getCharacterBySlug,
  getTeamsForCharacter,
  getTierForCharacter,
} from "@/shared/api";
import { getSpecialtyLabel } from "@/shared/config";
import { Portrait } from "@/shared/ui/portrait";
import { CharacterGuide } from "@/widgets/character-guide";

import { BackLink, BackLinkFallback } from "./back-link";

type CharacterDetailsPageProps = {
  slug: string;
};

export async function CharacterDetailsPage({
  slug,
}: CharacterDetailsPageProps) {
  const character = await getCharacterBySlug(slug);

  if (!character) notFound();

  const [tier, teams] = await Promise.all([
    getTierForCharacter(character.id),
    getTeamsForCharacter(character.id),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      {/* Ссылка назад читает query-параметр, поэтому вынесена за границу
          Suspense — страница агента остаётся статической. */}
      <Suspense fallback={<BackLinkFallback />}>
        <BackLink />
      </Suspense>

      <header className="flex flex-col gap-6 sm:flex-row">
        <Portrait
          src={character.image}
          alt={character.name}
          priority
          sizes="(max-width: 640px) 100vw, 280px"
          className="aspect-4/5 w-full shrink-0 rounded-xl sm:w-64"
        />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            {character.name}
          </h1>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Редкость
              <RarityBadge rarity={character.rarity} />
            </div>
            {tier ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Тир
                <TierBadge tierId={tier.id} label={tier.label} />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AttributeBadge attribute={character.attribute} />
            <span className="rounded-md border bg-muted px-2 py-0.5 text-xs">
              {getSpecialtyLabel(character.specialty)}
            </span>
            {character.faction ? (
              <span className="rounded-md border bg-muted px-2 py-0.5 text-xs">
                {character.faction}
              </span>
            ) : null}
          </div>

          {character.shortDescription ? (
            <p className="max-w-2xl text-muted-foreground">
              {character.shortDescription}
            </p>
          ) : null}
        </div>
      </header>

      <CharacterGuide character={character} teams={teams} />
    </div>
  );
}
