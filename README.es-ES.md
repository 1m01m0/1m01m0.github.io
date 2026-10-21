# emo Academic Portfolio

Un portafolio estático, sin proceso de compilación y protegido por contraseña para solicitudes académicas. El archivo público contiene únicamente la puerta de acceso y un payload cifrado con AES-GCM; el marcado del portafolio y el código de ejecución se descifran en el navegador del visitante tras un desbloqueo exitoso.

## Diseño actual

- Diseño de información clásico de página de inicio académica (al estilo de tairanhe.com): nombre → barra de enlaces separados por tuberías → declaración de investigación → biografía → Objetivos / Intereses de investigación / Preguntas de investigación resaltados en negrita.
- Sistema editorial inspirado en revistas científicas: cejas de sección numeradas, separadores de línea fina.
- Orden de información orientado a profesores: introducción → Proyectos seleccionados → Educación → Habilidades → Contacto.
- Interfaz primordialmente en inglés con soporte para chino simplificado.
- Paleta de colores en tonos papel cálido, azul universitario y siena.
- Tipografía de exhibición serif de sistema (stack Iowan Old Style / Charter / Palatino), cuerpo sans-serif, micro-etiquetas mono; sin solicitudes de fuentes externas.
- Enlaces directos a dos repositorios públicos; sin conteos fabricados, artículos provisionales o demos 3D decorativas.
- Transiciones de revelado al hacer scroll, navegación responsiva, estados de enfoque de teclado y soporte para reducción de movimiento.

## Arquitectura

```text
.
├── index.html                 # Puerta de contraseña pública y payload cifrado
├── styles.css                # Estilos de la puerta y del portafolio académico
├── script.js                 # Ejecución de la puerta y montaje de la app protegida
├── tools/
│   ├── gate-template.html    # Plantilla fuente para la puerta pública
│   └── password-gate.mjs     # Utilidad para desempaquetar, empaquetar y rotar contraseñas
├── assets/
│   └── vendor/
│       └── lucide.min.js     # Iconos auto-alojados cargados tras el desbloqueo
└── CNAME                     # Dominio personalizado de GitHub Pages
```

El directorio `.private/` (ignorado) existe únicamente mientras se edita el contenido protegido:

```text
.private/
├── index.html                # Marcado del portafolio académico
└── script.js                 # Traducciones inglés/chino y comportamiento de la UI
```

## Vista previa

Sirva únicamente el sitio empaquetado:

```bash
python3 -m http.server 8080
```

Luego abra `http://localhost:8080`.

## Edición de contenido protegido

Nunca coloque la contraseña en archivos rastreados, argumentos de comandos, URLs o almacenamiento del navegador. Léala desde un prompt de shell oculto y expóngala únicamente a través del entorno del proceso actual:

```bash
read -s "SITE_PASSWORD?Site password: "
export SITE_PASSWORD
node tools/password-gate.mjs unpack
```

Edite `.private/index.html` y `.private/script.js`, y luego vuelva a empaquetar inmediatamente:

```bash
node tools/password-gate.mjs pack
unset SITE_PASSWORD
```

`pack` reescribe `index.html` y elimina `.private/` tras el éxito. No realice vistas previas, despliegues ni commits mientras `.private/` exista.

## Guía de contenido

Este sitio está destinado a profesores que revisan la solicitud de un estudiante de grado. Las nuevas secciones deben basarse en evidencias:

- Use un nombre real, título oficial del grado, fecha prevista de graduación y una declaración concisa de intereses de investigación.
- Vincule cada proyecto directamente al código, una demo, un informe o una contribución verificable.
- Agregue GPA, ranking, premios, publicaciones, supervisores o experiencia de investigación solo cuando los hechos estén confirmados.
- Evite métricas de popularidad, afirmaciones de rendimiento no sustentadas, publicaciones provisionales y proyectos propiedad de otras personas sin un enlace de contribución directa.

Adiciones útiles para el futuro, una vez disponibles, son un CV en PDF, fechas y roles de proyectos, una dirección de correo electrónico institucional y secciones de investigación/publicaciones respaldadas por material real.

## Nota de seguridad

El sitio utiliza PBKDF2-SHA-256 y AES-256-GCM. Esto evita que el marcado protegido se envíe como texto plano, pero una contraseña corta elegida por un humano sigue siendo vulnerable a ataques de fuerza bruta offline debido a que el payload cifrado es público. Utilice una contraseña única y de alta entropía para una protección significativa.

## Restricciones

- Sin gestor de paquetes, framework, empaquetador o paso de compilación.
- Mantener `CNAME`.
- Mantener Lucide auto-alojado y cargado solo después del desbloqueo.
- Preservar la navegación por teclado y `prefers-reduced-motion`.
