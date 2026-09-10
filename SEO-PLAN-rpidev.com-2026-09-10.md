# Plan SEO — rpidev.com

**Fecha de auditoría:** 2026-09-10
**URL auditada:** https://www.rpidev.com (Astro SSG, i18n es/en, ~10 páginas)
**Fuentes:** `/seo audit` (11 agentes especialistas), Unlighthouse (7 rutas), Google Search Console/CrUX/PSI (Tier 2, propiedad `sc-domain:rpidev.com`), `/seo bing check` (bloqueado, sin API key), drift baseline capturada.

---

## 1. Resumen

**Puntuación global orientativa: 64/100** (no es un promedio mecánico — pondera severidad, tráfico real y coste de arreglo. Sub-puntuaciones donde el especialista dio una cifra explícita: Técnico 68/100, GEO/IA 78/100. El resto de áreas no emitieron un número — ver detalle en cada hallazgo).

- **El sitio tiene un tráfico de búsqueda casi nulo** (15 clics / 1.756 impresiones en 28 días, CTR 0,85%, posición media 11,2 — dato de GSC con `totals_complete: true`). Esto es el hecho más importante de toda la auditoría: **cualquier priorización debe filtrarse por este dato**, y así se ha hecho en la tabla de la sección 2.
- La base técnica es sólida para el tamaño del sitio (SSR real sin JS necesario, robots.txt correcto con bots de IA permitidos, sitemap válido, cabeceras de seguridad reales bien configuradas), pero varios **bugs concretos y baratos de arreglar** están dañando justamente las dos páginas con más impresiones reales: `/subvenciones/` (1.098 impr.) y `/subvenciones/ayudas-andalucia/` (586 impr.).
- El problema de mayor impacto potencial es que **la página dedicada a la consulta de mayor volumen ("kit digital granada", 219 impresiones) no está indexada**, mientras que Google muestra en su lugar el hub genérico con 0% de CTR.

No se ha aplicado ningún cambio de código durante esta auditoría — todo lo que sigue es diagnóstico y propuesta.

---

## 2. Acciones priorizadas

Orden por impacto/esfuerzo real (no por categoría), aplicando el filtro de tráfico real de GSC: las acciones que tocan `/subvenciones/`, `/subvenciones/ayudas-andalucia/` o la consulta "kit digital granada" (219 impr., la de mayor volumen del sitio) suben de prioridad; las que solo afectan a la home (29-31 impr.) o a páginas sin impresiones bajan, aunque su severidad aislada sea alta.

Esfuerzo: **XS** (minutos) · **S** (<1h) · **M** (1-4h) · **L** (>4h / requiere investigación o decisión de negocio).

