"use client"

import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

/** Длительность перехода бегунка и трека — совпадает с `duration-300` ниже.
 * Нужна тем, кто откладывает эффект переключения до конца анимации. */
const SWITCH_TRANSITION_MS = 300

function Switch({
  className,
  thumbClassName,
  size = "default",
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
  /** Классы бегунка — дописываются последними и перекрывают базовые цвета. */
  thumbClassName?: string
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      checked={checked}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all duration-300 ease-out outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        // Позиция бегунка продублирована инлайн-стилем поверх CSS-классов
        // `data-checked:`/`data-unchecked:`. В управляемом режиме (`checked` передан
        // явно, как у обоих свитчеров в шапке) инлайн-стиль всегда побеждает и не
        // зависит от инвалидации стилей по смене атрибута `data-state` — в части
        // браузерных движков (в т.ч. в превью-браузере этого приложения) на повторных
        // переключениях бегунок из-за этого иногда просто не трогался с места.
        // Для неуправляемого (`defaultChecked`) свитча `checked` не передан —
        // тогда работает только CSS-фолбэк. Важно: и фолбэк, и инлайн-стиль
        // используют одно и то же свойство `transform` (не Tailwind-утилиту
        // `translate-x-*`, которая пишет в отдельное CSS-свойство `translate` —
        // оно не перекрывается инлайновым `transform`, а складывается с ним).
        style={
          checked === undefined
            ? undefined
            : { transform: checked ? "translateX(calc(100% - 2px))" : "translateX(0)" }
        }
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-[transform,background-color] duration-300 ease-out group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:[transform:translateX(calc(100%_-_2px))] group-data-[size=sm]/switch:data-checked:[transform:translateX(calc(100%_-_2px))] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:[transform:translateX(0)] group-data-[size=sm]/switch:data-unchecked:[transform:translateX(0)] dark:data-unchecked:bg-foreground",
          thumbClassName
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch, SWITCH_TRANSITION_MS }
