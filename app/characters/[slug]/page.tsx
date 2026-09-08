import type { Metadata } from "next";

import { getAllCharacters, getCharacterBySlug } from "@/shared/api";
import { CharacterDetailsPage } from "@/views/character-details";

export async function generateStaticParams() {
  const characters = await getAllCharacters();
  return characters.map((character) => ({ slug: character.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/characters/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const character = await getCharacterBySlug(slug);

  if (!character) return { title: "Персонаж не найден" };

  return {
    title: `${character.name} — гайд и билд`,
    description:
      character.shortDescription ||
      `Гайд по агенту ${character.name} в Zenless Zone Zero: оружие, драйв-диски, статы и команды.`,
  };
}

export default async function Page({ params }: PageProps<"/characters/[slug]">) {
  const { slug } = await params;
  return <CharacterDetailsPage slug={slug} />;
}
