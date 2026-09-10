# Rendimiento y Core Web Vitals — rpidev.com

Método: PageSpeed Insights API (Lighthouse 13.x, lab data). **CrUX no tiene datos de campo** para ninguna de las 3 URLs (tráfico insuficiente) → todo lo aquí evaluado es lab data (mobile, throttling simulado), no percentil 75 real de usuarios. Complementa a Unlighthouse (`unlighthouse/ci-result.json`, `unlighthouse/reports/lighthouse.json`), que reporta scores 0.92–1.0 en todo el sitio; los datos de detalle de este informe explican de dónde salen los puntos perdidos en performance.

Páginas evaluadas: `/` (es), `/en`, `/subvenciones/kit-digital-granada/`.

## Resumen de puntuaciones (Lighthouse, mobile / desktop)

| Página | Perf mobile | LCP mobile | TBT mobile | CLS mobile | Perf desktop | LCP desktop |
|---|---|---|---|---|---|---|
| `/` (es) | 72 | 5.7 s | 160 ms | 0 | 90 | 0.9 s |
| `/en` | 66 | 6.6 s | 260 ms | 0 | 97 | 1.0 s |
| `/subvenciones/kit-digital-granada/` | 85 | 2.8 s | 330 ms | 0 | 99 | 0.7 s |

INP no es medible en lab (Lighthouse no lo emite); se usa TBT como proxy. CLS en lab es 0 en todas las páginas — no es un problema en las condiciones de test, ver hallazgo de imágenes sin dimensiones para el riesgo residual.

---

## Hallazgo 1: LCP mobile en pobre ("Poor") en home ES/EN por payload de imágenes de portfolio

**Severidad:** Alta

**Evidencia:**
- LCP mobile `/` = 5.7 s, `/en` = 6.6 s (umbral "Poor" >4.0 s). Desktop es bueno (0.9–1.0 s) — el problema es específico de mobile/red lenta.
- `resource-summary` (home): 21 requests, 1.245 MB totales, de los cuales 919 KB son imágenes (12 imágenes).
- `image-delivery-insight` señala 5 imágenes de logos de proyectos sin optimizar, todas con >95% de bytes desperdiciados por falta de resize/compresión:
  - `/logo_desguaces_valdeferrin.png` — 278 KB (277 KB "wasted")
  - `/SEOPilot.png` — 130 KB (129 KB "wasted")
  - `/choose-removebg-preview.png` — 110 KB (109 KB "wasted")
  - `/amacapricci.jpeg` — 93 KB (93 KB "wasted")
  - `/casvisol.png` — 81 KB (80 KB "wasted")
  Se sirven a tamaño completo (cientos de KB) para mostrarse como logos de 48×48 px en la grid de proyectos.

**Recomendación específica:**
1. Redimensionar y comprimir estos 5 (y el resto de logos del grid) a su tamaño real de render (~48–96 px con soporte @2x) y convertir a WebP/AVIF. Con Astro, usar `astro:assets` (`<Image>`/`getImage`) para que se generen automáticamente variantes optimizadas en build, en vez de servir los PNG/JPEG originales desde `public/`.
2. Confirmar que ninguna de estas imágenes de logos de terceros es el elemento LCP real; si el LCP es otra imagen (hero/nav), aplicar `fetchpriority="high"` y precarga (`<link rel="preload" as="image">`) a esa específicamente.

**Check de falsabilidad:** Volver a correr PSI mobile sobre `/` tras optimizar las imágenes; si el peso total de imágenes baja de ~919 KB a <150 KB y el LCP no baja de forma proporcional (objetivo <4.0 s, idealmente <2.5 s), la causa raíz no era el peso de imágenes y hay que revisar TTFB/render-blocking en su lugar.

**Indicador adelantado:** `total-byte-weight` y `resource-summary` (categoría Image) en el reporte Lighthouse/PSI de `/`; objetivo bajar de 1.245 MB a <400 KB de transferencia total.

