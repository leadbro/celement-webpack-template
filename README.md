# CElement webpack template

Шаблон для разработки вёрстки сайтов на базе Web Components.

## Стек

- **TypeScript** (strict mode)
- **Lit-HTML** — рендеринг шаблонов
- **Web Components** (Custom Elements) — компонентная архитектура
- **PostCSS** — nested, mixins, custom media queries, pxtorem
- **Webpack 5** — сборка и dev-сервер

## Быстрый старт

```bash
yarn
yarn dev
```

Dev-сервер запускается на `http://localhost:1113`.

## Команды

| Команда | Описание |
|---------|----------|
| `yarn dev` | Dev-сервер с hot-reload |
| `yarn build` | Production-сборка в `public/dist/` |
| `./build.sh` | Full build: сборка + копирование ассетов + cache-busting |

## Архитектура

### App

`App` (`src/app/App.ts`) — оркестратор приложения. Регистрирует компоненты, управляет lifecycle-хуками и определяет тип экрана.

Для использования — наследуемся и переопределяем хуки:

```ts
class MyApp extends App {
  created() {}                                    // после инициализации
  onload() {}                                     // после DOMContentLoaded
  onresize(oldScreen: string, newScreen: string) {} // после resize (throttle 200ms)
}

new MyApp({ components: { MyComponent } })
```

Компоненты регистрируются по имени класса — `MyComponent` автоматически получает тег `my-component`.

### CElement

`CElement` (`src/components/c-element/c-element.ts`) — базовый класс для всех компонентов. Наследуется от `HTMLElement`.

Возможности:
- Shadow DOM + Lit-HTML рендеринг
- IntersectionObserver для ленивой инициализации (`intersectedCallback`)
- DOM-хелперы: `$find`, `$findAll`, `$on`, `$emit`, `$get`, `$set`, `$remove`
- Слоты: `$createSlotRoot`

### Структура

```
src/
  app/           — App-класс
  entries/       — точки входа Webpack
  components/    — CElement и компоненты
  directives/    — collapse, fade, body-lock
  plugins/       — event bus
  utils/         — throttle, intersection, animation, template
  pages/         — HTML-шаблоны страниц
  views/         — HTML-фрагменты (header, footer, popups)
  assets/styles/ — PostCSS-стили, миксины, переменные
  types/         — декларации типов для untyped-зависимостей
```

### Роутинг

Страницы определяются в `src/routes.ts`. Каждый роут — объект с `title` и `filename`, указывающим на HTML-шаблон в `src/pages/`. HtmlWebpackPlugin генерирует итоговый HTML.
