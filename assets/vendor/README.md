# Vendored runtime assets

These files are pinned locally so the protected page does not execute third-party CDN scripts after decryption.

| File | Version / source | SHA-256 | License |
| --- | --- | --- | --- |
| `three.module.js` | Three.js 0.160.0, `https://unpkg.com/three@0.160.0/build/three.module.js` | `76dea8151bc9352aef3528b4262e249b2604f62543828328db978d060d61a495` | MIT |
| `lucide.min.js` | Lucide 0.321.0, `https://unpkg.com/lucide@0.321.0/dist/umd/lucide.min.js` | `9b53fe63c16b5c3390e9101a519b8e831614b9fd2164a0447b55613549d90f4d` | ISC |
| `earth-blue-marble.jpg` | three-globe 2.45.2 example texture, `https://unpkg.com/three-globe@2.45.2/example/img/earth-blue-marble.jpg` | `228deba2e4b600146bdcb6cfa359b8ead6aacc2b1c13550a29cd82824cfa1c01` | Upstream example asset |

When replacing a file, update its source URL, checksum, and the matching path in `script.js` or the protected app source.
