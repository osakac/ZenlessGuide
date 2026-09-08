import Link from "next/link";
import type { ReactNode } from "react";

import { getSpecialtyLabel, routes } from "@/shared/config";
import { cn } from "@/shared/lib";

import type { Character } from "../model/types";
import { AttributeBadge } from "./attribute-badge";
import { CharacterPortrait } from "./character-portrait";
import { RarityBadge } from "./rarity-badge";

type CharacterCardProps = {
  character: Character;
  /**
   * Слот для бейджа поверх портрета. Через него виджеты добавляют тир:
   * сущность character не должна знать про сущность tier.
   */
  badge?: ReactNode;
  className?: string;
};

export function CharacterCard({
  character,
  badge,
  className,
}: CharacterCardProps) {
  return (
    <Link
      href={routes.character(character.slug)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <div className="relative">
        <CharacterPortrait
          src={character.image}
          name={character.name}
          className="aspect-4/5 w-full"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <RarityBadge rarity={character.rarity} />
          {badge}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="font-semibold group-hover:text-primary">
          {character.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <AttributeBadge attribute={character.attribute} />
          <span className="text-xs text-muted-foreground">
            {getSpecialtyLabel(character.specialty)}
          </span>
        </div>
      </div>
    </Link>
  );
}