| # | Prioridad | Hallazgo | Fichero/URL afectada | Esfuerzo |
|---|---|---|---|---|
| 1 | Crítica | `author`/`publisher` con `@id` colgante (sin `name`) en las 6 páginas de subvenciones — afecta a las 2 páginas con más impresiones reales | `src/pages/subvenciones/*.astro` (6 ficheros) | S |
| 2 | Crítica | `/subvenciones/kit-digital-granada/` no indexada pese a estar enlazada y en sitemap — es la página de la consulta de mayor volumen (219 impr.) | GSC (acción manual) | XS |
| 3 | Crítica | Imagen `og-default.jpg` (schema + OG + Twitter Card) devuelve 404 en producción | `public/images/og-default.jpg` (asset) | XS |
| 4 | Alta | `robots.txt` bloquea `/legal /privacy /cookies` pero esas páginas no llevan `noindex` real — antipatrón Disallow+noindex | `public/robots.txt` | XS |
| 5 | Alta | CTR 0,46% en `/subvenciones/` con 1.098 impresiones — muy por debajo del CTR esperable en posición 9-13; título mezcla "Granada y Aragón" | `src/pages/subvenciones/index.astro` | S |
| 6 | Alta | `llms.txt` no incluye ninguna de las 6 páginas de subvenciones (el contenido más citable del sitio) | `public/llms.txt` | XS |
| 7 | Crítica (infra) | URLs inexistentes devuelven `502` en vez de `404` — afecta salud de rastreo percibida por Google/bots IA | `src/pages/404.astro` + config nginx/Plesk | M |
| 8 | Media-Alta | Falta `charset=utf-8` en `Content-Type` HTTP → mojibake real confirmado en texto extraído | `nginx-security-headers.conf` / config Plesk | S |
| 9 | Media-Alta | CSP bloquea `region1.analytics.google.com` / `stats.g.doubleclick.net` → GA4/CrUX no miden con fiabilidad | `nginx-security-headers.conf`, `Layout.astro`, `LayoutStatic.astro` | XS |
| 10 | Alta (decisión) | `areaServed` incluye Zaragoza/Aragón sin ningún respaldo en el contenido visible — dilución de relevancia para Granada | `src/layouts/Layout.astro` | XS |
| 11 | Media | `Article` sin `image`; `LocalBusiness` sin `logo` | 6 páginas subvenciones + `Layout.astro` | S |
| 12 | Media | `hreflang="en"` autorreferenciado a la propia URL en español en subvenciones | `LayoutStatic.astro` + 6 páginas | S |
| 13 | Media | FAQ "¿tengo que adelantar el dinero?" con respuestas contradictorias en home vs. `pyme-digital-granada` | `index.astro`, `pyme-digital-granada.astro` | XS |
| 14 | Media | Consultas en posición 8-15 con impresiones ya significativas: "pymetur" (72 impr., pos 8,6), `/subvenciones/ayudas-andalucia/` (586 impr., pos 9,7), `/subvenciones/ayudas-aragon/` (61 impr., pos 8,2) | contenido + enlazado interno | M |
| 15 | Media | Home EN sin sección Subvenciones; `nav.sections.en` desalineada (7 botones, 6 secciones) | `src/pages/en/index.astro`, `src/i18n/ui.ts` | M |
| 16 | Media | Sin firma de autor visible en páginas de subvenciones (contenido YMYL-adjacent) | 6 páginas subvenciones | S |
| 17 | Media | Fechas "última verificación" con &gt;2 meses de antigüedad en páginas que se venden como "estado en tiempo real" | 6 páginas subvenciones | S |
| 18 | Media | LCP mobile "Poor" (5,7-6,6s) en home ES/EN por imágenes de portfolio sin optimizar — impacto bajado por el bajísimo tráfico de la home | `src/components/sections/Portfolio.astro` | M |
| 19 | Media | Google Fonts (IBM Plex Mono) bloquea render 750-1.560ms | `Layout.astro`, `LayoutStatic.astro` | M |
| 20 | Media | Sitemap sin ningún `<lastmod>` | `astro.config.mjs` | M |
| 21 | Alta (decisión) | Dirección física completa en schema (`Huétor Vega`) invisible en el HTML — contradicción de modelo SAB, ya expuesta también en `llms.txt` | `src/layouts/Layout.astro`, `public/llms.txt` | L (decisión) |
| 22 | Media | Sin `Cache-Control` de larga duración en imágenes/`_astro/*` | `public/_headers` | S |
| 23 | Media | Redirect 301 `/en` → `/en/` añade ~800ms | routing Astro / enlaces internos | S |
| 24 | Media | Sin `href="tel:"` clicable | componente de contacto/CTA | XS |
| 25 | Alta (conversión) | Hero móvil con ~400px de espacio vacío que empuja título/CTA fuera de la vista inicial | componente Hero (sección 1 del SPA) | M |
| 26 | Media | Banner de cookies solapa CTA secundario y footer en móvil | componente cookie banner | S |
| 27 | Media | Navegación principal como `role: button` sin `<a href>` real | `Nav.astro`, `NavStatic.astro` | M |
| 28 | Media | GTM + gtag.js cargados por duplicado (~300ms main thread) | contenedor GTM (fuera del repo) | M |
| 29 | Media-Alta (esfuerzo alto) | Contenido casi-programático en `ayudas-aragon`/`ayudas-andalucia` ("Verificar convocatoria vigente" x8) | `ayudas-aragon.astro`, `ayudas-andalucia.astro` | L |
| 30 | Baja (agrupado) | `width`/`height` en imágenes, URL "Inicio" del Breadcrumb inconsistente, meta description larga (174c), IndexNow, `geo` a 4 decimales, touch targets 30-35px, duplicado DOM sin `aria-hidden` | varios | S c/u |

