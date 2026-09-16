"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

import { filterLabels } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";

/**
 * Общая разметка фильтров. Лежит в shared, потому что её используют
 * две фичи (`filter-characters`, `filter-teams`), а импорт между слайсами
 * одного слоя FSD запрещён.
 */

type FilterSearchProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Кнопка «Сбросить» показывается, только когда есть что сбрасывать. */
  showReset: boolean;
  onReset: () => void;
};

export function FilterSearch({
  id,
  value,
  onChange,
  showReset,
  onReset,
}: FilterSearchProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex min-w-56 flex-1 flex-col gap-1.5">
        <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {filterLabels.search}
        </label>
        <Input
          id={id}
          value={value}
          placeholder="Например, Мияби"
          onChange={(event) => onChange(event.target.value)}
        />
      </div>

      {showReset ? (
        <Button variant="ghost" onClick={onReset}>
          <X />
          {filterLabels.reset}
        </Button>
      ) : null}
    </div>
  );
}

/** Значение пункта «Все»: в состоянии фильтра ему соответствует `null`. */
const ALL = "__all__";

type FilterToggleGroupProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  /** Пункты `ToggleGroupItem`; пункт «Все» добавляется сам. */
  children: ReactNode;
};

export function FilterToggleGroup({
  label,
  value,
  onChange,
  children,
}: FilterToggleGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <ToggleGroup
        type="single"
        variant="outline"
        size="lg"
        value={value ?? ALL}
        // Пустая строка приходит при повторном клике по выбранному пункту —
        // это тоже снятие фильтра.
        onValueChange={(next) => onChange(!next || next === ALL ? null : next)}
        aria-label={label}
        className="flex-wrap"
      >
        <ToggleGroupItem value={ALL} aria-label={filterLabels.all} title={filterLabels.all}>
          <span className="flex size-6 translate-y-0.5 items-center justify-center text-xl font-semibold leading-none">
            *
          </span>
        </ToggleGroupItem>
        {children}
      </ToggleGroup>
    </div>
  );
}
