# AGENTS.md

## What this is
A password-encrypted GitHub Pages static personal site (custom domain: `emohomepage.ccwu.cc`). No package manager or framework.

## How to preview
```bash
python3 -m http.server 8080
```

## Architecture
- `index.html` — Public password gate plus an inline AES-GCM encrypted payload; protected markup is never shipped as plaintext
- `styles.css` — All styles; CSS custom properties defined in `:root` use Claude swatch naming (`--swatch-*`)
- `script.js` — Public gate runtime; derives the decryption key and initializes the protected app after a successful unlock
- `tools/password-gate.mjs` — Zero-dependency maintenance utility for unpacking, repacking, and rotating the password
- `tools/gate-template.html` — Public gate-shell template used by the maintenance utility
- `.private/` — Temporary ignored plaintext sources created by `unpack`; `pack` deletes the directory after success
- `assets/` — Images; the hero background uses `assets/claude-workspace.png`

## Key conventions
- **No package tooling.** There is no `package.json`, bundler, or transpiler. Do not run npm/pnpm/yarn. The Node maintenance utility uses only built-in modules.
- **Never place the password in tracked files, commands, URLs, or browser storage.** Pass it through the `SITE_PASSWORD` environment variable. A 16+ character high-entropy password is recommended; shorter user-selected passwords provide only superficial protection against guessing.
- **Edit protected content through the maintenance workflow.** Export `SITE_PASSWORD` from a hidden shell prompt, run `node tools/password-gate.mjs unpack`, edit `.private/index.html` and `.private/script.js`, then run `node tools/password-gate.mjs pack`. Do not serve, deploy, or commit `.private/`.
- **Lucide and Three.js** are loaded only after successful decryption. The protected app must be injected before its original script runs because it queries the DOM at startup.
- **i18n** lives in the protected `.private/script.js` source as a `translations` object keyed by locale. Elements use `data-i18n` attributes. The active locale is stored in `currentLang` (default `"zh"`).
- **CSS variables follow Claude's swatch system:** `--swatch-clay`, `--swatch-olive`, `--swatch-sky`, `--swatch-fig`, `--swatch-coral`, `--swatch-cactus`, `--swatch-heather`, `--swatch-oat`, plus a full gray scale (`--swatch-gray-*`). Semantic aliases like `--accent`, `--ink`, `--page` map to these swatches.
- **Interactive effects** are driven by `data-*` attributes: `data-tilt`, `data-filter`, `data-count`, `data-live`, `data-typewriter`, `data-tech-canvas`, `data-scroll-progress`, `data-lang-picker`, etc. All motion respects `prefers-reduced-motion: reduce`.
- **CNAME** file sets the custom domain. Do not delete it.

## Color palette source
Palette derived from Claude's public CSS. See README for the full swatch table and source URL.