### Oportunidades de CTR (impresiones altas, CTR bajo) — señaladas aparte

| Página/consulta | Impresiones (28d) | Clics | CTR | Posición |
|---|---|---|---|---|
| `/subvenciones/` (página) | 1.098 | 5 | 0,46% | 12,8 |
| "kit digital granada" (consulta) | 219 | 0 | 0% | 17,9 (posiciona con la página no dedicada) |
| "kit digital en granada" | 35 | 0 | 0% | 23,0 |
| "subvención kit digital granada" | 30 | 0 | 0% | 13,3 |
| "ayudas digitalización junta de andalucía" | 29 | 0 | 0% | 10,7 |
| "ayudas kit digital granada" | 28 | 0 | 0% | 12,5 |
| "kit digital andalucía" | 28 | 0 | 0% | 15,6 |

→ Acciones relacionadas: **#1** (schema roto en la página que recibe este tráfico), **#2** (indexar la página dedicada a "kit digital"), **#5** (reescribir snippet de `/subvenciones/`).

### Consultas en posición 8-15 (candidatas a top 10) — señaladas aparte

| Consulta / página | Posición | Impresiones | Clics |
|---|---|---|---|
| "pymetur" | 8,6 | 72 | 1 |
| `/subvenciones/ayudas-andalucia/` (página) | 9,7 | 586 | 8 |
| `/subvenciones/ayudas-aragon/` (página) | 8,2 | 61 | 0 |
| "ayudas digitalización junta de andalucía" | 10,7 | 29 | 0 |
| "ayudas kit digital granada" | 12,5 | 28 | 0 |
| "subvención kit digital granada" | 13,3 | 30 | 0 |

→ Acción relacionada: **#14**.

---

## 3. Instrucciones de aplicación

### #1 — Reparar `author`/`publisher` con `@id` colgante en subvenciones
**Qué cambiar:** en los 6 ficheros de `src/pages/subvenciones/` (`index.astro`, `pyme-digital-granada.astro`, `kit-digital-granada.astro`, `leader-digitalizacion.astro`, `ayudas-andalucia.astro`, `ayudas-aragon.astro`), sustituir el `author`/`publisher` del `articleSchema`:

```json
"author": { "@id": "https://www.rpidev.com/#founder" },
"publisher": { "@id": "https://www.rpidev.com/#organization" }
```

por objetos embebidos con `name`:

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
**Check de falsabilidad:** https://search.google.com/test/rich-results sobre cualquier URL de `/subvenciones/*` — hoy muestra advertencia de campo `name` faltante en `author`/`publisher`; tras el fix debe desaparecer.
**Indicador adelantado:** en GSC → Mejoras → Fragmentos enriquecidos, desaparición de errores de autor/editor no resuelto en 2-4 semanas tras el próximo rastreo.

---

### #2 — Indexar `/subvenciones/kit-digital-granada/`
**Qué cambiar:** nada en el código — el enlace interno ya existe (verificado: `/subvenciones/index.astro` la enlaza dos veces, líneas 310 y 315, y el HTML de `dist/` ya lo incluye). El problema es que Google no la ha rastreado en 7+ semanas pese a ello. Acción: en Search Console → Inspección de URL → `https://www.rpidev.com/subvenciones/kit-digital-granada/` → **Solicitar indexación**.
**Check de falsabilidad:** repetir la inspección de URL; `coverage_state` debe pasar de "URL is unknown to Google" a "Submitted and indexed".
**Indicador adelantado:** aparición de la URL en el informe de páginas de GSC Search Analytics (hoy no tiene ninguna fila).

