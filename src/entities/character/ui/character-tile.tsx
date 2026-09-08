import Link from "next/link";

import { getSpecialtyLabel, routes } from "@/shared/config";
import { cn } from "@/shared/lib";

import type { Character } from "../model/types";
import { CharacterPortrait } from "./character-portrait";
import { RarityBadge } from "./rarity-badge";

type CharacterTileProps = {
  character: Character;
  className?: string;
};

/**
 * Компактная плитка для плотных сеток вроде тир-листа: портрет, ранг и имя.
 * В отличие от CharacterCard не показывает атрибут и специализацию —
 * в сетке из десятков агентов эти подписи превращаются в шум.
 */
export function CharacterTile({ character, className }: CharacterTileProps) {
  return (
    <Link
      href={routes.character(character.slug)}
      title={`${character.name} — ${getSpecialtyLabel(character.specialty)}`}
      className={cn("group flex w-full flex-col gap-1", className)}
    >
      <div className="relative overflow-hidden rounded-lg border transition-colors group-hover:border-primary/60 group-focus-visible:border-primary group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <CharacterPortrait
          src={character.image}
          name={character.name}
          sizes="(max-width: 640px) 30vw, 120px"
          className="aspect-4/5 w-full"
        />
        <RarityBadge
          rarity={character.rarity}
          className="absolute top-1 left-1 px-1 py-0 text-[10px]"
        />
      </div>

      <span className="truncate text-center text-xs text-muted-foreground group-hover:text-primary">
        {character.name}
      </span>
    </Link>
  );
}
