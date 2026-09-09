import Image from "next/image";

import { cn } from "@/shared/lib";

/**
 * Картинка, растянутая по контейнеру: рамку, скругление и пропорции
 * задаёт вызывающая сторона через className. Лежит в shared, потому что
 * нужна и карточке агента, и составу команды — а импорт между слайсами
 * одного слоя FSD запрещён.
 */

type PortraitProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function Portrait({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 240px",
  priority = false,
  className,
}: PortraitProps) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        // SVG оптимизатору изображений прогонять незачем: он и так векторный.
        // Портреты персонажей — webp, они проходят обычную оптимизацию.
        unoptimized={src.endsWith(".svg")}
        className="object-cover pointer-events-none"
      />
    </div>
  );
}