---

### #3 — Subir `og-default.jpg`
**Qué cambiar:** añadir el fichero `public/images/og-default.jpg` (recomendado 1200×630px, JPG, &lt;1MB). No requiere ningún cambio de código — el JSON-LD y las meta OG ya apuntan a esa ruta.
**Check de falsabilidad:** `curl -sI https://www.rpidev.com/images/og-default.jpg` debe devolver `200` (hoy `404`).
**Indicador adelantado:** miniatura correcta al compartir la URL en WhatsApp/LinkedIn en &lt;24h.

---

### #4 — Quitar el conflicto Disallow + noindex
**Qué cambiar:** en `public/robots.txt`, eliminar estas 6 líneas:
```
Disallow: /legal
Disallow: /privacy
Disallow: /cookies
Disallow: /en/legal
Disallow: /en/privacy
Disallow: /en/cookies
```
y dejar que el `noIndex={true}` ya implementado en `legal.astro`, `privacy.astro`, `cookies.astro` haga su trabajo (Google necesita poder rastrear la página para leer el `noindex`).
**Check de falsabilidad:** en GSC → Inspección de URL sobre `/cookies/`, debe pasar de "Bloqueada por robots.txt" a "Excluida por etiqueta noindex".
**Indicador adelantado:** las 3 URLs dejan de aparecer como "Bloqueada por robots.txt" en el informe de páginas de GSC.

---

### #5 — Reescribir snippet de `/subvenciones/`
**Qué cambiar:** en `src/pages/subvenciones/index.astro` (líneas 96-97), el título actual mezcla dos regiones no contiguas ("Granada y Aragón"), lo que puede diluir la relevancia percibida para ambos públicos:
```
title="Ayudas y Subvenciones para Digitalizar tu Negocio [2026] | Granada y Aragón"
description="Estado real y verificado de las ayudas de digitalización: Kit Digital, LEADER, ayudas de Andalucía y Aragón. Qué está abierto hoy, cuánto cubre cada una y cómo solicitarlas. Valoración gratuita."
```
Propuesta (ajustar redacción final a gusto, manteniendo la idea): separar la promesa de valor de la mención de región, y adelantar el gancho de "qué está abierto hoy" en el título:
```
title="Qué Ayudas de Digitalización Están Abiertas Ahora [2026] | RPI Dev"
description="Kit Digital, LEADER, Pyme Digital: estado real y verificado, importes y plazos actualizados esta semana. Guías por Granada, Andalucía y Aragón. Valoración gratuita en 30 min."
```
**Check de falsabilidad:** repetir `gsc_query.py query --dimensions query --days 28` a las 4-6 semanas; el CTR de la página debería subir de 0,46% incluso sin cambio de posición.
**Indicador adelantado:** CTR de `/subvenciones/` en GSC subiendo hacia el 1-3% típico de posición 9-13.

---

### #6 — Añadir subvenciones a `llms.txt`
**Qué cambiar:** en `public/llms.txt`, añadir una sección tras "## Main Content":
```
## Ayudas y Subvenciones para Digitalización

- [Guía general: Ayudas y Subvenciones 2026](https://www.rpidev.com/subvenciones/)
- [Pyme Digital Granada](https://www.rpidev.com/subvenciones/pyme-digital-granada/)
- [Kit Digital Granada](https://www.rpidev.com/subvenciones/kit-digital-granada/)
- [LEADER Digitalización](https://www.rpidev.com/subvenciones/leader-digitalizacion/)
- [Ayudas Digitalización Andalucía](https://www.rpidev.com/subvenciones/ayudas-andalucia/)
- [Ayudas Digitalización Aragón](https://www.rpidev.com/subvenciones/ayudas-aragon/)
```
**Check de falsabilidad:** `curl https://www.rpidev.com/llms.txt | grep subvenciones` debe devolver ≥6 líneas.
**Indicador adelantado:** citación de estas páginas en ChatGPT/Perplexity al preguntar por Kit Digital Granada (prueba manual periódica).

