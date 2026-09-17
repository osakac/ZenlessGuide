import Image from "next/image";
import Link from "next/link";

import { getSpecialtyIcon, getSpecialtyLabel, routes } from "@/shared/config";
import {
  cn,
  getAttributeHoverBorderStyle,
  getAttributeHoverShadowStyle,
  getAttributeHoverTextStyle,
} from "@/shared/lib";

import type { CharacterSummary } from "../model/types";
import { AttributeIconBadge } from "@/shared/ui/attribute-icon-badge";
import { Portrait } from "@/shared/ui/portrait";

type CharacterCardProps = {
  character: CharacterSummary;
  className?: string;
  /**
   * "label" — подпись специализации текстом под именем (по умолчанию).
   * "icon" — только иконка рядом с именем, без текста; используется
   * на странице списка агентов, где карточек много и текст превращается в шум.
   */
  specialtyDisplay?: "label" | "icon";
  /** Карточка на первом экране: портрет грузится сразу, это кандидат в LCP. */
  eager?: boolean;
};

export function CharacterCard({
  character,
  className,
  specialtyDisplay = "label",
  eager = false,
}: CharacterCardProps) {
  const specialtyIcon = getSpecialtyIcon(character.specialty);
  const specialtyLabel = getSpecialtyLabel(character.specialty);

  return (
    <Link
      href={routes.character(character.slug)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        getAttributeHoverBorderStyle(character.attribute),
        getAttributeHoverShadowStyle(character.attribute),
        className,
      )}
    >
      <Portrait
        src={character.image}
        alt={character.name}
        eager={eager}
        className="aspect-4/5 w-full"
      >
        <AttributeIconBadge
          attribute={character.attribute}
          className="absolute top-2 right-2"
        />
      </Portrait>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3
          className={cn(
            "flex min-w-0 items-center gap-1.5 font-semibold transition-colors duration-200",
            getAttributeHoverTextStyle(character.attribute),
          )}
        >
          {specialtyDisplay === "icon" && specialtyIcon ? (
            <Image
              src={specialtyIcon}
              alt={specialtyLabel}
              title={specialtyLabel}
              width={24}
              height={24}
              unoptimized
              className="size-6 shrink-0 object-contain"
            />
          ) : null}
          <span className="truncate">{character.name}</span>
        </h3>
        {specialtyDisplay === "label" ? (
          <span className="text-xs text-muted-foreground">
            {specialtyLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
