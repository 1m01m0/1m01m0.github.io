# emo Academic Portfolio

A zero-build, password-protected static portfolio for academic applications. The public file contains only the access gate and an AES-GCM encrypted payload; portfolio markup and runtime code are decrypted in the visitor's browser after a successful unlock.

## Preview

Serve only the packed site:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Current design

- Classic academic-homepage information layout (in the spirit of tairanhe.com): name → pipe-separated link bar → research statement → bio → bold-labeled Goal / Research Interest / Research Question
- Journal-inspired editorial system: numbered section eyebrows, hairline separators
- Professor-facing information order: intro → Selected Projects → Education → Skills → Contact
- English-first interface with Simplified Chinese support
- Warm-paper, collegiate-navy, and sienna palette
- System serif display type (Iowan Old Style / Charter / Palatino stack), sans body, mono micro-labels; no external font requests
- Direct links to two public repositories; no fabricated counts, placeholder papers, or decorative 3D demos
- Scroll-reveal transitions, responsive navigation, keyboard focus states, and reduced-motion support

## Architecture

```text
.
├── index.html                 # Public password gate and encrypted payload
├── styles.css                # Gate and academic portfolio styles
├── script.js                 # Gate runtime and protected-app mounting
├── tools/
│   ├── gate-template.html    # Source template for the public gate
│   └── password-gate.mjs     # Unpack, pack, and password rotation utility
├── assets/
│   └── vendor/
│       └── lucide.min.js     # Self-hosted icons loaded after unlock
└── CNAME                     # GitHub Pages custom domain
```

The ignored `.private/` directory exists only while editing protected content:

```text
.private/
├── index.html                # Academic portfolio markup
└── script.js                 # English/Chinese translations and UI behavior
```

## Editing protected content

Never place the password in tracked files, command arguments, URLs, or browser storage. Read it from a hidden shell prompt and expose it only through the current process environment:

```bash
read -s "SITE_PASSWORD?Site password: "
export SITE_PASSWORD
node tools/password-gate.mjs unpack
```

Edit `.private/index.html` and `.private/script.js`, then repack immediately:

```bash
node tools/password-gate.mjs pack
unset SITE_PASSWORD
```

`pack` rewrites `index.html` and deletes `.private/` after success. Do not preview, deploy, or commit while `.private/` exists.

## Content guidance

This site is intended for professors reviewing an undergraduate applicant. New sections should be evidence-led:

- Use a real name, official degree title, expected graduation date, and a concise research-interest statement.
- Link each project directly to code, a demo, a report, or a verifiable contribution.
- Add GPA, rank, awards, publications, supervisors, or research experience only when the facts are confirmed.
- Avoid popularity metrics, unsupported performance claims, placeholder publications, and projects owned by other people without a direct contribution link.

Useful next additions, once available, are a PDF CV, project dates and roles, a school email address, and research/publication sections backed by real material.

## Security note

The site uses PBKDF2-SHA-256 and AES-256-GCM. This prevents protected markup from being shipped as plaintext, but a short human-chosen password is still vulnerable to offline guessing because the encrypted payload is public. Use a unique, high-entropy password for meaningful protection.

## Constraints

- No package manager, framework, bundler, or build step
- Keep `CNAME`
- Keep Lucide self-hosted and loaded only after unlock
- Preserve keyboard navigation and `prefers-reduced-motion`
