# Auditoría de Sitemap — rpidev.com

Fuente analizada: `dist/sitemap-index.xml` + `dist/sitemap-0.xml` (build de `astro.config.mjs` con `@astrojs/sitemap`), confirmados en vivo con `curl` contra `https://www.rpidev.com`. El build local (jul 20 2026) es más reciente que cualquier cambio en `src/pages` (sin ficheros `src` más nuevos que el build), por lo que refleja el estado actual.

## Resumen
- 8 URLs en `sitemap-0.xml`, todas devuelven HTTP 200 en producción. 0 URLs excluidas incorrectamente, 0 huérfanas. Formato XML válido (bien formado, un único `<url>` por línea, namespace correcto).
- No hay `priority` ni `changefreq` (correcto, Google los ignora — nada que corregir).
- **No hay ningún `<lastmod>` en el sitemap** (hallazgo principal, ver abajo).

---

## Hallazgo 1 — Ausencia total de `lastmod`
- **Severidad:** Media
- **Evidencia:** `grep -o "lastmod" dist/sitemap-0.xml` → 0 resultados. Las 8 entradas `<url>` no incluyen `<lastmod>`. Astro/`@astrojs/sitemap` no lo añade por defecto para páginas `.astro` sin metadata explícita; ninguna página del proyecto pasa `lastmod` a la integración (no hay `serialize()` ni frontmatter con fecha en `astro.config.mjs`).
- **Recomendación:** Añadir `lastmod` real por página usando la config `serialize` de `@astrojs/sitemap` (o generando el sitemap con datos propios), tomando como fuente las fechas ya existentes en el JSON-LD de cada página de `/subvenciones/*` (`dateModified`, ver hallazgo 4) para las páginas de subvenciones, y la fecha de último cambio de contenido real para `/` y `/en/`. No usar `new Date()` en cada build (fecha falsa/idéntica en todas las URLs, señal de baja confianza para Google).
- **Check de falsabilidad:** Volver a generar el build (`npm run build`) y comprobar si `dist/sitemap-0.xml` contiene `<lastmod>`; si aparece, el hallazgo queda resuelto.
- **Indicador adelantado:** En Google Search Console → Sitemaps, la fecha "Enviado"/"Última lectura" no cambia de comportamiento por esto (lastmod es solo una señal, no garantiza recrawl), pero permite verificar en el informe de cobertura si `Última rastreada` se acerca a la fecha real de cambio tras publicarlo.

---

## Hallazgo 2 — hreflang inconsistente entre sitemap y páginas de `/subvenciones/*`
- **Severidad:** Media
- **Evidencia:** El sitemap solo añade `xhtml:link` alternates (`es-ES`/`en-US`) a `/` y `/en/` (correcto, son las únicas rutas con par real ES/EN). Sin embargo, las páginas `/subvenciones/*` (que NO tienen versión en inglés, `src/pages/en/` no tiene subcarpeta `subvenciones/`) declaran en `LayoutStatic.astro` un `<link rel="alternate" hreflang="en" href={hreflangEn}>` donde `hreflangEn={pageUrl}` — es decir, el hreflang "en" apunta a la propia URL en español (ej. `src/pages/subvenciones/ayudas-andalucia.astro:84`). Esto declara la página como su propia traducción al inglés, lo cual es una señal incorrecta para Google (contenido en `es-ES` etiquetado también como `en-US`).
- **Recomendación:** Quitar el `hreflang="en"` (y el `x-default` si apunta igual) en las páginas de `/subvenciones/*` mientras no exista una versión real en inglés, dejando solo `hreflang="es"` o ningún bloque hreflang. Esto es coherente con no crear páginas nuevas (memoria: "no crear páginas standalone nuevas") — es una corrección de metadatos, no una página nueva.
- **Check de falsabilidad:** Ver código fuente de `https://www.rpidev.com/subvenciones/ayudas-andalucia/` y comprobar si el `<link rel="alternate" hreflang="en">` sigue apuntando a la misma URL española.
- **Indicador adelantado:** En GSC → Apariencia en buscadores (o el antiguo informe de "Selección de idioma internacional") no debería aparecer error de "no reciprocidad" para estas páginas una vez corregido, ya que al no declarar alternates, no hay pares que validar.

---

## Hallazgo 3 — Rutas `/en/legal/`, `/en/privacy/`, `/en/cookies/` referenciadas en `robots.txt` devuelven 502, no 404
- **Severidad:** Media (fuera del sitemap en sí, pero afecta la coherencia de las señales de rastreo/indexación citadas en `robots.txt`)
- **Evidencia:** `robots.txt` (`public/robots.txt`) incluye `Disallow: /en/legal`, `/en/privacy`, `/en/cookies`, pero esas páginas no existen en `src/pages/en/` (solo hay `src/pages/en/index.astro`). Verificado con `curl -D -`: `https://www.rpidev.com/en/legal/` → `HTTP/2 502` con el mismo `content-length: 830` y `etag` que una ruta aleatoria inexistente (`/en/nonexistent-random-xyz/`), es decir, el servidor nginx devuelve 502 (Bad Gateway) para cualquier ruta `/en/*` no reconocida en lugar de un 404 normal.
- **Recomendación:** (1) Quitar del `robots.txt` las reglas `Disallow: /en/legal|privacy|cookies` ya que apuntan a rutas inexistentes y no aportan nada. (2) Revisar la configuración de nginx/despliegue para que las rutas no encontradas devuelvan 404 en vez de 502 — un 502 en rutas inexistentes puede ser síntoma de un proxy/backend mal configurado y confunde a Googlebot (502 es un error de servidor, no "no encontrado"; puede afectar percepción de salud del sitio y provocar reintentos de rastreo).
- **Check de falsabilidad:** `curl -I https://www.rpidev.com/en/legal/` y cualquier otra ruta `/en/xxx/` inexistente; si el código sigue siendo 502 en vez de 404, el problema persiste.
- **Indicador adelantado:** En GSC → Configuración → Estadísticas de rastreo, un pico de "Error de servidor (5xx)" indicaría que Googlebot está encontrando estas rutas con 502.