---

## Hallazgo 2: CSS de Google Fonts y CSS crítico bloquean el render (~750-780 ms)

**Severidad:** Media-Alta

**Evidencia:**
- `render-blocking-insight` (mobile) en las 3 páginas:
  - `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono...` → 1.486 KB, **751–780 ms** de "wastedMs" (todas las páginas, mismo recurso, cargado vía `<link>` en `src/layouts/Layout.astro:117` / `LayoutStatic.astro:117`).
  - `https://www.rpidev.com/_astro/ui.BhDdk6US.css` → 8.49 KB, 200–278 ms wastedMs.
- En home ES, la auditoría `render-blocking-insight` (failed_audits) estima **1.560 ms** de ahorro potencial total en LCP.
- Ya existe `<link rel="preconnect" href="https://fonts.googleapis.com">` (línea 96/97 en ambos layouts), pero no hay preconnect a `fonts.gstatic.com` (origen real de los archivos de fuente, distinto dominio) ni `display=swap` está resolviendo el bloqueo del CSS en sí (el bloqueo es del `<link rel="stylesheet">`, no de la fuente).

**Recomendación específica:**
1. Añadir `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` junto al preconnect existente de `fonts.googleapis.com`.
2. Auto-hospedar IBM Plex Mono (descargar los `.woff2` y servirlos desde `/public/fonts/` con `@font-face` + `font-display: swap`) para eliminar por completo la dependencia de red externa síncrona; con una sola familia y 4-5 pesos esto es viable y elimina 2 round-trips (CSS de Google Fonts + descarga de la fuente desde otro origen).
3. Alternativamente, si se mantiene Google Fonts, cargar el CSS de forma no bloqueante (`media="print" onload="this.media='all'"` o `rel="preload" as="style"` + swap) para sacarlo de la cadena crítica.

**Check de falsabilidad:** Tras auto-hospedar o diferir la carga de la fuente, repetir PSI mobile; el audit `render-blocking-insight` debe pasar de "failed" a "passed" (score 0→1) y el ahorro estimado listado debe caer a 0 ms en ese recurso concreto. Si el LCP no mejora tras esto, el cuello de botella real eran las imágenes (Hallazgo 1), no las fuentes.

**Indicador adelantado:** `render-blocking-insight` wastedMs total en PSI para las 3 páginas; objetivo 0 ms.

---

## Hallazgo 3: Google Tag Manager + gtag.js duplican carga y consumen ~300 ms de main thread

**Severidad:** Media

**Evidencia:**
- `third-parties-insight` (idéntico patrón en las 3 páginas): entidad "Google Tag Manager" transfiere **297 KB** y consume **287–326 ms de main-thread time**, siendo con diferencia el mayor contribuyente de bloqueo de hilo principal (TBT mobile 160-330 ms en las páginas medidas).
- Se cargan **dos scripts separados**: `gtm.js?id=GTM-W65MZL7G` (120 KB) y, cuando GTM dispara gtag, `gtag/js?id=G-7RDSPSZ7XB` (177 KB) — el patrón habitual es que GTM cargue *un* contenedor que internamente gestione GA4 vía su propia plantilla, no cargar gtag.js por separado además del contenedor GTM completo.
- `long-tasks` (home ES mobile): tarea de 172 ms atribuida a `gtag/js` y 142 ms a `gtm.js`, ambas por encima del umbral de 50 ms recomendado para no degradar INP.

**Recomendación específica:**
1. Revisar la configuración del contenedor GTM (`GTM-W65MZL7G`) para confirmar si el tag de GA4 está duplicado (cargando `gtag/js` directamente en el DOM además de vía GTM) — si es así, eliminar la carga directa de `gtag/js` y dejar que GTM gestione GA4 internamente, o viceversa.
2. Cargar el snippet de GTM con `defer`/tras interacción (idle) en vez de en el `<head>` antes de cualquier otro script, cuando el consent-mode lo permita, para sacarlo de la ruta crítica de LCP/TBT.
3. Evaluar Partytown (ya disponible en el ecosistema Astro) para ejecutar GTM en un web worker y liberar el hilo principal.

