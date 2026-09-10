# Auditoría técnica SEO — rpidev.com

Fecha: 2026-09-10
Alcance: home es/en, /subvenciones/ (+4 subpáginas), /legal, /privacy, /cookies.
Proyecto: Astro SSG, `trailingSlash: 'always'`, `i18n.routing.prefixDefaultLocale: false`, deploy en Plesk/nginx.

Score técnico global estimado: **68/100** (penalizado sobre todo por el hallazgo #1, Critical, y #2, High).

---

## 1. [Critical] URLs inexistentes devuelven HTTP 502 en vez de 404

**Evidencia:**
```
curl -sD - https://www.rpidev.com/this-page-does-not-exist-xyz/
HTTP/2 502
content-type: text/html
<title>502 Bad Gateway</title> ... "Web server received an invalid response..."

curl -sD - https://www.rpidev.com/en/subvenciones/
HTTP/2 502   (misma página de error de Plesk/nginx, no un 404 de Astro)
```
No existe `src/pages/404.astro` en el proyecto (`find src/pages -iname "404*"` no devuelve nada), y `dist/` tampoco contiene un `404.html`. El servidor Plesk/nginx está devolviendo la página de error genérica `error_docs/styles.css` con código 502 para cualquier ruta que Astro no generó como fichero estático, en lugar de un 404 real.

**Por qué importa:** Google trata 502 como error de servidor, no como "página no encontrada". Repetición de 502 en URLs rastreadas (enlaces rotos, hreflang mal escrito, URLs antiguas, typos) puede reducir la frecuencia de rastreo y generar avisos de "disponibilidad del host" en Search Console. Además da mala experiencia a usuarios y bots que llegan a una URL corvinada.

**Recomendación:**
- Crear `/home/ruben/Proyectos/rpidev-new/src/pages/404.astro` (Astro genera automáticamente `404.html` en build y Plesk/nginx debería sires ese fichero con status 404, no 502).
- Revisar la configuración de nginx en Plesk (Domains → rpidev.com → Apache & nginx Settings, o el vhost aplicado por `deploy.sh`) para confirmar `error_page 404 /404.html;` y que el fallback de rutas no generadas estáticamente no dependa de un backend/proxy caído (el 502 "Bad Gateway" sugiere que hay un proxy_pass a un backend inexistente para rutas no encontradas, típico de configuraciones Node/SSR que ya no aplican a un sitio 100% estático).

**Check de falsabilidad:** `curl -sD - -o /dev/null https://www.rpidev.com/ruta-inventada-12345/` — debe devolver `HTTP/2 404`, no 502.

**Indicador adelantado:** En Google Search Console → Páginas, desaparece la categoría "Error de servidor (5xx)" y las URLs rotas pasan a clasificarse como "No encontrada (404)".

---

## 2. [High] Conflicto robots.txt Disallow + meta noindex en /legal, /privacy, /cookies

**Evidencia:**
- `public/robots.txt` líneas 7-12: `Disallow: /legal`, `/privacy`, `/cookies` (y variantes `/en/...`).
- `src/pages/cookies.astro`, `legal.astro`, `privacy.astro` (línea 8 en cada uno): `noIndex={true}`, que en `Layout.astro` (línea 57-60) genera `<meta name="robots" content="noindex, nofollow">`.
- Confirmado en producción: `curl -s https://www.rpidev.com/cookies/` devuelve `<meta name="robots" content="noindex, nofollow">` con HTTP 200.
- El banner de cookies (`Layout.astro` línea 398, `LayoutStatic.astro` línea 151) enlaza a `/cookies` desde **todas** las páginas del sitio, así que la URL es descubrible internamente pese al Disallow.

**Por qué importa:** si robots.txt bloquea el rastreo, Googlebot nunca llega a leer el `<meta name="robots" content="noindex">` de la página — la directiva noindex se vuelve inútil. Si la URL tiene enlaces internos (como aquí, desde el banner de cookies en cada página), Google puede indexarla igualmente mostrando "No hay información disponible para esta página" en el SERP, en vez de excluirla limpiamente. Es el antipatrón documentado por Google: "no combines Disallow con noindex para la misma URL".

**Recomendación:** elegir un único mecanismo:
- Opción A (recomendada, más simple para 3 páginas legales): quitar las líneas `Disallow: /legal|/privacy|/cookies|/en/legal|/en/privacy|/en/cookies` de `public/robots.txt` y dejar que el `noindex` ya implementado en `legal.astro`, `privacy.astro`, `cookies.astro` haga su trabajo (esto sí es 100% efectivo).
- Opción B: si se prefiere mantener el bloqueo en robots.txt (p. ej. para no gastar presupuesto de rastreo), quitar el enlace del banner de cookies del `<body>` renderizado para bots o aceptar que la URL puede aparecer indexada sin snippet.

**Check de falsabilidad:** en Google Search Console → Inspección de URL sobre `https://www.rpidev.com/cookies/`, comprobar si aparece "Bloqueada por robots.txt" (confirma el conflicto) vs "Excluida por etiqueta noindex" (confirma que el fix funcionó). También: `site:rpidev.com/cookies` en Google para ver si aparece indexada sin descripción.

**Indicador adelantado:** en Search Console, la URL de `/cookies/`, `/legal/`, `/privacy/` pasa de "Bloqueada por robots.txt" a "Excluida por etiqueta 'noindex'" en el informe de cobertura/indexación.

---

## 3. [Medium] Paridad de contenido rota entre home ES y home EN (afecta a hreflang)

**Evidencia:**
- `src/pages/index.astro` importa y renderiza `<Subvenciones lang={lang} />` (sección de ayudas/subvenciones).
- `src/pages/en/index.astro` **no** importa ni renderiza ese componente — la home en inglés tiene una sección menos.
- `src/i18n/ui.ts` sigue definiendo `'nav.sections'` en inglés con 7 elementos incluyendo `'GRANTS'` (línea 141), igual que en español, pero la página EN solo renderiza 6 secciones. El componente `Nav.astro` genera botones de navegación con `data-section={idx}` de 0 a 6 basados en `nav.sections`, por lo que el índice de "CONTACT" (idx 6) ya no corresponde a ninguna sección real en la versión EN (la sección Contact real quedaría en el índice 5).

**Por qué importa:** Google usa hreflang para servir la versión equivalente en el idioma del usuario; si el contenido no es equivalente (falta una sección entera), la señal de "misma página, distinto idioma" es menos fiable y puede penalizar la percepción de calidad de la versión EN. Adicionalmente, es un bug funcional: el botón "CONTACT"/dot de navegación 7 en la versión inglesa apunta a un índice de sección que no existe.

**Recomendación:** en `/home/ruben/Proyectos/rpidev-new/src/pages/en/index.astro`, añadir el componente `Subvenciones`/`Grants` (o eliminar `'GRANTS'` de `nav.sections.en` en `src/i18n/ui.ts` línea 141 si se decide no traducir esa sección) para que el número de secciones coincida con el número de botones de navegación.

**Check de falsabilidad:** contar `<section>`/anclas reales en el DOM renderizado de `/en/` vs número de elementos en `nav.sections` (7 botones vs 6 secciones reales). Clicar el último botón de navegación en `/en/` en un navegador y comprobar que no hace scroll a ningún sitio útil.

**Indicador adelantado:** paridad 1:1 entre `nav.sections.length` y número de `<section>` renderizadas en cada idioma; en analítica, tasa de clic/scroll completo en la versión EN se iguala a la de ES.

---

## 4. [Medium] hreflang="en" de /subvenciones/* apunta a la propia URL en español

**Evidencia:** en las 6 páginas de `src/pages/subvenciones/*.astro` se pasa `hreflangEn={pageUrl}` a `LayoutStatic`, p. ej. `src/pages/subvenciones/kit-digital-granada.astro` línea 92: `hreflangEn={pageUrl}` donde `pageUrl = https://www.rpidev.com/subvenciones/kit-digital-granada/`. Esto genera:
```html
<link rel="alternate" hreflang="es" href=".../subvenciones/kit-digital-granada/" />
<link rel="alternate" hreflang="en" href=".../subvenciones/kit-digital-granada/" />
```
Nota positiva: esta solución evita correctamente que hreflang apunte a `/en/subvenciones/kit-digital-granada/`, URL que **no existe** y que hoy devuelve 502 (ver hallazgo #1) — así que el override actual es mejor que el fallback por defecto de `LayoutStatic.astro` (línea 64), que sí generaría esa URL rota si se omitiera `hreflangEn`.

**Por qué importa (matiz menor):** aun así, declarar `hreflang="en"` apuntando a una página cuyo contenido está en español es una señal semánticamente incorrecta (le dices a Google "esta es la versión en inglés" de una página que no lo es). Es más correcto simplemente **omitir** la etiqueta `hreflang="en"` para páginas sin traducción y dejar solo `es` + `x-default`.

**Recomendación:** en `LayoutStatic.astro` (líneas 63-65) y en las 6 páginas de `subvenciones/*.astro`, cambiar la prop `hreflangEn` por un booleano `hasEnglishVersion` (por defecto `false`) y renderizar el `<link rel="alternate" hreflang="en">` solo si es `true`. Mientras no se traduzcan estas páginas, no emitir esa etiqueta.

**Check de falsabilidad:** inspeccionar `<head>` de `https://www.rpidev.com/subvenciones/kit-digital-granada/` y verificar si hay una etiqueta `hreflang="en"` cuyo `href` coincide byte a byte con la URL en español actual.

**Indicador adelantado:** en Search Console → Segmentación internacional (o rich results test de hreflang), desaparecen los posibles avisos de "no return tag"/idioma inconsistente para estas URLs.

---

## 5. [Medium] CSP con `'unsafe-inline'` en `script-src` y `style-src`

**Evidencia:** `nginx-security-headers.conf` línea 13 y duplicado en `src/layouts/Layout.astro` línea 48 / `LayoutStatic.astro` línea 50:
```
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
```
Confirmado en cabeceras reales del sitio en producción (`curl -sD - https://www.rpidev.com/`).

**Por qué importa:** `'unsafe-inline'` anula gran parte de la protección de CSP contra XSS (permite ejecutar cualquier `<script>`/`<style>` inline inyectado). Es necesario hoy porque el sitio usa `<script is:inline>` (banner de cookies, bootstrap de GTM) y `<style>`/`<style is:inline>` sin nonce, tanto en `Layout.astro` como en `LayoutStatic.astro`.

**Recomendación:** generar un nonce por request (Astro con `output: 'server'` lo permitiría vía middleware) o, dado que el sitio es 100% estático, migrar los inline scripts/estilos a ficheros `.js`/`.css` con hash SHA-256 en la CSP (`script-src 'self' 'sha256-...' https://www.googletagmanager.com`), eliminando `'unsafe-inline'`. Aplicar en `nginx-security-headers.conf` y replicar exactamente en `Layout.astro`/`LayoutStatic.astro` (ver hallazgo #6 sobre duplicidad).

**Check de falsabilidad:** https://csp-evaluator.withgoogle.com/ sobre la cabecera actual — marcará `'unsafe-inline'` en script-src y style-src como hallazgo "High severity".

**Indicador adelantado:** CSP Evaluator deja de marcar `unsafe-inline` como severidad alta; Mozilla Observatory/SecurityHeaders.com sube de nota en el apartado CSP.

---

## 6. [Low] Cabeceras de seguridad duplicadas en 3 sitios (riesgo de divergencia)

**Evidencia:** la misma política de seguridad (CSP, X-Frame-Options, Permissions-Policy) está definida de forma independiente en:
1. `nginx-security-headers.conf` (cabeceras HTTP reales, confirmadas por curl en producción).
2. `src/layouts/Layout.astro` líneas 43-49 (meta tags equivalentes).
3. `src/layouts/LayoutStatic.astro` líneas 45-51 (mismos meta tags, copia independiente).

Adicionalmente, `X-Frame-Options` vía `<meta http-equiv>` **no tiene efecto en ningún navegador** (la especificación solo lo soporta como cabecera HTTP real); y `Content-Security-Policy` vía meta tag no puede aplicar la directiva `frame-ancestors` (los navegadores la ignoran en ese contexto). Es decir, esos meta tags concretos son inertes y solo la cabecera HTTP de nginx protege realmente.

**Por qué importa:** no es un riesgo de seguridad inmediato (la cabecera HTTP real ya está bien puesta), pero mantener 3 copias manuales de la misma política es una fuente segura de divergencia futura (alguien actualiza `nginx-security-headers.conf` y olvida los dos `.astro`, o viceversa), y los meta tags de X-Frame-Options/frame-ancestors dan una falsa sensación de estar protegidos por partida doble cuando en realidad no aportan nada.

**Recomendación:** eliminar `<meta http-equiv="X-Frame-Options">` de `Layout.astro` y `LayoutStatic.astro` (no hace nada, solo confunde en auditorías). Mantener el meta CSP solo si se quiere una protección de respaldo para entornos sin cabeceras HTTP (p. ej. `file://` o previsualizaciones), pero documentar que la fuente de verdad es `nginx-security-headers.conf`.

**Check de falsabilidad:** `curl -sD - https://www.rpidev.com/` vs `grep -o 'http-equiv="[^"]*"' dist/index.html` — comparar que ambas listas de cabeceras coincidan exactamente hoy (coinciden), y vigilar que seguirán coincidiendo tras el próximo cambio.

**Indicador adelantado:** ninguna herramienta de auditoría (Lighthouse, securityheaders.com) reporta "X-Frame-Options via meta tag has no effect" tras la limpieza.

---

## 7. [Low] Imágenes sin `width`/`height` → riesgo de CLS

**Evidencia:** `grep -o '<img[^>]*>' dist/index.html` — ninguna de las 21 etiquetas `<img>` del home (logo, 11 logos de portfolio en carrusel/grid, 9 en modal) declara atributos `width`/`height` ni `loading="lazy"`. Ejemplo:
```html
<img src="/logo-agropur.png" alt="Agropur logo" class="w-full h-full object-contain p-1">
```
El tamaño se fija solo por CSS (`w-full h-full` dentro de un contenedor), lo que mitiga parcialmente el problema si el contenedor padre ya tiene altura fija, pero no hay red de seguridad a nivel de atributo HTML.

**Por qué importa:** sin `width`/`height` (o `aspect-ratio` explícito), el navegador no puede reservar espacio antes de descargar la imagen, lo que puede generar Cumulative Layout Shift, especialmente en conexiones lentas o si el CSS tarda en aplicarse.

**Recomendación:** añadir `width`/`height` (o migrar a `<Image>` de `astro:assets`, que las infiere automáticamente) en los componentes que generan estas imágenes, previsiblemente `src/components/sections/Portfolio.astro` y `src/components/Nav.astro`/`NavStatic.astro` (logo).

**Check de falsabilidad:** Lighthouse/PageSpeed Insights → auditoría "Elementos de imagen sin `width` y `height` explícitos"; o `chrome://devtools` → Layout Shift regions durante la carga del home.

**Indicador adelantado:** CLS de campo (CrUX/PSI) para la home baja o se mantiene establemente por debajo de 0.1 tras el cambio; la auditoría de Lighthouse ya no lista imágenes sin dimensiones.

---

## 8. [Low] Fuentes de Google Fonts bloquean el render pese al preconnect

**Evidencia:** `Layout.astro`/`LayoutStatic.astro` cargan la fuente vía:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
...
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```
El `<link rel="stylesheet">` a un dominio externo es render-blocking por defecto; el `preconnect` reduce la latencia de conexión pero no elimina el bloqueo de renderizado del CSS de la fuente.

**Por qué importa:** puede retrasar el First Contentful Paint / Largest Contentful Paint si el LCP es texto con esta tipografía (el H1 del hero usa `IBM Plex Mono` previsiblemente), especialmente en redes móviles lentas.

**Recomendación:** autoalojar la fuente (descargar los `.woff2` de IBM Plex Mono y servirlos desde `/public/fonts/`, referenciados con `@font-face` en `src/styles/global.css`), eliminando la dependencia de `fonts.googleapis.com` en el critical path. Alternativa más simple: mantener Google Fonts pero cargar el CSS de forma asíncrona (`media="print" onload="this.media='all'"` o `rel="preload" as="style"`).

**Check de falsabilidad:** PageSpeed Insights / Lighthouse → auditoría "Elimina los recursos que bloquean el renderizado" señalará la hoja de estilos de fonts.googleapis.com.

**Indicador adelantado:** LCP de campo (CrUX) para móvil mejora o se mantiene ≤2.5s; Lighthouse dejar de listar la hoja de Google Fonts como render-blocking.

---

## 9. [Low] Meta description ligeramente larga y título en el límite de truncado

**Evidencia (home ES, `src/i18n/ui.ts` líneas 13-15):**
- `meta.title`: "RPIDev — Desarrollo web y automatización para autónomos y pymes en Granada" → 74 caracteres.
- `meta.description`: 174 caracteres (recomendado ≈155-160 para evitar truncado en la mayoría de resoluciones de SERP de escritorio).

**Por qué importa:** Google puede truncar o reescribir el snippet si excede el ancho de píxeles disponible; no es un error, pero reduce el control sobre el mensaje mostrado en el SERP.

**Recomendación:** acortar `meta.description` en `src/i18n/ui.ts` (es y en) a ~155 caracteres priorizando la propuesta de valor + CTA al principio.

**Check de falsabilidad:** https://serpsim.com/ o Search Console → rendimiento, snippet real mostrado en búsquedas de marca ("rpidev").

**Indicador adelantado:** el snippet mostrado en Google para la home coincide íntegramente con la descripción definida (sin puntos suspensivos ni reescritura automática).

---

## 10. [Info] Sin implementación de IndexNow (Bing, Yandex, Naver)

**Evidencia:** no se encontró clave IndexNow (`grep -rli indexnow src public` sin resultados) ni fichero de clave en `public/`. El sitio sí tiene `llms.txt` (200 OK) y sitemap correcto, pero no notifica activamente a buscadores vía IndexNow tras cada despliegue.

**Por qué importa (bajo, dado el tamaño del sitio):** con ~10 páginas y cambios poco frecuentes, el impacto es limitado; el rastreo normal vía sitemap + robots.txt ya cubre el caso de uso. IndexNow aceleraría la propagación a Bing/Yandex tras cambios puntuales (p. ej. actualización de fechas de convocatorias en `/subvenciones/`, que sí cambian con cierta frecuencia según se ve en `dateModified` de los schemas).

**Recomendación:** generar una clave IndexNow, publicarla en `public/<clave>.txt`, y añadir un paso a `deploy.sh` que haga `curl` a `https://api.indexnow.org/indexnow` con las URLs modificadas tras cada build (especialmente útil para las páginas de `/subvenciones/` que cambian estado de convocatorias).

**Check de falsabilidad:** `curl -s https://www.rpidev.com/<clave-indexnow>.txt` debe devolver 200 con la clave en texto plano una vez implementado.

**Indicador adelantado:** en Bing Webmaster Tools, aparece actividad de IndexNow y reducción del tiempo entre publicación y aparición en el índice de Bing para páginas de `/subvenciones/`.

---

## Aspectos verificados sin incidencias (Pass)

- **Sitemap**: `sitemap-index.xml` declarado en `robots.txt` y validado por el helper (`sitemap_discovery.py`) como `sitemapindex` válido, HTTP 200. Filtra correctamente `/legal`, `/privacy`, `/cookies` (`astro.config.mjs` líneas 22-25), consistente con el bloqueo en robots.txt.
- **robots.txt**: permite explícitamente `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `Google-Extended`, `OAI-SearchBot`, `PerplexityBot` y `llms.txt`; Googlebot y bingbot correctamente permitidos con reglas de recursos estáticos.
- **Redirecciones**: `http://` → `https://www.` y `https://rpidev.com` (sin www) → `https://www.rpidev.com` son saltos únicos con 301 (sin cadenas), y `https://www.rpidev.com/subvenciones` (sin barra final) redirige 301 a la versión con barra, consistente con `trailingSlash: 'always'`.
- **Canonicals**: todas las páginas de `/subvenciones/*` fijan `canonical` explícito con barra final coincidente con la URL real; home ES/EN usa `Astro.url.href` por defecto, verificado en `dist/index.html` como `https://www.rpidev.com/` correcto.
- **Renderizado**: sitio 100% estático (Astro SSG, sin `output: 'server'`). Verificado con `render_page.py --mode auto`: `is_spa: false`, contenido textual completo presente en el HTML crudo (sin necesidad de ejecutar JavaScript). No hay riesgo de indexación parcial por CSR.
- **Cabeceras de seguridad reales** (vía curl a producción): HSTS con `preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy` y `Cross-Origin-Resource-Policy` presentes y correctamente configurados.
- **Datos estructurados**: JSON-LD válido en `@graph` (LocalBusiness/ProfessionalService, Person, WebSite, WebPage, FAQPage) en `Layout.astro`, y `Article`/`BreadcrumbList`/`FAQPage` en páginas de `/subvenciones/`; no se detectaron errores de sintaxis JSON al inspeccionar el HTML generado.
- **Viewport/mobile**: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` presente en todas las plantillas.

---

## Resumen priorizado

| # | Hallazgo | Severidad |
|---|----------|-----------|
| 1 | URLs inexistentes devuelven 502 en vez de 404 | Critical |
| 2 | Disallow + noindex conflictivos en /legal /privacy /cookies | High |
| 3 | Home EN sin sección Subvenciones (paridad de contenido) | Medium |
| 4 | hreflang="en" autorreferenciado a URL en español en /subvenciones/* | Medium |
| 5 | CSP con `unsafe-inline` en script-src/style-src | Medium |
| 6 | Cabeceras de seguridad duplicadas en 3 ficheros, meta X-Frame-Options inerte | Low |
| 7 | Imágenes sin width/height (riesgo CLS) | Low |
| 8 | Google Fonts render-blocking pese a preconnect | Low |
| 9 | Meta description larga / título al límite | Low |
| 10 | Sin IndexNow implementado | Info |

No se ha aplicado ningún cambio de código; todos los hallazgos son diagnóstico.
