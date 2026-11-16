# Инструменты сайта (на хостинг не попадают)

- `models.cjs` — генератор страниц моделей `models/*.html` и `models/pages.json`.
  Данные моделей (названия, цвета, фото) берёт из `site.js` (`chairs`, `sizes`, `priceOverrides`).
  Карты внутри генератора: `types` (тип и SEO-фраза), `trios` (групповое фото), `interiors` (фото в интерьере и подпись).
  Версию стилей подставляет из ссылки `styles.css?v=…` в `index.html`.
- `build.sh` — `tools/build.sh` пересобирает страницы; `tools/build.sh zip ПУТЬ.zip` ещё и собирает архив для хостинга
  (git archive HEAD + `.htaccess`, без CNAME и .nojekyll). Собирает закоммиченное состояние — сначала commit.
- `htaccess` — кладётся в архив как `.htaccess`: www и http → https://wrightsonvale.ru, сжатие, кэш.

## Порядок правки
1. Правка файлов → `tools/build.sh` → проверить в Playwright.
2. Если менялись `styles.css`/`site.js` — поднять `?v=` во всех HTML (index, sample, privacy, consent, models/*).
3. commit + push в `main` (пока DNS на GitHub Pages — это и есть публикация).
4. `tools/build.sh zip /mnt/user-data/outputs/wv-hosting/wrightsonvale-site.zip` → скопировать на ПК в `Документы\Wrightson-Vale-hosting`.