---

### #7 — 502 → 404 en rutas inexistentes
**Qué cambiar:**
1. Crear `src/pages/404.astro` (Astro genera `404.html` automáticamente en build).
2. Revisar la configuración de nginx/Plesk (fuera del repo, en el panel de Plesk o el vhost usado por `deploy.sh`) para confirmar `error_page 404 /404.html;` y que ninguna ruta no estática dependa de un `proxy_pass` a un backend inexistente — el `502 Bad Gateway` actual es síntoma típico de un proxy mal configurado para un sitio 100% estático.
**Check de falsabilidad:** `curl -sD - -o /dev/null https://www.rpidev.com/ruta-inventada-12345/` debe devolver `404`, no `502`.
**Indicador adelantado:** en GSC → Estadísticas de rastreo, desaparece la categoría "Error de servidor (5xx)".

---

### #8 — `charset=utf-8` en `Content-Type`
**Qué cambiar:** en la configuración nginx/Plesk (`nginx-security-headers.conf` o el vhost), añadir:
```nginx
charset utf-8;
```
o forzar la cabecera:
```nginx
add_header Content-Type "text/html; charset=utf-8" always;
```
**Check de falsabilidad:** `curl -sI https://www.rpidev.com/ | grep -i charset` debe devolver `charset=utf-8`.
**Indicador adelantado:** el texto extraído por herramientas de scraping/IA deja de mostrar mojibake (`Ã³` en vez de `ó`).

---

### #9 — CSP: desbloquear medición de GA4
**Qué cambiar:** en `nginx-security-headers.conf`, `src/layouts/Layout.astro` y `src/layouts/LayoutStatic.astro`, ampliar `connect-src`:
```
connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net;
```
**Check de falsabilidad:** en DevTools → Network, la petición a `/g/collect` debe devolver `200`/`204` en vez de ser bloqueada por CSP.
**Indicador adelantado:** ausencia de violaciones CSP relacionadas con `doubleclick.net`/`analytics.google.com` en `errors-in-console` de un nuevo PSI run.

---

### #10 — `areaServed`: decidir Zaragoza/Aragón
**Qué cambiar (si se confirma que Granada es el único mercado real):** en `src/layouts/Layout.astro`, dentro del nodo `LocalBusiness`, quitar `Zaragoza`/`Aragón` de `areaServed`, dejando solo Granada/Andalucía/España. Si hay negocio real en Aragón, mantenerlo pero añadir alguna mención visible en el contenido que lo justifique.
**Decisión pendiente del usuario** antes de aplicar (afecta a estrategia de mercado, no es un bug puro).
**Check de falsabilidad:** ninguno automático — es coherencia contenido↔schema.
**Indicador adelantado:** si se retira, vigilar que no caigan las impresiones ya existentes en consultas de Aragón (61 impr. en `/subvenciones/ayudas-aragon/`, que vive en una página propia y no depende de este `areaServed` global).

---

