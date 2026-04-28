# AGENTS.md

## What this is
A GitHub Pages static personal site (custom domain: `emohomepage.ccwu.cc`). No build step, no package manager, no framework.

## How to preview
```bash
python3 -m http.server 8080
# or just open index.html in a browser
```

## Architecture
- `index.html` — Single-page layout with sections (hero, lab, work, notes, stack, contact)
- `styles.css` — All styles; CSS custom properties defined in `:root` use Claude swatch naming (`--swatch-*`)
- `script.js` — All interactivity plus i18n (8 languages embedded inline, not loaded from files)
- `assets/` — Images; the hero background uses `assets/claude-workspace.png`

## Key conventions
- **No build tooling.** There is no `package.json`, bundler, or transpiler. Do not run npm/pnpm/yarn.
- **Lucide icons** are loaded at runtime from `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` (CDN `<script>` in index.html). Icons are instantiated via `window.lucide.createIcons()` after any DOM change that adds new icon elements.
- **i18n** lives entirely in `script.js` as a `translations` object keyed by locale. Elements use `data-i18n` attributes. The active locale is stored in `currentLang` (default `"zh"`).
- **CSS variables follow Claude's swatch system:** `--swatch-clay`, `--swatch-olive`, `--swatch-sky`, `--swatch-fig`, `--swatch-coral`, `--swatch-cactus`, `--swatch-heather`, `--swatch-oat`, plus a full gray scale (`--swatch-gray-*`). Semantic aliases like `--accent`, `--ink`, `--page` map to these swatches.
- **Interactive effects** are driven by `data-*` attributes: `data-tilt`, `data-filter`, `data-count`, `data-live`, `data-typewriter`, `data-tech-canvas`, `data-scroll-progress`, `data-lang-picker`, etc. All motion respects `prefers-reduced-motion: reduce`.
- **CNAME** file sets the custom domain. Do not delete it.

## Color palette source
Palette derived from Claude's public CSS. See README for the full swatch table and source URL.
