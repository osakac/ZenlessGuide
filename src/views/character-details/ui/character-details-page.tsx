import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import {
  AttributeBadge,
  CharacterPortrait,
  RarityBadge,
} from "@/entities/character";
import { TierBadge } from "@/entities/tier";
import {
  getAllCharacters,
  getCharacterBySlug,
  getTierForCharacter,
} from "@/shared/api";
import { getSpecialtyLabel, routes } from "@/shared/config";
import { CharacterGuide } from "@/widgets/character-guide";

type CharacterDetailsPageProps = {
  slug: string;
};

export async function CharacterDetailsPage({
  slug,
}: CharacterDetailsPageProps) {
  const character = await getCharacterBySlug(slug);

  if (!character) notFound();

  const [tier, allCharacters] = await Promise.all([
    getTierForCharacter(character.id),
    getAllCharacters(),
  ]);

  // Состав команд задан именами: связываем их со страницами тех,
  // кто уже есть в данных.
  const linkableCharacters = Object.fromEntries(
    allCharacters
      .filter((item) => item.slug !== character.slug)
      .map((item) => [item.name, item.slug]),
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <Link
        href={routes.characters}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        Все агенты
      </Link>

      <header className="flex flex-col gap-6 sm:flex-row">
        <CharacterPortrait
          src={character.image}
          name={character.name}
          priority
          sizes="(max-width: 640px) 100vw, 280px"
          className="aspect-4/5 w-full shrink-0 rounded-xl sm:w-64"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {character.name}
            </h1>
            <RarityBadge rarity={character.rarity} />
            {tier ? (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                тир
                <TierBadge tierId={tier.id} label={tier.label} />
              </span>
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

          {tier?.description ? (
            <p className="max-w-2xl rounded-lg border bg-card p-3 text-sm text-muted-foreground">
              {tier.description}
            </p>
          ) : null}
        </div>
      </header>

      <CharacterGuide
        character={character}
        linkableCharacters={linkableCharacters}
      />
    </div>
  );
}
