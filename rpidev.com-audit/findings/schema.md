# Auditoría Schema.org — rpidev.com

Fecha: 2026-09-10
Alcance: homepage (es/en), `/subvenciones/` + 5 páginas hijas, `/privacy`, `/legal`, `/cookies`.
Método: lectura de código fuente (`src/layouts/`, `src/pages/`) + verificación en HTML renderizado en producción (fetch directo, sin JS — el sitio es Astro estático, el JSON-LD se sirve server-side).

## Resumen ejecutivo

El sitio tiene una base de schema notablemente buena para un proyecto de este tamaño: `LocalBusiness`/`ProfessionalService` + `Person` + `WebSite` + `WebPage` en el layout principal, y `Article` + `BreadcrumbList` + `FAQPage` en las 5 páginas de subvenciones. Los bloques son JSON-LD, `@context` correcto, sin tipos deprecados (no hay `HowTo` ni `SpecialAnnouncement`).

El hallazgo más importante es estructural: las páginas de subvenciones (que usan `LayoutStatic.astro`) referencian `author`/`publisher` por `@id` a nodos (`#organization`, `#founder`) que **solo existen en el `@graph` de `Layout.astro`** (usado por la home), no en `LayoutStatic.astro`. Cada página se valida de forma independiente en Google Rich Results Test, así que esas referencias quedan "colgadas" (sin `name`) en todas las páginas de subvenciones.

También se detectó que la imagen usada como `image` en `LocalBusiness` y como `og:image`/`twitter:image` (`/images/og-default.jpg`) **devuelve 404 en producción** — `public/images/` está vacío en el repo.

## Detección de schema existente

| Página | Layout | Tipos JSON-LD detectados |
|---|---|---|
| `/` y `/en/` | `Layout.astro` | `LocalBusiness`+`ProfessionalService`, `Person`, `WebSite`, `WebPage`, `FAQPage` (todo en un `@graph`) |
| `/subvenciones/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` (3 bloques `<script>` sueltos) |
| `/subvenciones/pyme-digital-granada/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` (dentro de `<Fragment slot="schema">`) |
| `/subvenciones/kit-digital-granada/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` |
| `/subvenciones/leader-digitalizacion/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` |
| `/subvenciones/ayudas-andalucia/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` |
| `/subvenciones/ayudas-aragon/` | `LayoutStatic.astro` | `FAQPage`, `BreadcrumbList`, `Article` |
| `/privacy`, `/legal`, `/cookies` | `LayoutStatic.astro` | Ninguno (correcto: son `noindex` y no lo necesitan) |

Verificado contra el HTML servido en producción con fetch directo (`curl`/render_page.py `--mode never`): el JSON-LD renderizado coincide byte a byte con el código fuente en `/` y en `/subvenciones/pyme-digital-granada/` — no hay inyección client-side ni discrepancias SSR vs fuente.

---

## Hallazgo 1 — `author`/`publisher` por `@id` sin nodo embebido en páginas de subvenciones

**Severidad:** Critical