### #11 — `Article.image` y `LocalBusiness.logo`
**Qué cambiar:** en los 6 `articleSchema` de subvenciones, añadir:
```json
"image": ["https://www.rpidev.com/images/og-default.jpg"]
```
(depende de #3). En `src/layouts/Layout.astro`, dentro de `LocalBusiness`:
```json
"logo": {
  "@type": "ImageObject",
  "url": "https://www.rpidev.com/favicon.png",
  "width": 500,
  "height": 500
}
```
**Check de falsabilidad:** Rich Results Test deja de avisar de "campo recomendado 'image'/'logo' ausente".
**Indicador adelantado:** aparición de logo en Knowledge Panel al buscar "RPI Dev" (semanas/meses).

---

### #12 — Quitar `hreflang="en"` autorreferenciado
**Qué cambiar:** en `LayoutStatic.astro` y en las 6 páginas de `subvenciones/*.astro`, sustituir la prop `hreflangEn={pageUrl}` por un booleano `hasEnglishVersion` (default `false`), renderizando `<link rel="alternate" hreflang="en">` solo si es `true`.
**Check de falsabilidad:** el `<head>` de `/subvenciones/kit-digital-granada/` no debe tener `hreflang="en"` apuntando a su propia URL en español.
**Indicador adelantado:** sin avisos de idioma inconsistente en herramientas de hreflang.

---

### #13 — Resolver conflicto de FAQ duplicado
**Qué cambiar:** en `index.astro` (o en `pyme-digital-granada.astro`), renombrar la pregunta del hub de `"¿Tengo que adelantar el dinero de la inversión?"` a algo más genérico, p. ej. `"¿Cómo funciona el pago de las ayudas: adelanto o bono?"`, para que no compita textualmente con la pregunta específica y con respuesta distinta de `pyme-digital-granada`.
**Check de falsabilidad:** `site:rpidev.com "tengo que adelantar el dinero"` no debe devolver 2 URLs con la misma pregunta exacta.
**Indicador adelantado:** CTR estable (no errático) en GSC para la consulta relacionada.

---

### #14 — Empujar consultas de posición 8-15 a top 10
**Qué cambiar:** reforzar contenido y enlazado interno hacia `/subvenciones/ayudas-andalucia/` (pos 9,7, 586 impr., ya con 8 clics) y `/subvenciones/ayudas-aragon/` (pos 8,2, 61 impr.) — añadir enlaces desde el hub y desde la home con texto ancla que incluya "pymetur"/"ayudas digitalización Andalucía".
**Check de falsabilidad:** repetir consulta GSC en 4-6 semanas; posición media debe bajar de 8-15 a top 10.
**Indicador adelantado:** aparición de clics en consultas hoy con impresiones pero 0 clics ("ayudas kit digital granada", "ayudas digitalización junta de andalucía").

---

### #15 — Paridad home EN
**Qué cambiar:** en `src/pages/en/index.astro`, añadir el componente `Subvenciones`/`Grants` que sí tiene la home ES, o si se decide no traducir esa sección, quitar `'GRANTS'` de `nav.sections.en` en `src/i18n/ui.ts` (línea ~141) para que el número de botones de navegación coincida con las secciones reales.
**Check de falsabilidad:** contar `<section>` renderizadas vs. `nav.sections.length` en `/en/` — deben coincidir.
**Indicador adelantado:** el último botón de navegación en `/en/` deja de apuntar a una sección inexistente.

---

### #16 — Firma de autor visible en subvenciones
**Qué cambiar:** añadir una línea visible tipo "Por Rubén Pérez Izuel — desarrollador web, proveedor técnico en proyectos de Kit Digital/LEADER" junto a la fecha de actualización, en las 6 páginas de subvenciones (bloque reutilizable, no requiere página nueva).
**Check de falsabilidad:** el HTML renderizado debe tener un elemento de texto visible (no `<meta>`, no `<script>`) con el nombre del autor.
**Indicador adelantado:** cualitativo — cómo citan estas páginas las herramientas de AI Overviews/Perplexity (atribuyen "rpidev.com" vs. atribuyen al autor).

---

### #17 — Actualizar fechas de verificación
**Qué cambiar:** revisar el estado real de cada programa (Kit Digital, LEADER, Andalucía, Aragón) y actualizar tanto el texto "Última verificación: [fecha]" como `dateModified` en el JSON-LD, en las 6 páginas de subvenciones. Establecer cadencia mensual mientras el Kit Digital siga "pendiente".
**Check de falsabilidad:** diferencia entre fecha mostrada y fecha actual &lt;4-6 semanas.
**Indicador adelantado:** ninguna cita de terceros señalando la página como desactualizada.

---

### #18-20, #22-24, #28 — Performance (LCP portfolio, fonts, sitemap lastmod, cache, redirect /en, GTM)
Ver el detalle completo con evidencia y snippets en `rpidev.com-audit/findings/performance.md` y `sitemap.md` (hallazgos 1-5 y hallazgo 1 respectivamente) — no se repite aquí para no duplicar contenido; cada uno incluye ya su propio check de falsabilidad e indicador adelantado. Prioridad relativa: dado el bajísimo tráfico de la home (29-31 impr./28 días), estas mejoras son correctas mantenerlas en el backlog pero no deben anteponerse a las acciones #1-#17.

---

### #21 — Modelo SAB: dirección visible o no
**Qué cambiar (decisión, no ejecutar sin confirmar):** la dirección de Huétor Vega está en el JSON-LD de `Layout.astro` y también en `public/llms.txt`, pero en ningún punto del HTML visible. Dos caminos:
- **(a)** Si el negocio funciona 100% remoto sin atención presencial: quitar `address` del schema (dejar solo `areaServed`) y quitar la dirección exacta de `llms.txt`, dejando solo ciudad/provincia.
- **(b)** Si se quiere dar de alta un Google Business Profile como SAB: la dirección debe quedar oculta al público en GBP (opción estándar de Google para SAB), pero entonces **tampoco debería publicarse en texto plano accesible como `llms.txt`**, que es públicamente legible por cualquier bot.
**Check de falsabilidad:** N/A — requiere decisión de negocio primero.
**Indicador adelantado:** N/A hasta la decisión.

---

### #25-27 — UX móvil (hero, cookies, nav)
Ver `rpidev.com-audit/findings/visual.md` hallazgos 1, 3 y 5 para evidencia visual (capturas en `rpidev.com-audit/screenshots/`) y recomendación detallada de cada uno.

---

### #29 — Contenido genérico en Aragón/Andalucía
Requiere investigación real de cifras y convocatorias vigentes (no es un cambio mecánico de código) — ver `content.md` hallazgo 3 para el patrón detectado y la recomendación de nivelar ambas páginas al estándar de `pyme-digital-granada.astro`.

---

### #30 — Ajustes menores agrupados
| Ajuste | Fichero | Snippet |
|---|---|---|
| `width`/`height` en imágenes | `Portfolio.astro`, `Nav.astro`, `NavStatic.astro` | añadir atributos o migrar a `astro:assets` `<Image>` |
| Breadcrumb "Inicio" inconsistente | 5 páginas subvenciones | normalizar `"item": siteUrl` → `` "item": `${siteUrl}/` `` |
| Meta description larga (174c) | `src/i18n/ui.ts` | acortar a ~155c |
| IndexNow no implementado | nuevo, `deploy.sh` | generar clave + `curl` a `api.indexnow.org` tras build |
| `geo` con 4 decimales | `Layout.astro` | ampliar a 5 decimales reales |
| Touch targets 30-35px | header móvil | padding hasta 48×48px mínimo |
| Duplicado DOM sin `aria-hidden` | carrusel proyectos | `aria-hidden="true"` en la copia del loop |

---

## 4. Dependiente de datos externos

No se ha podido completar por falta de acceso/credenciales — no son hallazgos del sitio, son bloqueos de la propia auditoría:

- **Bing Webmaster Tools:** sin API key configurada (`BING_WEBMASTER_API_KEY`) → paso 5 de esta auditoría (`/seo bing check`) no se pudo ejecutar. Alta a `https://www.bing.com/webmasters` y clave gratuita necesarias.
- **Moz API:** sin `MOZ_API_KEY` → no hay DA/PA, Spam Score, texto ancla ni dominios de referencia individuales; el perfil de backlinks queda en "datos insuficientes" (solo 1 de 7 factores de scoring disponible vía Common Crawl). Alta gratuita en `https://moz.com/products/api`.
- **GA4:** el ID de propiedad configurado en el entorno (`properties/523270049`) pertenece a otro sitio del mismo usuario (casvisol.com), no a rpidev.com. Falta el ID numérico correcto de la propiedad GA4 de rpidev.com (Admin → Configuración de la propiedad en GA4) para completar tráfico orgánico/páginas de aterrizaje/tendencia.
- **CrUX (Core Web Vitals de campo):** sin datos por volumen de tráfico Chrome insuficiente — no es corregible directamente, se resolverá de forma natural si crecen las impresiones/clics (hallazgo informativo, no accionable hoy).
- **Google Business Profile:** no se pudo verificar en vivo si ya existe un perfil (Google Search redirigió a una página de consentimiento inaccesible por fetch automatizado). Verificar manualmente buscando "RPI Dev Granada" en Google Maps antes de decidir la acción #21/#3 (local.md).
- **Verificación manual de la cita legal BOE-A-2026-1426** (Orden TDF/39/2026): confirmar en `boe.es` que el número y fecha son correctos, ya que sostiene el argumento central de 4 páginas simultáneamente.
- **Confirmación de posible "scroll-jacking"** en la home: la captura full-page no distinguió si el scroll es nativo o controlado por JS — requiere prueba manual en un móvil real.
- **Presencia en directorios (Yelp/BBB):** no verificado por fetch directo; de relevancia baja en el mercado español frente a GBP/Bing Places.

---

## 5. Descartado

Hallazgos identificados pero deliberadamente despriorizados, con motivo, para no reabrir el debate en la próxima auditoría:

- **Invertir en `FAQPage` schema** (añadir más preguntas, ampliar cobertura): Google retiró el rich result de FAQ para todos los sitios el 7 de mayo de 2026. El schema existente no hace daño y se mantiene, pero no es una inversión SEO prioritaria.
- **`AggregateRating`/`Review`:** correctamente ausente — no hay reseñas reales que citar. No añadir datos inventados bajo ningún concepto (riesgo de acción manual de Google).
- **Páginas de servicio dedicadas** ("desarrollo web Granada", "automatización pymes Granada" como URLs propias): identificado como el hallazgo de mayor severidad por SXO y Local SEO (explica por qué rpidev.com no aparece en absoluto en esas SERPs), pero implica crear páginas nuevas standalone, lo que choca con la preferencia ya registrada del usuario de no crear páginas nuevas sin confirmación explícita. **No se incluye como acción a ejecutar** — queda como decisión estratégica pendiente de plantear directamente al usuario en una conversación aparte, no como parte de este plan de aplicación de código.
- **RSL 1.0 / licencia de reutilización para bots de entrenamiento:** estándar emergente, no crítico en la fecha de esta auditoría; bajo coste pero sin urgencia.
- **Estrategia de contenido en YouTube:** el canal está enlazado en `sameAs` pero sin contenido de vídeo evidenciado; no se investiga más hasta confirmar si el canal está activo.
- **IndexNow:** con ~10 páginas y cambios poco frecuentes, el rastreo normal vía sitemap ya cubre el caso de uso; impacto bajo, se deja en backlog (ítem #30).
- **Optimización agresiva de performance en la home** más allá de lo ya listado en #18-19: la home recibe solo 29-31 impresiones/28 días; cualquier mejora de LCP ahí tiene techo de impacto bajo comparado con arreglar el schema/indexación de las páginas de subvenciones. Se mantiene en el plan (#18) pero con prioridad media, no alta, pese a que Lighthouse la marque como "Poor" en aislado.
- **Presencia en Yelp/BBB:** relevancia estructuralmente baja para un autónomo en España; se prioriza GBP y Bing Places en su lugar (ver sección 4).
- **Discrepancia Unlighthouse (0,92-1,0) vs. PSI mobile (66-85) en performance:** ambas herramientas usan Lighthouse pero con perfiles de throttling/configuración distintos; no se investiga la discrepancia en sí — se toma el dato de PSI (más conservador y con detalle de oportunidades) como referencia de trabajo, y Unlighthouse como confirmación de que ninguna página está objetivamente rota.