---

## Hallazgo 4 — `dateModified` en JSON-LD desactualizado/inconsistente respecto al contenido real
- **Severidad:** Baja
- **Evidencia:** Todas las páginas de `/subvenciones/*` excepto `pyme-digital-granada` tienen `dateModified: "2026-07-02"` fijo (`ayudas-andalucia.astro:25`, `ayudas-aragon.astro:25`, `kit-digital-granada.astro:25`, `leader-digitalizacion.astro:25`), y `subvenciones/index.astro:24` tiene `"2026-07-20"`. Esto no es lo mismo que el sitemap (que no tiene `lastmod`, hallazgo 1), pero es la única fuente de fecha "de verdad" disponible en el proyecto y varias páginas comparten fecha idéntica sin diferenciar cambios reales de contenido.
- **Recomendación:** Si se implementa el hallazgo 1 usando estas fechas como fuente, primero verificar que reflejan cambios de contenido reales y no una fecha copiada entre páginas. Antes de tocar contenido, confirmar con el usuario si cada página fue efectivamente revisada en esas fechas.
- **Check de falsabilidad:** Comparar `git log -p -- src/pages/subvenciones/ayudas-andalucia.astro` (fecha del último commit real) contra el `dateModified` declarado.
- **Indicador adelantado:** N/A (verificación manual de coherencia, no medible vía GSC).

---

## Validación de checks estándar

| Check | Resultado |
|---|---|
| XML válido | ✅ Pasa — bien formado, namespace `sitemapindex`/`urlset` correctos |
| Límite ≤50.000 URLs / ≤50MB | ✅ Pasa — 8 URLs, 1183 bytes |
| URLs devuelven 200 | ✅ Pasa — las 8 URLs del sitemap responden 200 en producción |
| Páginas excluidas (`/legal`, `/privacy`, `/cookies`) coherentes | ⚠️ Parcial — excluidas del sitemap y bloqueadas en `robots.txt`, pero las páginas en sí NO tienen `<meta name="robots" content="noindex">` (revisado `Layout.astro` + `legal.astro`/`privacy.astro`/`cookies.astro`: ninguna pasa `noIndex`). Esto es un patrón de riesgo conocido: robots.txt bloquea el rastreo pero no la indexación; si alguna vez se enlazan externamente, Google puede indexarlas sin snippet ("indexada aunque bloqueada por robots.txt"). Riesgo bajo en la práctica (páginas legales sin backlinks), pero técnicamente incorrecto — lo ideal sería `noindex` + quitar el bloqueo en robots.txt, o mantener el bloqueo pero aceptar el riesgo. |
| Cobertura sitemap vs `src/pages` | ✅ Pasa — 8/8 páginas de `src/pages` (excluyendo legal/privacy/cookies) están en el sitemap; no faltan ni sobran páginas |
| `priority` / `changefreq` | ✅ N/A — no presentes (correcto, no requieren limpieza) |
| `lastmod` válido | ❌ Falla — ausente en las 8 URLs (Hallazgo 1) |
| Umbral de páginas de ubicación (30+/50+) | ✅ No aplica — 5 páginas de `/subvenciones/*` con nombre de región (Andalucía, Aragón, Granada x2, genérico LEADER), contenido claramente diferenciado por programa de ayuda (RETECH/Pymetur vs IAF, distinto import por página: 2246–3421 palabras de código fuente por página), muy por debajo del umbral de warning de 30 páginas. Sin acción requerida. |

## Hallazgo adicional — Página excluida del sitemap sin `noindex` explícito
- **Severidad:** Baja
- **Evidencia:** `grep -n "noindex\|canonical" src/pages/legal.astro src/pages/privacy.astro src/pages/cookies.astro` no devuelve nada — estas tres páginas usan los valores por defecto de `Layout.astro` (`noIndex = false`, `canonical = Astro.url.href`), por tanto emiten `<meta name="robots" content="index, follow, ...">` pese a estar excluidas del sitemap y bloqueadas por `robots.txt`.
- **Recomendación:** Pasar explícitamente `noIndex={true}` a estas tres páginas si la intención es que no aparezcan en resultados de búsqueda, en vez de depender solo de la exclusión del sitemap + `robots.txt` Disallow.
- **Check de falsabilidad:** Ver `curl -s https://www.rpidev.com/legal/ | grep -o '<meta name="robots"[^>]*>'` — actualmente muestra `index, follow`, no `noindex`.
- **Indicador adelantado:** Buscar en GSC → Páginas → "Indexada aunque bloqueada por robots.txt" para `/legal/`, `/privacy/`, `/cookies/`.

## Archivos relevantes
- `/home/ruben/Proyectos/rpidev-new/astro.config.mjs`
- `/home/ruben/Proyectos/rpidev-new/dist/sitemap-index.xml`
- `/home/ruben/Proyectos/rpidev-new/dist/sitemap-0.xml`
- `/home/ruben/Proyectos/rpidev-new/public/robots.txt`
- `/home/ruben/Proyectos/rpidev-new/src/layouts/Layout.astro`
- `/home/ruben/Proyectos/rpidev-new/src/layouts/LayoutStatic.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/legal.astro`, `privacy.astro`, `cookies.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/*.astro`
