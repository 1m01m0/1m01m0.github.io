# AGENTS.md

## What this is
A password-encrypted GitHub Pages static personal site (custom domain: `emohomepage.ccwu.cc`). No package manager or framework.

## How to preview
```bash
python3 -m http.server 8080
```

## Architecture
- `index.html` — Public password gate plus an inline AES-GCM encrypted payload; protected markup is never shipped as plaintext
- `styles.css` — All styles; an academic visual system built from semantic CSS custom properties in `:root`
- `script.js` — Public gate runtime; derives the decryption key and initializes the protected app after a successful unlock
- `tools/password-gate.mjs` — Zero-dependency maintenance utility for unpacking, repacking, and rotating the password
- `tools/gate-template.html` — Public gate-shell template used by the maintenance utility
- `.private/` — Temporary ignored plaintext sources created by `unpack`; `pack` deletes the directory after success
- `assets/` — Self-hosted runtime dependencies and legacy artwork; the academic layout does not use a hero image

## Key conventions
- **No package tooling.** There is no `package.json`, bundler, or transpiler. Do not run npm/pnpm/yarn. The Node maintenance utility uses only built-in modules.
- **Never place the password in tracked files, commands, URLs, or browser storage.** Pass it through the `SITE_PASSWORD` environment variable. A 16+ character high-entropy password is recommended; shorter user-selected passwords provide only superficial protection against guessing.
- **Edit protected content through the maintenance workflow.** Export `SITE_PASSWORD` from a hidden shell prompt, run `node tools/password-gate.mjs unpack`, edit `.private/index.html` and `.private/script.js`, then run `node tools/password-gate.mjs pack`. Do not serve, deploy, or commit `.private/`.
- **Lucide** is loaded only after successful decryption. The protected app must be injected before its script runs because it queries the DOM at startup.
- **i18n** lives in the protected `.private/script.js` source as a `translations` object keyed by locale. Elements use `data-i18n` attributes. The site defaults to English and offers English and Simplified Chinese.
- **CSS variables are semantic:** `--page`, `--surface`, `--ink`, `--navy`, `--accent`, and related tokens define the restrained academic palette.
- **Interactions stay functional and quiet:** the protected app handles mobile navigation, language selection, and a scroll-reveal for `[data-reveal]` elements. Motion is limited to short interface transitions and respects `prefers-reduced-motion: reduce`.
- **CNAME** file sets the custom domain. Do not delete it.

## Design intent
This is a professor-facing undergraduate portfolio. Prefer verifiable evidence, direct repository links, plain language, and a restrained warm-white/navy visual system. Do not add fabricated metrics, placeholder publications, or decorative demos that compete with the academic content.
