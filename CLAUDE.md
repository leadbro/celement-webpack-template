# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PharmAid — frontend web application built with custom Web Components (CElement framework), Lit-HTML templating, and PostCSS styling. Bundled with Webpack 5, managed with Yarn.

Comments throughout the codebase are in Russian.

## Commands

- **Dev server**: `yarn dev` (runs on port 1113)
- **Production build**: `./build.sh` (runs `yarn build` then copies assets, adds cache-busting timestamps, removes newlines from template literals in JS bundle)
- **Install dependencies**: `yarn`

No test or lint commands are configured.

## Architecture

### Entry Point Flow

`src/entries/base.ts` → creates `App` instance → registers components, binds methods, fires lifecycle hooks (`created`, `onload`, `onresize`).

### Core Classes

- **`App`** (`src/app/App.ts`): Application orchestrator. Registers custom elements (converting CamelCase names to dash-case via `camelToDash`), binds methods to the app instance, manages media screen detection via CSS custom property `--media-screen`, throttles resize events.
- **`CElement`** (`src/components/c-element/c-element.ts`): Base class for all custom elements extending `HTMLElement`. Provides Shadow DOM, Lit-HTML rendering (`render`/`html`), IntersectionObserver for lazy init, and DOM helpers (`$find`, `$findAll`, `$on`, `$emit`, `$get`, `$set`, `$remove`, `$createSlotRoot`).

### Key Directories

- `src/entries/` — Webpack entry points (JS bundle + styles bundle)
- `src/app/` — App class and config
- `src/components/` — CElement base class (new components extend this)
- `src/directives/` — Reusable behaviors: `collapse.ts` (accordion), `fade.ts` (transitions), `body-lock.ts` (scroll lock)
- `src/utils/` — Helpers: throttle decorator, animation restart, case conversion, intersection observer, template interpolation
- `src/pages/` — HTML page templates (fed to HtmlWebpackPlugin via `src/routes.js`)
- `src/views/` — Partial HTML fragments (header, footer, popups, preload)
- `src/assets/styles/` — PostCSS styles with custom media queries and mixins
- `public/` — Static assets (images, favicon); `public/dist/` is the build output

### Build Pipeline

Webpack processes two entry bundles: `base` (JS/TS) and `styles` (CSS). PostCSS pipeline includes nested selectors, mixins, custom media queries, and pxtorem (16px root). `build.sh` post-processes the output: copies static assets, adds version query strings, strips newlines from JS bundle, removes the standalone styles bundle.

### Routing

Routes defined in `src/routes.js` — each route maps to an HTML template in `src/pages/`. HtmlWebpackPlugin generates the output HTML for each route.

## Conventions

- Path alias: `@/*` maps to `./src/*` (configured in tsconfig and webpack)
- Component registration: pass class name in CamelCase to `App.components` — it auto-converts to dash-case for the custom element tag
- CElement utility methods are prefixed with `$` (e.g., `$find`, `$emit`)
- Private methods prefixed with `_`
- TypeScript strict mode enabled (`strict: true` in tsconfig)
- Custom type declarations in `src/types/` for untyped dependencies
- `App.methods` динамически расширяет экземпляр App — внутри `onload`/`onresize` доступ к методам через `this['methodName']`