**Check de falsabilidad:** Inspeccionar en `network-requests` de un nuevo PSI run si sigue apareciendo tanto `gtm.js` como `gtag/js` como requests separados; si tras la revisión del contenedor solo permanece uno de los dos y el `mainThreadTime` de "Google Tag Manager" baja de ~300 ms a <150 ms, se confirma la causa. Si el peso no baja, el contenedor no tenía duplicación y el coste es inherente a GTM+GA4.

**Indicador adelantado:** `third-parties-insight` mainThreadTime para la entidad "Google Tag Manager"; objetivo <150 ms.

---

## Hallazgo 4: Sin cache-control de larga duración para assets estáticos (imágenes)

**Severidad:** Media

**Evidencia:**
- `cache-insight` reporta `cacheLifetimeMs: 0` para todas las imágenes servidas desde `public/` (`logo_desguaces_valdeferrin.png`, `SEOPilot.png`, `choose-removebg-preview.png`, `casvisol.png`, `logo_blanco.webp`, etc.) en las 3 páginas.
- `public/_headers` solo define cabeceras de seguridad (HSTS, CSP, X-Frame-Options, etc.) — no hay ninguna regla `Cache-Control` para `/*.webp`, `/*.png`, `/*.jpg` ni para `/_astro/*`.

**Recomendación específica:** Añadir reglas en `public/_headers` (o en la config del hosting/CDN si aplica) del tipo:
```
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/*.webp
/*.png
/*.jpg
/*.jpeg
  Cache-Control: public, max-age=604800
```
Esto no mejora la primera carga (afecta a visitas repetidas / navegación entre páginas del sitio), pero es gratis y de bajo riesgo.

**Check de falsabilidad:** Repetir PSI y verificar que `cache-insight` deja de listar estos recursos con `cacheLifetimeMs: 0`; comprobar con `curl -I` que la respuesta incluye `Cache-Control` con `max-age` alto.

**Indicador adelantado:** Header `Cache-Control` presente con `max-age >= 604800` en respuestas de imágenes y `/_astro/*`.

---

## Hallazgo 5: Redirect 301 en `/en` añade ~800 ms antes de que empiece a cargar la página

**Severidad:** Media (solo afecta a la variante inglesa)

**Evidencia:**
- `network-requests` para `/en` muestra: `GET /en` → **301** (69 ms) → `GET /en/` → 200. `redirects` audit reporta **798 ms wastedMs** achacados a este salto.
- Consistente con la diferencia de LCP entre `/` (5.7 s) y `/en` (6.6 s): ~900 ms de diferencia, del mismo orden que el redirect.

**Recomendación específica:** Revisar el enrutamiento de Astro/hosting para que los enlaces internos y el `hreflang`/navegación apunten directamente a `/en/` (con barra final) y evitar el salto intermedio `/en` → `/en/`. Si `/en` sin barra es una URL que reciben enlaces externos, considerar servirla directamente en lugar de redirigir (o al menos que sea un único hop rápido, ya lo es, pero eliminar el hop es mejor).

**Check de falsabilidad:** `curl -I https://www.rpidev.com/en` no debe devolver 301, o si lo hace, el audit `redirects` en PSI debe desaparecer de `failed_audits`/`opportunities` tras el cambio.

**Indicador adelantado:** Ausencia del audit `redirects` en el reporte PSI de `/en`; TTFB/tiempo hasta primer byte del documento final.

---

## Hallazgo 6: Imagen del logo de navegación sin `width`/`height` (riesgo de CLS)

**Severidad:** Baja

