import Image from "next/image";

import { cn } from "@/shared/lib";

type CharacterPortraitProps = {
  src: string;
  name: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function CharacterPortrait({
  src,
  name,
  sizes = "(max-width: 768px) 50vw, 240px",
  priority = false,
  className,
}: CharacterPortraitProps) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        // Плейсхолдеры сейчас в SVG — оптимизатору изображений он не нужен.
        unoptimized={src.endsWith(".svg")}
        className="object-cover"
      />
    </div>
  );
}
