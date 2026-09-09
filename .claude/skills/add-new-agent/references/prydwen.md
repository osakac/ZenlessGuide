# Как забрать данные с prydwen.gg

Справочник к скиллу `add-new-agent`. Здесь только механика доступа к сайту — что именно переносить в проект, написано в `SKILL.md`.

## Адреса

| Что | URL |
|---|---|
| Страница агента | `https://www.prydwen.gg/zenless/characters/<slug>` |
| Тир-лист | `https://www.prydwen.gg/zenless/tier-list` |
| Портрет | `https://cdn.prydwen.gg/images/zenless-zone-zero/characters/<slug>_card.webp` |

Портрет — готовый webp 374×512, ровно тот формат, что лежит в `public/images/characters/`. Скачивается обычным `curl`, Cloudflare его не режет.

## Чем ходить

`WebFetch` на prydwen.gg отдаёт **403** — сайт закрыт Cloudflare. Работает браузер Claude: `mcp__Claude_Browser__navigate` и соседние инструменты.

Страница агента разбита на вкладки — **Kit**, **Review**, **Build**, **SD/DA Analytics**, **Teams & Synergy**, **Calculations**. `get_page_text` отдаёт текст только активной вкладки, поэтому вкладку нужно переключить.

Клик по `ref` из `find` здесь ненадёжен: у страницы две вёрстки (десктопная и мобильная), половина элементов скрыта, и клик уходит не туда. Переключай вкладку из страницы:

```js
[...document.querySelectorAll('.single-tab')].find((e) => e.textContent.trim() === 'Build').click()
```

Затем обычный `get_page_text` — он вернёт содержимое уже новой вкладки, аккуратно размеченное заголовками.

## Паспорт агента и портрет

Атрибут, специализацию и фракцию бери из вводного абзаца страницы: «Claret is an rank character with the **Electric** attribute who belongs to the **Armorer** Specialty and who is part of the **Unknown Faction** faction». Дырка в начале не случайна — ранг нарисован иконкой, и в текст он не попадает:

```js
JSON.stringify({
  rarity: [...document.images].find((i) => i.src.includes('/icons/rarity_'))?.alt, // "S" | "A"
})
```

Иконки специализации (`/icons/style_*`) и фракции (`/factions/*`) есть не у всех: у новой специализации или у агента без фракции их просто нет, поэтому текст абзаца надёжнее.

Портрет качается по slug, лезть за его адресом на страницу не нужно.

## Тир и роль

На странице тир-листа. Тиры — `T0`, `T0.5`, `T1`, `T1.5`, `T2`, `T3`; внутри каждого три колонки ролей, в разметке это классы `dps`, `sec-dps`, `support`:

```js
const roleMap = { dps: 'pure-dps', 'sec-dps': 'anomaly-dps', support: 'support' };
const name = 'Claret'; // английское имя агента, как в alt картинки
let found = null;
document.querySelectorAll('.custom-tier').forEach((tier) => {
  const label = tier.querySelector('.tier-rating')?.textContent.trim();
  tier.querySelectorAll('.custom-tier-burst').forEach((burst) => {
    const role = [...burst.classList].find((c) => c !== 'custom-tier-burst');
    if ([...burst.querySelectorAll('img')].some((i) => i.alt === name)) {
      found = { tier: label, role: roleMap[role] };
    }
  });
});
JSON.stringify(found)
```

Пусто — агента в тир-листе нет: он либо слишком новый, либо ты ошибся в имени. Спроси пользователя, не выдумывай тир.

## Команды

Вкладка **Teams & Synergy**. Состав — три колонки-слота, в слоте бывает несколько взаимозаменяемых агентов:

```js
JSON.stringify(
  [...document.querySelectorAll('.team-row')]
    .map((row) => [...row.children].map((slot) => [...slot.querySelectorAll('img')].map((i) => i.alt)))
);
```

Составы продублированы в разметке (десктоп и мобильная вёрстка) — одинаковые строки подряд не считай за разные команды.

Рядом лежит блок Synergy — разбор напарников по одному. Он полезен, чтобы понять, почему состав именно такой, и написать `note` своими словами.

## Если что-то пошло не так

- Клик по `ref` падает с «outside the viewport» — панель браузера свёрнута и у страницы нулевой размер. Помогает `resize_window` с явными размерами (например 1400×1000), но проще вообще не кликать по `ref`, а переключать вкладки из страницы, как выше.
- В тексте вкладки пусто, хотя вкладка переключилась — дай странице долю секунды (`await new Promise((r) => setTimeout(r, 400))`) и повтори `get_page_text`.