**Evidencia:**
- `unsized-images` señala `<img src="/logo_blanco.webp">` sin atributos `width`/`height` explícitos en `src/components/Nav.astro:27` y `src/components/NavStatic.astro:43`, presente en todas las páginas del sitio.
- CLS medido en lab es 0 en las 3 páginas, por lo que en las condiciones de test no genera salto visible, pero es un riesgo latente (fuente lenta, conexión lenta, o cambio de layout del nav) no cubierto por el test actual.

**Recomendación específica:** Añadir `width` y `height` (o `aspect-ratio` vía CSS) al `<img>` del logo en ambos componentes, acorde a sus dimensiones reales renderizadas (clases `h-12 md:h-16 w-auto`), para que el navegador reserve el espacio antes de que cargue.

**Check de falsabilidad:** El audit `unsized-images` debe desaparecer de la lista de diagnostics/failed_audits en el siguiente PSI run.

**Indicador adelantado:** Presencia/ausencia del audit `unsized-images` en PSI.

---

## Hallazgo 7 (colateral, no estrictamente CWV): CSP bloquea pings de medición de gtag.js

**Severidad:** Informativo — no afecta LCP/INP/CLS, pero afecta a la fiabilidad de los datos de campo (CrUX/Analytics) usados para evaluar estos mismos Core Web Vitals

**Evidencia:**
- `errors-in-console` (home ES mobile): `gtag/js` intenta conectar a `https://stats.g.doubleclick.net/g/collect?...` y es bloqueado por la CSP: *"violates the following Content Security Policy directive: connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com"*.
- Confirmado en código: `connect-src` en `src/layouts/Layout.astro:48`, `LayoutStatic.astro:50` y `public/_headers` no incluye `https://stats.g.doubleclick.net` ni `https://*.google-analytics.com` (con wildcard) ni `https://*.analytics.google.com`.
- Esto puede explicar (parcialmente) por qué CrUX no tiene datos de campo para el dominio: si Analytics 4 no logra registrar hits en ciertos flujos, la telemetría propia del sitio también es incompleta (CrUX es independiente de GA, pero ambos dependen de la misma cadena de red/consent).

**Recomendación específica:** Añadir `https://stats.g.doubleclick.net` (y opcionalmente `https://*.google-analytics.com`, `https://*.analytics.google.com` con wildcard para cubrir subdominios regionales) a `connect-src` en la CSP, tanto en el `<meta>` de los layouts como en `public/_headers`.

**Check de falsabilidad:** Tras el cambio, `errors-in-console` no debe reportar violaciones de CSP relacionadas con `doubleclick.net` en un nuevo PSI run; verificar en DevTools > Network que la request a `/g/collect` devuelve 200/204 en vez de ser bloqueada.

**Indicador adelantado:** Ausencia de entradas CSP-violation en `errors-in-console` para dominios de Google Analytics/Doubleclick.

---

## Priorización (impacto esperado / esfuerzo)

1. **Alta / esfuerzo medio** — Hallazgo 1 (optimizar imágenes de logos de portfolio con `astro:assets`): mayor impacto esperado en LCP mobile de la home.
2. **Media-Alta / esfuerzo bajo-medio** — Hallazgo 2 (auto-hospedar o diferir Google Fonts): reduce render-blocking en las 3 páginas.
3. **Media / esfuerzo medio** — Hallazgo 3 (deduplicar GTM/gtag, considerar Partytown): reduce TBT/INP en todas las páginas.
4. **Media / esfuerzo bajo** — Hallazgo 4 (Cache-Control) y Hallazgo 5 (eliminar redirect `/en`): quick wins de bajo riesgo.
5. **Baja / esfuerzo trivial** — Hallazgo 6 (width/height en logo nav).
6. **Informativo** — Hallazgo 7 (CSP bloquea GA): no es CWV pero corrompe la medición; corregirlo antes de sacar conclusiones futuras basadas en CrUX/GA4.

No se ha aplicado ningún cambio de código; todos los hallazgos son de diagnóstico.
