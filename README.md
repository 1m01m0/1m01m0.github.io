# emo Academic Portfolio

A static academic portfolio with a browser-side password gate. The public page contains an AES-GCM encrypted bundle; the visitor's browser decrypts the portfolio markup and application script after a successful unlock.

[Visit the site](https://emohomepage.ccwu.cc) · [Report an issue](https://github.com/1m01m0/1m01m0.github.io/issues)

## Overview

The site is designed for academic applications, with an English-first interface and Simplified Chinese support. Its visual system uses a warm-paper background, navy typography, system fonts, restrained transitions, and self-hosted icons.

There is no framework, package manager, build service, or backend. Public HTML, CSS, JavaScript, and assets can be served by GitHub Pages or another static host. Protected content is maintained through the included Node.js utility.

## Preview locally

Requirements: Git, Python 3 for the example server, and a browser supporting Web Crypto. Node.js is needed only for maintaining the encrypted bundle; the maintenance utility uses built-in modules.

```bash
git clone https://github.com/1m01m0/1m01m0.github.io.git
cd 1m01m0.github.io
python3 -m http.server 8080 --bind 127.0.0.1
```

Open <http://localhost:8080> and enter the site password. Use HTTPS when hosting remotely. The repository does not provide the password, and previewing the gate does not require decrypting the protected source files.

**Serve only the packed site.** Stop any preview server before unpacking protected content; never serve or deploy the repository while `.private/` exists.

## Edit protected content

Use a hidden prompt rather than placing a password in a command, tracked file, URL, or browser storage. The following prompt syntax is for **zsh**:

```zsh
read -s "SITE_PASSWORD?Site password: "
export SITE_PASSWORD
node tools/password-gate.mjs unpack
```

Edit `.private/index.html` and `.private/script.js`. The latter holds the protected application's behavior and translations. Then repack:

```zsh
node tools/password-gate.mjs pack
unset SITE_PASSWORD
```

A successful `pack` rewrites `index.html` and removes `.private/`. Confirm it is gone before restarting the preview server or publishing:

```bash
test ! -d .private
git diff --check
git status --short
```

If packing fails, keep the server stopped, resolve the error, and repack before deployment. Do not commit plaintext sources.

## Maintain the gate

| Command | Effect |
| --- | --- |
| `node tools/password-gate.mjs help` | Show supported commands and password inputs |
| `node tools/password-gate.mjs refresh` | Rebuild the public gate from its template without changing the encrypted payload |
| `node tools/password-gate.mjs unpack` | Decrypt protected sources into `.private/` using `SITE_PASSWORD` |
| `node tools/password-gate.mjs pack` | Encrypt edited sources using `SITE_PASSWORD`, then remove `.private/` |
| `node tools/password-gate.mjs rotate` | Re-encrypt the current bundle using `SITE_PASSWORD` and `NEW_SITE_PASSWORD` without writing plaintext files |

To rotate the password, read both values with hidden prompts in zsh:

```zsh
read -s "SITE_PASSWORD?Current password: "
read -s "NEW_SITE_PASSWORD?New password: "
export SITE_PASSWORD NEW_SITE_PASSWORD
node tools/password-gate.mjs rotate
unset SITE_PASSWORD NEW_SITE_PASSWORD
```

Choose a unique, high-entropy password of at least 16 characters. Rotation affects the newly published bundle; it cannot revoke copies of old bundles or content already decrypted by a visitor.

## Repository layout

```text
index.html                # Public gate and encrypted payload
styles.css                # Gate and portfolio styles
script.js                 # Public decryption and mounting runtime
tools/
├── gate-template.html    # Public gate source template
└── password-gate.mjs     # Encryption maintenance utility
assets/vendor/            # Self-hosted runtime dependencies
CNAME                     # Custom domain for GitHub Pages
.private/                 # Temporary, ignored plaintext after unpack
```

Change the public gate in `tools/gate-template.html`, then run `refresh`. Edit public styles in `styles.css`. Preserve `CNAME`, load Lucide only after unlock, and retain keyboard navigation and reduced-motion behavior. See [AGENTS.md](AGENTS.md) for maintenance conventions and [vendor notes](assets/vendor/README.md) for third-party assets.

## Content and publishing

Present verifiable academic evidence: a concise research statement, project contributions, education, skills, and contact details. Add publications, awards, rankings, or metrics only when confirmed, with direct supporting links where available.

Publish the packed static files using the repository's GitHub Pages configuration. Keep `.private/` excluded from all deployment inputs; `.gitignore` alone does not stop a local server from exposing files. Preserve the custom domain unless intentionally migrating the site.

## Security model and limitations

The implementation uses PBKDF2-SHA-256 and AES-256-GCM. Encryption conceals the protected bundle until the password is supplied, but the ciphertext is public and can be copied for offline guessing. The gate has no server-side identity checks or password recovery. Public styles, assets, and repository history are outside the encrypted bundle.

Treat it as a static sharing mechanism, and do not publish secrets or content requiring revocable, per-user access. Changes to encrypted content require the current password; public gate and style maintenance do not.

## Verification and contribution

For documentation changes, check links and `git diff --check`. For site changes, preview the packed result and verify the wrong-password state, successful unlock, responsive navigation, language switching, keyboard focus, and reduced-motion behavior. These interactive checks require the site password and are not implied by a successful static build.

When reporting a problem, include browser/version and reproduction steps without the password or protected content.

## License

The repository does not currently include a project-wide license file. Ask the maintainer about reuse or redistribution; bundled third-party assets retain their own notices and terms.
