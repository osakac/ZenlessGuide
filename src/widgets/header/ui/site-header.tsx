"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/shared/config";
import { cn } from "@/shared/lib";

import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { href: routes.home, label: "Главная" },
  { href: routes.tierlist, label: "Тир-лист" },
  { href: routes.characters, label: "Агенты" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:gap-6">
        <Link href={routes.home} className="font-semibold tracking-tight">
          Zenless<span className="text-primary">Guide</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {navigation.map((item) => {
            const isActive =
              item.href === routes.home
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-1.5 whitespace-nowrap transition-colors hover:bg-muted sm:px-3",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
