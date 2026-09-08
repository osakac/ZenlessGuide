import Link from "next/link";

import { getSpecialtyLabel, routes, type BackSource } from "@/shared/config";
import { cn } from "@/shared/lib";

import type { Character } from "../model/types";
import { CharacterPortrait } from "./character-portrait";

type CharacterTileProps = {
  character: Character;
  /** Куда вернёт кнопка «назад» на странице агента. */
  from?: BackSource;
  className?: string;
};

/**
 * Компактная плитка для плотных сеток вроде тир-листа: портрет и имя.
 * В отличие от CharacterCard не показывает атрибут и специализацию —
 * в сетке из десятков агентов эти подписи превращаются в шум.
 */
export function CharacterTile({
  character,
  from,
  className,
}: CharacterTileProps) {
  return (
    <Link
      href={routes.character(character.slug, from)}
      title={`${character.name} — ${getSpecialtyLabel(character.specialty)}`}
      className={cn("group flex w-full flex-col gap-1", className)}
    >
      <div className="overflow-hidden rounded-lg border transition-colors group-hover:border-primary/60 group-focus-visible:border-primary group-focus-visible:ring-3 group-focus-visible:ring-ring/50">
        <CharacterPortrait
          src={character.image}
          name={character.name}
          sizes="(max-width: 640px) 30vw, 120px"
          className="aspect-4/5 w-full"
        />
      </div>

      <span className="truncate text-center text-xs text-muted-foreground group-hover:text-primary">
        {character.name}
      </span>
    </Link>
  );
}
