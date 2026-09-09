# ZenlessGuide

Сайт-гайд по игре **Zenless Zone Zero**: тир-лист персонажей и подробные гайды по билдам — оружие, дисководы, приоритет статов и рабочие команды.

Спецификация проекта — [SPEC.md](SPEC.md). Правила работы над кодом — [CLAUDE.md](CLAUDE.md).

> Данные наполняются итеративно: сейчас заведены агенты тиров S и A. Подробности в [data/README.md](data/README.md).

## Запуск

```bash
npm install
npm run dev
```

Сайт поднимется на http://localhost:3000.

| Команда | Что делает |
|---|---|
| `npm run dev` | Дев-сервер |
| `npm run build` | Продакшн-сборка |
| `npm run start` | Запуск собранного приложения |
| `npm run lint` | ESLint, включая проверку границ FSD |
| `npm run typecheck` | Проверка типов |
| `npm run test` | Тесты (Vitest) |

## Стек

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · zod · next-themes · Vitest

## Страницы

| Маршрут | Содержимое |
|---|---|
| `/` | Краткое описание, ссылки на разделы, верхний тир |
| `/tierlist` | Тир-лист с фильтрами |
| `/characters` | Все персонажи карточками с фильтрами |
| `/characters/[slug]` | Гайд по персонажу |
| `/teams` | Все составы команд |

Фильтры хранят состояние в query-параметрах: ссылку с выбранными фильтрами можно переслать.

## Архитектура

Проект следует Feature-Sliced Design. Роутинг Next.js живёт в корневом `app/` и остаётся тонким — файл маршрута только рендерит соответствующий компонент из `src/views`.

```
app/                 маршруты Next.js
src/
  app/               провайдеры, глобальные стили
  views/             композиция страниц (слой pages в терминах FSD)
  widgets/           tier-board, character-card-grid, character-guide, team-grid, header, footer
  features/          filter-characters
  entities/          character, tier
  shared/            ui (shadcn), api (доступ к данным), lib, config
data/                characters.json, tierlist.json
```

Слой `pages` назван `views`, потому что имя `pages` зарезервировано Next.js под Pages Router.

Правила импортов (слой видит только нижележащие, кросс-импорты внутри слоя запрещены, обращение к слайсу только через его `index.ts`) проверяются автоматически — `eslint-plugin-boundaries`, конфигурация в [eslint.config.mjs](eslint.config.mjs).

Алиасы: `@/*` → `src/*`, `@data/*` → `data/*`.

## Данные

Весь доступ к данным изолирован в [src/shared/api](src/shared/api) — компоненты не импортируют JSON напрямую. Функции асинхронные, поэтому переход с JSON-файлов на БД не затронет UI. Содержимое файлов валидируется zod-схемами: ошибка в данных даёт понятное сообщение с указанием поля.

Добавление персонажа сводится к правке `data/characters.json` и `data/tierlist.json` — код менять не нужно, фильтры и страницы подстроятся сами.