**Evidencia:**
En `src/pages/subvenciones/pyme-digital-granada.astro` (y de forma idéntica en `kit-digital-granada.astro`, `leader-digitalizacion.astro`, `ayudas-andalucia.astro`, `ayudas-aragon.astro`, `subvenciones/index.astro`):
```js
"author": { "@id": `${siteUrl}/#founder` },
"publisher": { "@id": `${siteUrl}/#organization` },
```
Estos `@id` solo se definen como nodos completos (`Person`/`Organization` con `name`, `url`, etc.) dentro del `@graph` de `src/layouts/Layout.astro`, que **no se usa** en estas páginas — usan `src/layouts/LayoutStatic.astro`, que no emite ningún `Organization`/`Person`/`WebSite` propio (solo `<slot name="schema" />`). Confirmado leyendo `LayoutStatic.astro` completo: no contiene JSON-LD propio.

Google valida cada URL de forma aislada; no resuelve referencias `@id` contra el JSON-LD de *otra* página. El resultado real en cada página de subvenciones es que `author` y `publisher` son objetos vacíos de facto (solo `@id`, sin `name`), lo que en Rich Results Test se reporta como campo `name` faltante en `author`/`publisher` de `Article`.

**Recomendación:** en cada uno de los 6 ficheros, sustituir el `@id` colgante por un objeto embebido (o añadir el nodo `Organization`/`Person` completo al `@graph` de la propia página). Opción más simple y consistente — reemplazar los objetos `author`/`publisher` en el `articleSchema` de cada página:

```json
"author": {
  "@type": "Person",
  "@id": "https://www.rpidev.com/#founder",
  "name": "Rubén Pérez Izuel",
  "url": "https://www.rpidev.com"
},
"publisher": {
  "@type": "Organization",
  "@id": "https://www.rpidev.com/#organization",
  "name": "RPI Dev",
  "url": "https://www.rpidev.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.rpidev.com/favicon.png",
    "width": 500,
    "height": 500
  }
}
```

**Ficheros a modificar:**
- `src/pages/subvenciones/index.astro` (líneas ~17-29, objeto `articleSchema`)
- `src/pages/subvenciones/pyme-digital-granada.astro` (líneas ~18-43)
- `src/pages/subvenciones/kit-digital-granada.astro`
- `src/pages/subvenciones/leader-digitalizacion.astro`
- `src/pages/subvenciones/ayudas-andalucia.astro`
- `src/pages/subvenciones/ayudas-aragon.astro`

Alternativa más escalable (no aplicada, solo sugerida): mover el `Organization`+`Person` embebido a una constante compartida (p. ej. `src/lib/schema.ts`) e importarla en los 6 ficheros, para no duplicar el bloque a mano cada vez.

**Check de falsabilidad:** pegar la URL de cualquier página hija de `/subvenciones/` en https://search.google.com/test/rich-results — hoy debería mostrar advertencia/error de tipo "Falta el campo 'name'" en `author` o `publisher` del bloque `Article`. Tras el fix, la validación debe pasar sin advertencias en esos campos.

**Indicador adelantado:** en Google Search Console → Mejoras → "Fragmentos enriquecidos" / "Elementos de acción de artículos", desaparición de los errores de "Elemento no válido" para el subtipo `author`/`publisher` en las URLs de `/subvenciones/*` en las 2-4 semanas tras el próximo rastreo.

---

## Hallazgo 2 — Imagen de referencia del schema y OG (`og-default.jpg`) devuelve 404 en producción

**Severidad:** Critical

**Evidencia:**
- `LocalBusiness.image` en `src/layouts/Layout.astro` (línea 151) apunta a `${siteUrl}/images/og-default.jpg`, la misma variable `ogImage` usada en `og:image` y `twitter:image`.
- `public/images/` está vacío en el repositorio (`find public/images -maxdepth 2` no devuelve ningún fichero).
- Verificado en producción: `curl -sI https://www.rpidev.com/images/og-default.jpg` → `HTTP/2 404`.

Esto invalida el campo `image` de `LocalBusiness` (Google puede ignorar la entidad completa como candidata a Local Business/Knowledge Panel por imagen rota) y rompe las previsualizaciones en redes sociales (WhatsApp, LinkedIn, Twitter/X) que dependen de la misma URL.

**Recomendación:** subir un archivo real a `public/images/og-default.jpg` (recomendado 1200×630px, <1MB, JPG). No requiere cambio de código — solo añadir el asset. El JSON-LD ya está preparado para consumirlo tal cual:
```json
"image": "https://www.rpidev.com/images/og-default.jpg"
```

**Fichero a modificar:** añadir `public/images/og-default.jpg` (asset, no código). Ninguna línea de `.astro` necesita cambios.

**Check de falsabilidad:** `curl -sI https://www.rpidev.com/images/og-default.jpg` debe devolver `200`. También validar con https://search.google.com/test/rich-results (aviso de imagen no accesible debería desaparecer) y con el Facebook Sharing Debugger / Twitter Card Validator.

**Indicador adelantado:** aparición de miniatura correcta al compartir la URL en WhatsApp/LinkedIn en menos de 24h tras subir el asset (los debuggers de OG cachean, pero un `curl` 200 es inmediato).

---

## Hallazgo 3 — `FAQPage` en home y en las 5 páginas de subvenciones

**Severidad:** Info

**Evidencia:** `FAQPage` presente en el `@graph` de `Layout.astro` (líneas 273-368) y en los 6 ficheros de `subvenciones/*` (bloque `faqSchema`).

Google retiró el rich result de FAQ para todos los sitios el 7 de mayo de 2026 (ampliación de la restricción de agosto 2023 a gobierno/salud). Esto ya no genera ningún fragmento enriquecido en el SERP de Google para ningún dominio. Cualquier beneficio en buscadores de IA/GEO (ChatGPT, Perplexity, AI Overviews) no está confirmado ni es medible de forma fiable hoy.

**Recomendación:** no es urgente eliminarlo (no hace daño, no hay penalización), pero no debe tratarse como una inversión SEO prioritaria ni reportarse como "tenemos rich snippets de FAQ". Si en el futuro se añade contenido de preguntas de usuarios reales (no marketing/FAQ genérica), usar `QAPage` en su lugar, que sí tiene rich result activo.

No se incluye JSON-LD de sustitución: la recomendación es mantener el `FAQPage` existente sin más inversión, no retirarlo ni ampliarlo.

**Check de falsabilidad:** en https://search.google.com/test/rich-results, el bloque `FAQPage` se sigue detectando como "válido" pero ya no aparece ningún resultado de tipo "Preguntas frecuentes" en la sección de vista previa de resultados enriquecidos elegibles.

**Indicador adelantado:** en Search Console → Mejoras → "Preguntas frecuentes", el gráfico de impresiones de ese rich result debería estar plano o en descenso desde mayo de 2026 (confirmando que ya no aporta CTR incremental).

---

## Hallazgo 4 — `Article` sin propiedad `image` en las 6 páginas de subvenciones

**Severidad:** Medium

**Evidencia:** en los 6 objetos `articleSchema` (`subvenciones/index.astro` y las 5 páginas hijas) no hay ninguna propiedad `"image"`. Google recomienda `image` como propiedad para `Article`/elegibilidad de vista enriquecida (mínimo 1200px de ancho, ratio 16:9, 4:3 o 1:1).

**Recomendación:** añadir `image` a cada `articleSchema`, apuntando a una imagen representativa de cada guía (o, como mínimo viable, la OG image genérica una vez esté publicada — Hallazgo 2):
```json
"image": [
  "https://www.rpidev.com/images/og-default.jpg"
]
```
Ideal a medio plazo: una imagen específica por guía (ej. `/images/subvenciones/pyme-digital-granada-og.jpg`) para mejorar CTR en Google Discover/Imágenes.

**Fichero a modificar:** el objeto `articleSchema` en cada uno de los 6 ficheros ya listados en el Hallazgo 1.

**Check de falsabilidad:** Rich Results Test sobre cada URL de `/subvenciones/*` — debe dejar de mostrar el aviso "Falta el campo recomendado 'image'" en el bloque `Article`.

**Indicador adelantado:** aparición de las páginas de subvenciones en el informe de Search Console "Google Discover" o "Búsqueda de imágenes" en las semanas siguientes al rastreo (actualmente no deberían aparecer ahí por falta de imagen asociada).

---

## Hallazgo 5 — `Organization`/`LocalBusiness` sin propiedad `logo`

**Severidad:** Medium

**Evidencia:** el nodo `LocalBusiness`/`ProfessionalService` en `Layout.astro` tiene `image` pero no `logo`. `logo` es la propiedad que Google usa para el logo en el Knowledge Panel y en resultados de Organization (requiere `ImageObject` con dimensiones idealmente ≥112×112px, fondo no transparente recomendado). `public/favicon.png` (500×500) es un candidato válido ya existente en el repo.

**Recomendación:** añadir dentro del nodo `LocalBusiness` en `Layout.astro`:
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://www.rpidev.com/favicon.png",
  "width": 500,
  "height": 500
}
```

**Fichero a modificar:** `src/layouts/Layout.astro`, dentro del objeto `@type: ["LocalBusiness","ProfessionalService"]` (aprox. línea 151, junto a `"image"`).

**Check de falsabilidad:** Rich Results Test sobre `https://www.rpidev.com/` debe mostrar `logo` como propiedad reconocida del tipo `Organization`/`LocalBusiness` sin advertencias.

**Indicador adelantado:** aparición del logo en el Knowledge Panel de Google al buscar "RPI Dev" o "RPIDev Granada" (puede tardar semanas/meses en indexarse; no es inmediato).

---

## Hallazgo 6 — Inconsistencia en la URL del `ListItem` "Inicio" del `BreadcrumbList`

**Severidad:** Low

**Evidencia:**
- `pyme-digital-granada.astro`: `"item": `${siteUrl}/`` (con barra final)
- `kit-digital-granada.astro`, `leader-digitalizacion.astro`, `ayudas-andalucia.astro`, `ayudas-aragon.astro`, `subvenciones/index.astro`: `"item": siteUrl` (sin barra final)

El proyecto tiene `trailingSlash: 'always'` en `astro.config.mjs`. En la práctica, para la raíz `/` ambas formas (`https://www.rpidev.com` y `https://www.rpidev.com/`) apuntan al mismo recurso y la home responde `200` en ambos casos (verificado con `curl -sI`), así que no es un error funcional, pero conviene homogeneizar por consistencia y para evitar señales mixtas de URL canónica.

**Recomendación:** normalizar todos los `ListItem` de "Inicio" a `` `${siteUrl}/` `` en los 5 ficheros que usan `siteUrl` a secas.

**Fichero a modificar:** `src/pages/subvenciones/kit-digital-granada.astro`, `leader-digitalizacion.astro`, `ayudas-andalucia.astro`, `ayudas-aragon.astro`, `index.astro` (línea `"item": siteUrl` → `` "item": `${siteUrl}/` ``).

**Check de falsabilidad:** diff de código; no requiere validación externa (es un cambio cosmético de consistencia, no de corrección funcional).

**Indicador adelantado:** ninguno medible en SERP; es una mejora de higiene de datos, no de rendimiento.

---

## Hallazgo 7 — No hay `AggregateRating`/`Review` (correcto, no aplicar)

**Severidad:** Info

**Evidencia:** revisado `src/components/sections/Portfolio.astro` (listado de proyectos con logos de clientes) — no hay testimonios, valoraciones ni reseñas reales visibles en el sitio.

**Recomendación:** **no añadir** `AggregateRating`/`Review` sin datos reales — sería contenido inventado y viola las políticas de datos estructurados de Google (riesgo de acción manual). Si en el futuro se recopilan reseñas reales (Google Business Profile, testimonios verificables de clientes), entonces sí se puede añadir `AggregateRating` al nodo `LocalBusiness`, citando la fuente real de las valoraciones.

No se incluye JSON-LD porque no hay datos que respaldarlo. Esto es una anotación de "no hacer", no una tarea pendiente.

**Check de falsabilidad:** N/A (ausencia de dato es correcta).

**Indicador adelantado:** N/A.

---

## Notas adicionales (fuera del alcance estricto de JSON-LD, relacionadas)

- `pyme-digital-granada.astro` inyecta `<meta property="article:published_time">` y `<meta property="article:modified_time">` (Open Graph), pero `LayoutStatic.astro` fija `<meta property="og:type" content="website" />` de forma fija — Open Graph exige `og:type="article"` para que esas propiedades `article:*` sean válidas según la spec de Open Graph. No es JSON-LD, pero es inconsistente con el propio `Article` schema de la página. Si se decide corregir, habría que añadir un prop `ogType` opcional a `LayoutStatic.astro`.

## Resumen de acciones priorizadas

| # | Hallazgo | Severidad | Fichero(s) |
|---|---|---|---|
| 1 | `author`/`publisher` colgantes en subvenciones | Critical | 6 páginas en `src/pages/subvenciones/` |
| 2 | `og-default.jpg` 404 | Critical | `public/images/og-default.jpg` (asset) |
| 4 | `Article` sin `image` | Medium | mismos 6 ficheros del Hallazgo 1 |
| 5 | `LocalBusiness` sin `logo` | Medium | `src/layouts/Layout.astro` |
| 6 | Inconsistencia URL "Inicio" en Breadcrumb | Low | 5 páginas en `src/pages/subvenciones/` |
| 3 | `FAQPage` sin beneficio SERP | Info | homepage + subvenciones (no tocar) |
| 7 | Sin `AggregateRating` (correcto) | Info | ninguno (no aplicar) |

No se ha modificado ningún fichero del repositorio; todo el contenido de este informe es diagnóstico y JSON-LD propuesto para copiar manualmente.
