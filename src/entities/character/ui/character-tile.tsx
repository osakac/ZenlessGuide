import Link from "next/link";

import { getSpecialtyLabel, routes, type BackSource } from "@/shared/config";
import {
  cn,
  getAttributeGroupHoverBorderStyle,
  getAttributeGroupHoverShadowStyle,
  getAttributeHoverTextStyle,
} from "@/shared/lib";

import type { Character } from "../model/types";
import { AttributeIconBadge } from "@/shared/ui/attribute-icon-badge";
import { Portrait } from "@/shared/ui/portrait";

type CharacterTileProps = {
  character: Character;
  /** Куда вернёт кнопка «назад» на странице агента. */
  from?: BackSource;
  className?: string;
};

/**
 * Компактная плитка для плотных сеток вроде тир-листа: портрет, иконка
 * атрибута поверх него и имя. В отличие от CharacterCard не показывает
 * подпись специализации — в сетке из десятков агентов текст превращается в шум.
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
      <div
        className={cn(
          "overflow-hidden rounded-lg border transition-all duration-200 group-focus-visible:ring-3 group-focus-visible:ring-ring/50",
          getAttributeGroupHoverBorderStyle(character.attribute),
          getAttributeGroupHoverShadowStyle(character.attribute),
        )}
      >
        <Portrait
          src={character.image}
          alt={character.name}
          sizes="(max-width: 640px) 30vw, 120px"
          className="aspect-4/5 w-full"
        >
          <AttributeIconBadge
            attribute={character.attribute}
            className="absolute top-0.5 right-0.5 size-6"
          />
        </Portrait>
      </div>

      <span
        className={cn(
          "truncate text-center text-xs text-muted-foreground transition-colors duration-200",
          getAttributeHoverTextStyle(character.attribute),
        )}
      >
        {character.name}
      </span>
    </Link>
  );
}
