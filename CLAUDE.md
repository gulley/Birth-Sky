# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Birth Sky is a Progressive Web App that calculates and visualizes celestial object positions (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn) on an interactive zodiac chart. Users pick a date and see where planets fall in the zodiac, with support for both true astronomical (IAU) boundaries and traditional 30° divisions.

Live site: https://gulley.github.io/Birth-Sky/

## Build

No build step. The app uses native ES modules loaded directly by the browser. There are no tests or linting configured.

## Architecture

**Entry point:** `index.html` loads `js/main.js` as a `type="module"` script.

**Module structure:**

- `js/main.js` — Central controller: initializes canvas, wires up event listeners (date picker, zodiac toggle, arrow keys), manages tooltip hover detection, orchestrates redraws
- `js/config/zodiac-config.js` — Defines true zodiac (variable-width IAU boundaries) and traditional zodiac (equal 30° signs); exports `getZodiacSign(longitude)`
- `js/config/celestial-config.js` — Planet metadata: symbol characters, colors, orbital radii
- `js/drawing/chart-base.js` — Canvas setup, background circles, zodiac ring rendering
- `js/drawing/medallions.js` — Planet medallion rendering with gradient/glow effects, fixed star display, celestial stalks
- `js/animation/zodiac-transition.js` — Smooth 1-second eased transitions when toggling zodiac systems
- `js/utils/astronomy-calc.js` — Wraps the astronomy-engine library for RA/Dec calculations
- `js/utils/font-loader.js` — Loads the Astronomicon custom font for astronomical symbols
- `js/utils/ui-templates.js` — UI component HTML templates
- `js/utils/register-service-worker.js` — PWA service worker registration

**Data flow:** Date change → `astronomy-calc.js` computes positions → `zodiac-config.js` maps longitude to sign → drawing modules render chart on canvas.

**External dependencies:**
- `astronomy-engine` (astronomy.min.js) — precision celestial calculations
- `FontFaceObserver` — reliable custom font loading
- Astronomicon font (`fonts/`) — astronomical symbol glyphs mapped in `planet-symbols.js`

## Key Design Decisions

- **Canvas-based rendering** (not SVG) for smooth animations and precise drawing control
- **Two zodiac systems** coexist: true astronomical boundaries have variable widths (11.5°–31°); traditional are fixed 30° each
- **Service worker** (`service-worker.js`) caches all assets for offline use; update the cache list when adding new files
- **No bundler** — native ES modules; top-level files like `astronomy.min.js`, `planet-symbols.js`, and `astronomy-wrapper.js` are loaded separately by `index.html`
