# Карточка товара Teaboom.ru — «Ананасовый улун»

Тестовое задание: вёрстка верхней части карточки товара интернет-магазина [Teaboom.ru](https://teaboom.ru/product/ananasovij-ulun).

Стек: HTML5, SCSS, чистый JavaScript (ES-модули), сборщик [Vite](https://vite.dev). Без фреймворков и UI-библиотек.

## Запуск

Нужен Node.js 20+.

```bash
npm install
npm run dev       # dev-сервер с hot reload: http://localhost:5173
npm run build     # production-сборка в папку dist/
npm run preview   # локальный просмотр собранной версии
```

Сборка в `dist/` использует относительные пути (`base: './'`), поэтому её можно открыть с любого статического хостинга или из подпапки.
