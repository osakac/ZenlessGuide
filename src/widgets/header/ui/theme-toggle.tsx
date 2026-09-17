"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/shared/lib";
import { Switch, SWITCH_TRANSITION_MS } from "@/shared/ui/switch";

const noopSubscribe = () => () => {};

/** true только после гидратации на клиенте: на сервере тема неизвестна,
 * а `useEffect` + `setState` для этого — каскадный ре-рендер, поэтому
 * подписка на «внешнее» состояние маунта через useSyncExternalStore. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Глушит CSS-переходы на всё время смены темы. Встроенный
 * `disableTransitionOnChange` из `next-themes` ненадёжен: снимает стиль через
 * 1мс, не форсируя пересчёт стилей, и часть элементов с `transition-*` успевает
 * анимировать цвет, а остальные перекрашиваются мгновенно — рассинхрон.
 * Здесь стиль снимается только после того, как класс темы уже стоит на
 * `<html>` и новые цвета посчитаны принудительным reflow: стили уже вычислены
 * с `transition: none`, и после снятия стиля анимировать нечего. Таймеры, а не
 * `requestAnimationFrame`: в фоновой вкладке кадры не идут и стиль повис бы.
 */
function changeThemeWithoutTransitions(theme: "light" | "dark", apply: () => void) {
  const style = document.createElement("style");
  style.textContent =
    "*,*::before,*::after{transition:none!important;animation-duration:0s!important}";
  document.head.appendChild(style);
  apply();

  const root = document.documentElement;
  const startedAt = performance.now();
  const release = () => {
    // Класс ставит эффект `next-themes` после коммита React — ждём его,
    // но не дольше секунды, чтобы стиль не повис навсегда.
    if (!root.classList.contains(theme) && performance.now() - startedAt < 1000) {
      setTimeout(release, 10);
      return;
    }
    void document.body.offsetHeight;
    setTimeout(() => style.remove(), 50);
  };
  setTimeout(release, 0);
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  // Выбранное, но ещё не применённое положение свитча. На время смены темы
  // глушатся все CSS-переходы, включая переход бегунка — поэтому сначала
  // свитч доезжает по этому локальному состоянию, и только потом тема
  // применяется.
  const [pendingDark, setPendingDark] = useState<boolean | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isDark = pendingDark ?? (mounted && resolvedTheme === "dark");

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  function handleCheckedChange(checked: boolean) {
    setPendingDark(checked);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const theme = checked ? "dark" : "light";
      changeThemeWithoutTransitions(theme, () => {
        setTheme(theme);
        setPendingDark(null);
      });
    }, SWITCH_TRANSITION_MS);
  }

  return (
    // Не `<label>`: он оборачивает `Switch` (это `<button>`, не `<input>`),
    // а клик по такой обёртке в части браузеров дублируется — сначала как
    // обычный клик по кнопке, затем как перенаправленный от `<label>`.
    // Имя для скринридера уже даёт `aria-label` на самом `Switch`.
    //
    // `data-mounted` появляется после гидратации. До неё тема React неизвестна
    // и свитч отрендерен «светлым», поэтому положение в тёмной теме подменяет
    // CSS по классу `dark` на `<html>` (его ставит скрипт `next-themes` до
    // отрисовки) — см. `[data-slot="theme-toggle"]` в globals.css.
    <div
      data-slot="theme-toggle"
      data-mounted={mounted || undefined}
      className="flex items-center gap-1.5"
    >
      <Sun
        className={cn(
          "size-4 transition-colors duration-300",
          isDark ? "text-(--theme-toggle-icon-inactive)" : "text-(--theme-toggle-sun)",
        )}
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleCheckedChange}
        aria-label="Переключить тему"
        // Цвета трека и бегунка — по положению свитча, а не по теме (`dark:`
        // и `--primary` здесь не годятся): тема применяется уже после анимации,
        // при отключённых переходах, и свитч перекрашивался бы рывком.
        // `dark:` в классах трека — чтобы перебить `dark:data-unchecked:bg-input/80`
        // базового компонента. Трек цветной в обеих темах: блёклый `bg-input`
        // терялся на светлом фоне.
        className="data-checked:bg-(--theme-toggle-track-dark) data-unchecked:bg-(--theme-toggle-track-light) dark:data-checked:bg-(--theme-toggle-track-dark) dark:data-unchecked:bg-(--theme-toggle-track-light)"
        thumbClassName="bg-(--theme-toggle-thumb) dark:data-checked:bg-(--theme-toggle-thumb) dark:data-unchecked:bg-(--theme-toggle-thumb)"
      />
      <Moon
        className={cn(
          "size-4 transition-colors duration-300",
          isDark ? "text-(--theme-toggle-moon)" : "text-(--theme-toggle-icon-inactive)",
        )}
      />
    </div>
  );
}
