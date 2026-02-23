# Чеклист SEO перед и после деплоя на Vercel

## До деплоя

### 1. Установить переменную окружения `NEXT_PUBLIC_BASE_URL`

В Vercel → Project → Settings → Environment Variables добавить:

```
NEXT_PUBLIC_BASE_URL = https://yourdomain.com
```

Без этого canonical URL, sitemap и JSON-LD будут указывать на `http://localhost:3000`.

### 2. Привязать кастомный домен

Vercel → Project → Settings → Domains → добавить домен.
Vercel автоматически выдаст SSL-сертификат (HTTPS обязателен для SEO).

После привязки домена Vercel создаёт редирект `www → non-www` (или наоборот) — убедись, что выбран нужный вариант и он совпадает с `NEXT_PUBLIC_BASE_URL`.

### 3. Проверить `robots.txt` и `sitemap.xml` локально

```bash
npm run build && npm start
```

Открыть в браузере:
- `http://localhost:3000/robots.txt` — должен показать правила + ссылку на sitemap
- `http://localhost:3000/sitemap.xml` — должен показать `<url>` главной страницы
- `http://localhost:3000/icon` — должна появиться розовая иконка с «К»

---

## После деплоя

### 4. Проверить мета-теги на продакшне

Открыть исходник страницы (`Ctrl+U`) и убедиться, что есть:

- `<link rel="canonical" href="https://yourdomain.com/" />`
- `<meta property="og:image" content="https://yourdomain.com/header_1.jpg" />`
- `<meta name="robots" content="index, follow" />`
- На странице `/success` — `<meta name="robots" content="noindex, nofollow" />`
- Три блока `<script type="application/ld+json">` (WebSite, Product, Person)

### 5. Проверить OG-карточку

Вставить URL сайта на:
- https://opengraph.xyz — показывает предпросмотр карточки для соцсетей
- https://cards-dev.twitter.com/validator — Twitter Card

Должны отображаться: заголовок, описание, картинка `header_1.jpg`.

### 6. Проверить структурированные данные

Вставить URL на:
- https://search.google.com/test/rich-results

Должны валидироваться схемы **Product** и **Person** без критических ошибок.

### 7. Зарегистрировать сайт в Google Search Console

1. Перейти на https://search.google.com/search-console
2. Добавить ресурс → тип «Домен» или «URL-префикс»
3. Подтвердить через DNS-запись (Vercel делает это автоматически если домен привязан) или HTML-файл
4. После подтверждения: **Индексирование → Карты сайта** → вставить `https://yourdomain.com/sitemap.xml` → Отправить

### 8. Зарегистрировать сайт в Яндекс Вебмастере

1. Перейти на https://webmaster.yandex.ru
2. Добавить сайт → подтвердить через HTML-тег или DNS
3. **Индексирование → Файл Sitemap** → добавить `https://yourdomain.com/sitemap.xml`

Яндекс особенно важен для русскоязычной аудитории.

### 9. Запустить Lighthouse

В Chrome DevTools → вкладка Lighthouse → выбрать «SEO» и «Performance» → анализировать продакшн URL (не localhost).

Целевые оценки:
- SEO: 100
- Performance: ≥ 90
- Accessibility: ≥ 90

### 10. Проверить скорость загрузки изображений

Открыть DevTools → вкладка Network → перезагрузить страницу.
Убедиться, что `header_1.jpg` отдаётся в формате **AVIF** или **WebP** (не оригинальный JPEG) — это настроено в `next.config.mjs`.

---

## Разовые действия после первой индексации

- Добавить **внешние ссылки** на сайт (соцсети, профили, упоминания) — это сигнал авторитетности для поисковиков
- Добавить сайт в **Яндекс.Справочник** и **Google Business Profile** если есть физическая точка
- Через 2–4 недели проверить в Search Console и Вебмастере, какие запросы приводят трафик, и скорректировать текст на странице под реальные запросы пользователей
