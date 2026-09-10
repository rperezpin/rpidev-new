# Datos reales de Google (API) — rpidev.com

Fuente: Google APIs vía `claude-seo` (Tier 2 completo — PSI v5, CrUX, CrUX History, Search Console API con service account `claude-seo@claude-seo-507410.iam.gserviceaccount.com` como `siteOwner` de `sc-domain:rpidev.com`, Indexing API v3, GA4 Data API). Propiedad verificada: rubenpi1996@gmail.com.

**Estado de la recogida de datos:** GSC, CrUX y PSI completos. **GA4 pendiente** (ver Hallazgo 6) — no se ha podido confirmar el ID de propiedad GA4 correcto para rpidev.com dentro del tiempo disponible; el ID configurado por defecto en el entorno (`properties/523270049`) pertenece a otro sitio gestionado con las mismas credenciales (casvisol.com) y devuelve 0 sesiones para el rango de fechas, lo que indica que es la propiedad equivocada, no que rpidev.com tenga tráfico cero. Se necesita el ID numérico de propiedad GA4 real de rpidev.com para completar esta sección.

---

## 1. Core Web Vitals de campo (CrUX)

| Ámbito | Resultado |
|---|---|
| CrUX API — origen `https://www.rpidev.com` | **Sin datos.** Error: "No CrUX data for this origin. The site likely has insufficient Chrome traffic volume for eligibility." |
| CrUX History API — origen (28 días rolling, histórico) | **Sin datos.** Mismo motivo: volumen de tráfico Chrome insuficiente para el umbral de elegibilidad de CrUX (~cientos de usuarios/28 días como mínimo). |

No hay CWV de campo (LCP/INP/CLS reales de usuarios) disponibles para rpidev.com ni a nivel de origen ni de página — el sitio no tiene tráfico Chrome suficiente para aparecer en CrUX. Esto es coherente con el volumen de impresiones/clics tan bajo visto en GSC (ver sección 3).

Como sustituto (datos de laboratorio Lighthouse vía PSI v5, **no son CWV de campo real**, solo referencia de rendimiento técnico):

| Métrica | Mobile (lab) | Desktop (lab) |
|---|---|---|
| Performance score | 90/100 | 90/100 |
| LCP (lab) | 3.1 s | 0.9 s |
| CLS (lab) | 0.001 | 0.005 |
| TBT (lab) | 60 ms | 240 ms |
| SEO score | 100/100 | 100/100 |

### Hallazgo 1 — Sin datos de CrUX (field data) por bajo volumen de tráfico
- **Severidad:** Informativo / Baja (no es un problema técnico del sitio, es una consecuencia de la falta de tráfico orgánico)
- **Evidencia:** Ambas llamadas (`crux_history.py --origin` y CrUX embebido en `pagespeed_check.py`) devuelven explícitamente "insufficient Chrome traffic volume for eligibility".
- **Recomendación:** No se puede optimizar CWV de campo sin datos; usar los datos de laboratorio (tabla superior) como proxy hasta que el sitio genere tráfico Chrome suficiente. Priorizar el aumento de tráfico orgánico real (sección 3) como precondición para poder monitorizar CWV de campo en el futuro.
- **Check de falsabilidad:** Repetir `crux_history.py https://www.rpidev.com --origin --json` periódicamente; el día que devuelva `collection_periods` no vacío, CrUX ya tiene volumen suficiente.
- **Indicador adelantado:** Aumento sostenido de `impressions`/`clicks` en GSC (sección 3) durante varias semanas suele preceder a la aparición de datos en CrUX.

---

## 2. Estado de indexación (URL Inspection API, GSC)

8 URLs en `sitemap-0.xml`. Inspeccionadas las 8 con `gsc_inspect.py --site-url sc-domain:rpidev.com`:

| URL | Verdict | Coverage state | Última rastreada | Canonical coincide | Referencias entrantes detectadas por Google |
|---|---|---|---|---|---|
| `https://www.rpidev.com/` | ✅ PASS | Submitted and indexed | 2026-09-04 | Sí | `/subvenciones/`, `/sitemap-0.xml` |
| `https://www.rpidev.com/en/` | ✅ PASS | Submitted and indexed | 2026-08-20 | Sí | `/subvenciones/`, `/` |
| `https://www.rpidev.com/subvenciones/` | ✅ PASS | Submitted and indexed | 2026-09-06 | Sí | `/` |
| `https://www.rpidev.com/subvenciones/ayudas-andalucia/` | ✅ PASS | Submitted and indexed | 2026-09-09 | Sí | Ninguna detectada |
| `https://www.rpidev.com/subvenciones/ayudas-aragon/` | ✅ PASS | Submitted and indexed | 2026-09-09 | Sí | Ninguna detectada |
| `https://www.rpidev.com/subvenciones/leader-digitalizacion/` | ✅ PASS | Submitted and indexed | 2026-07-29 | Sí | `/subvenciones/leader-digitalizacion` (sin barra final) |
| `https://www.rpidev.com/subvenciones/pyme-digital-granada/` | ✅ PASS | Submitted and indexed | 2026-08-03 | Sí | `/subvenciones/` |
| `https://www.rpidev.com/subvenciones/kit-digital-granada/` | ❌ **NEUTRAL** | **"URL is unknown to Google"** | Nunca (`null`) | N/A | Ninguna |

**7 de 8 páginas indexadas correctamente. 1 no indexada: `/subvenciones/kit-digital-granada/`.**

Estado del sitemap (`gsc_query.py sitemaps`): `sitemap-index.xml` enviado y procesado sin errores ni warnings (`errors: 0`, `warnings: 0`, `is_pending: false`), último envío registrado 2026-05-07. La ausencia de errores en el sitemap confirma que el problema de la página `kit-digital-granada` no es un fallo de envío, sino de rastreo/priorización por parte de Google.

### Hallazgo 2 — `/subvenciones/kit-digital-granada/` no está indexada ("URL is unknown to Google")
- **Severidad:** **Alta**
- **Evidencia:** `gsc_inspect.py` devuelve `coverage_state: "URL is unknown to Google"`, `last_crawl_time: null`, sin ninguna URL de referencia detectada (`referring_urls: []`) pese a estar en el sitemap. Esto contrasta con las otras 7 URLs del sitemap, todas indexadas y con al menos un enlace interno detectado por Google. Esto además cruza con el hallazgo de Search Analytics (sección 3): la consulta "kit digital granada" tiene 219 impresiones en 28 días pero posiciona la página genérica `/subvenciones/` (posición 17.9, 0 clics) en lugar de esta página dedicada, que ni siquiera está indexada.
- **Recomendación:** (1) Verificar por qué Google no ha rastreado esta URL pese a estar en el sitemap — comprobar si tiene enlaces internos reales desde páginas ya indexadas (el listado de `referring_urls` vacío sugiere que puede no estar enlazada desde ningún sitio visible para Google, a diferencia de `pyme-digital-granada` que sí tiene un enlace desde `/subvenciones/`). (2) Añadir un enlace interno visible hacia esta página desde `/subvenciones/` y/o desde la home. (3) Solicitar indexación manual vía Search Console (Inspección de URL → "Solicitar indexación") o vía Indexing API una vez corregido el enlazado interno.
- **Check de falsabilidad:** Repetir `gsc_inspect.py https://www.rpidev.com/subvenciones/kit-digital-granada/ --site-url sc-domain:rpidev.com --json`; si `coverage_state` cambia a "Submitted and indexed", el problema está resuelto.
- **Indicador adelantado:** Aparición de la URL `/subvenciones/kit-digital-granada/` en el informe de página de GSC Search Analytics (actualmente no aparece en absoluto en `gsc_query.py query --dimensions page`, ver sección 3) sería la primera señal de que Google la ha empezado a indexar y mostrar en resultados.

---

## 3. Search Analytics de GSC (28 días: 2026-08-13 a 2026-09-07)

**Totales de sitio (`totals_complete: true`, seguros para sumar):**

| Clics | Impresiones | CTR | Posición media |
|---|---|---|---|
| 15 | 1.756 | 0,85% | 11,2 |

Aviso: las filas por consulta pueden omitir tráfico de bajo volumen anonimizado por Google; no deben sumarse como total (los totales de arriba ya vienen agregados sin ese sesgo).

### 3.1 Todas las consultas con impresiones (28 días, 52 consultas)

| Consulta | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| kit digital granada | 0 | 219 | 0% | 17,9 |
| pymetur | 1 | 72 | 1,39% | 8,6 |
| ayudas digitales pymes ávila | 0 | 35 | 0% | 22,1 |
| kit digital en granada | 0 | 35 | 0% | 23,0 |
| subvención kit digital granada | 0 | 30 | 0% | 13,3 |
| ayudas digitalización junta de andalucía | 0 | 29 | 0% | 10,7 |
| ayudas kit digital granada | 0 | 28 | 0% | 12,5 |
| kit digital andalucía | 0 | 28 | 0% | 15,6 |
| ayudas digitalización pymes ávila | 0 | 27 | 0% | 20,3 |
| orden tdf/39/2026 | 0 | 26 | 0% | 23,9 |
| subvención asesoramiento en ventas digitales | 0 | 24 | 0% | 16,5 |
| ayudas autonomos digitalizacion | 0 | 22 | 0% | 19,0 |
| ayudas digitalización pymes 2021 | 0 | 20 | 0% | 24,5 |
| ayudas digitalización aragón (kit digital andalucia) | 0 | 6 | 0% | 15,2 |
| digitur | 0 | 6 | 0% | 54,2 |
| kit digital andalucia | 0 | 6 | 0% | 15,2 |
| kit digital ronda | 0 | 5 | 0% | 31,6 |
| digitalización empresarial en andalucía | 0 | 5 | 0% | 11,4 |
| www.reteches.com | 0 | 6 | 0% | 71,2 |
| subvenciones asesores digitales | 0 | 4 | 0% | 18,5 |
| puesta en marcha de proyectos digitales | 0 | 3 | 0% | 42,3 |
| kit digital junta de andalucia | 0 | 3 | 0% | 7,0 |
| ayudas digitalización autónomos 2023 | 0 | 2 | 0% | 11,5 |
| ayudas pymetur 2026 | 0 | 2 | 0% | 10,0 |
| pymetur andalucia | 0 | 2 | 0% | 9,5 |
| pymetur 2026 | 0 | 2 | 0% | 12,0 |
| professional development | 0 | 2 | 0% | 11,0 |
| rpi development | 0 | 2 | 0% | 6,0 |
| rpiv | 0 | 4 | 0% | 45,2 |
| estoy en andalucia | 0 | 2 | 0% | 4,0 |
| factorydea | 0 | 2 | 0% | 16,0 |
| ayudas startups andalucia | 0 | 2 | 0% | 19,5 |
| si | 0 | 2 | 0% | 5,0 |
| ayudas digitalización | 0 | 1 | 0% | 12,0 |
| en andalucia | 0 | 1 | 0% | 12,0 |
| subvencion digitalizacion empresas 2026 | 0 | 1 | 0% | 10,0 |
| web hosting | 0 | 1 | 0% | 12,0 |
| ayuda digitalización autónomos | 0 | 1 | 0% | 63,0 |
| ayudas comercio electronico | 0 | 1 | 0% | 28,0 |
| digitur junta de andalucia | 0 | 1 | 0% | 34,0 |
| futuras convocatorias | 0 | 1 | 0% | 7,0 |
| kit digital junta de andalucia (dup. andaluc.) | 0 | 1 | 0% | 17,0 |
| para autonomos | 0 | 1 | 0% | 7,0 |
| plazo de solicitud | 0 | 1 | 0% | 4,0 |
| resido en granada | 0 | 1 | 0% | 1,0 |
| sevilla | 0 | 1 | 0% | 3,0 |
| solicitar bono digitalizacion | 0 | 1 | 0% | 1,0 |
| soy autonomo | 0 | 1 | 0% | 1,0 |
| soy una pyme | 0 | 1 | 0% | 1,0 |
| tpv artesania sin cuotas | 0 | 1 | 0% | 90,0 |
| web development | 0 | 1 | 0% | 1,0 |
| desarrollo de software | 0 | 1 | 0% | 5,0 |
| andalucia | 1 | 1 | 100% | 1,0 |

*(La consulta "kit digital andalucia"/"kit digital andalucía" aparece dos veces en los datos crudos de GSC como variantes distintas con posiciones ligeramente distintas — 15,2 y 15,6 — se listan por separado porque GSC las trata como strings de consulta diferentes.)*

### 3.2 Rendimiento por página (28 días)

| Página | Clics | Impresiones | CTR | Posición |
|---|---|---|---|---|
| `/subvenciones/` | 5 | 1.098 | 0,46% | 12,8 |
| `/subvenciones/ayudas-andalucia/` | 8 | 586 | 1,37% | 9,7 |
| `/en/` | 1 | 31 | 3,23% | 9,7 |
| `/` (home) | 1 | 29 | 3,45% | 15,4 |
| `/subvenciones/ayudas-aragon/` | 0 | 61 | 0% | 8,2 |
| `/subvenciones/leader-digitalizacion/` | 0 | 13 | 0% | 6,1 |
| `/subvenciones/pyme-digital-granada/` | 0 | 5 | 0% | 6,6 |
| `/subvenciones/kit-digital-granada/` | — | **0 (no aparece)** | — | — |

`/subvenciones/kit-digital-granada/` no tiene ninguna fila en Search Analytics — coherente con el Hallazgo 2 (no indexada, cero impresiones porque nunca se ha mostrado en resultados).

### Hallazgo 3 — Impresiones altas con CTR ≈0% (oportunidad de title/meta description, o de indexar la página correcta)
- **Severidad:** **Alta**
- **Evidencia:** La consulta "kit digital granada" (probablemente la de mayor intención comercial del sitio) tiene 219 impresiones y 0 clics (CTR 0%) en 28 días, posicionando de media en 17,9 (página 2 de resultados) con la página `/subvenciones/` (hub genérico), no con `/subvenciones/kit-digital-granada/` (página dedicada, no indexada — Hallazgo 2). A nivel de página, `/subvenciones/` acumula 1.098 impresiones con solo 0,46% de CTR (5 clics), muy por debajo de la media de sitio (0,85%) y muy por debajo del CTR típico de posición 8-15 en Google (habitualmente 1-3%). Otras consultas con impresiones ≥20 y CTR 0%: "ayudas digitales pymes ávila" (35 impr.), "kit digital en granada" (35 impr.), "subvención kit digital granada" (30 impr.), "ayudas digitalización junta de andalucía" (29 impr.), "ayudas kit digital granada" (28 impr.), "kit digital andalucía" (28 impr.), "ayudas digitalización pymes ávila" (27 impr.), "orden tdf/39/2026" (26 impr.), "subvención asesoramiento en ventas digitales" (24 impr.), "ayudas autonomos digitalizacion" (22 impr.), "ayudas digitalización pymes 2021" (20 impr.) — todas en posición 15-25, es decir, página 2, donde el CTR bajo es en parte esperable por la posición, pero el 0% absoluto en consultas con 20-35 impresiones sugiere además un snippet (title/meta description) poco atractivo o no alineado con la intención de búsqueda.
- **Recomendación:** Priorizar dos acciones: (1) Resolver primero el Hallazgo 2 (indexar `/subvenciones/kit-digital-granada/`) para que la consulta de mayor volumen ("kit digital granada", 219 impr.) tenga la oportunidad de posicionar con la página dedicada en vez del hub genérico. (2) Revisar y reescribir el `<title>` y meta description de `/subvenciones/` para reflejar mejor la intención de búsqueda de "kit digital [ciudad/región]" (actualmente probablemente demasiado genérico si cubre múltiples regiones a la vez). No tocar el contenido de las páginas sin más contexto — esto es solo el diagnóstico de datos, no la implementación.
- **Check de falsabilidad:** Repetir `gsc_query.py query --dimensions query --days 28 --json` dentro de 4-6 semanas tras los cambios; el CTR de "kit digital granada" y consultas relacionadas debería subir de 0% incluso sin cambio de posición, si el snippet mejora.
- **Indicador adelantado:** En GSC → Rendimiento → filtrar por consulta "kit digital granada", vigilar el CTR semanal; una subida de CTR sin subida de posición confirma que fue el snippet, no el ranking, lo que estaba limitando los clics.

### Hallazgo 4 — Consultas en posición 8-15 (oportunidad de subir a primera página)
- **Severidad:** Media (oportunidad, no un fallo)
- **Evidencia:** Consultas con posición media entre 8 y 15 en los últimos 28 días:

| Consulta | Posición | Impresiones | Clics | CTR |
|---|---|---|---|---|
| pymetur | 8,6 | 72 | 1 | 1,39% |
| subvención kit digital granada | 13,3 | 30 | 0 | 0% |
| ayudas digitalización junta de andalucía | 10,7 | 29 | 0 | 0% |
| ayudas kit digital granada | 12,5 | 28 | 0 | 0% |
| digitalización empresarial en andalucía | 11,4 | 5 | 0 | 0% |
| ayudas digitalización autónomos 2023 | 11,5 | 2 | 0 | 0% |
| ayudas pymetur 2026 | 10,0 | 2 | 0 | 0% |
| pymetur andalucia | 9,5 | 2 | 0 | 0% |
| professional development | 11,0 | 2 | 0 | 0% |
| pymetur 2026 | 12,0 | 2 | 0 | 0% |
| ayudas digitalización | 12,0 | 1 | 0 | 0% |
| en andalucia | 12,0 | 1 | 0 | 0% |
| subvencion digitalizacion empresas 2026 | 10,0 | 1 | 0 | 0% |
| web hosting | 12,0 | 1 | 0 | 0% |

A nivel de página, `/subvenciones/ayudas-aragon/` (posición 8,2, 61 impresiones) y `/subvenciones/ayudas-andalucia/` (posición 9,7, 586 impresiones, ya con algo de tráfico: 8 clics) son las páginas más cerca de entrar en primera página de resultados a nivel agregado.

- **Recomendación:** "pymetur" (72 impresiones, posición 8,6) es la mejor oportunidad de quick-win — está justo en el límite de página 1 (top 10) y ya genera el único clic no trivial del sitio (aparte de "andalucia" con 1 impresión). Reforzar contenido/enlazado interno hacia `/subvenciones/ayudas-andalucia/` (que rankea para "pymetur") podría empujarla a posiciones 4-7. `/subvenciones/ayudas-aragon/` en posición 8,2 con 61 impresiones es la segunda prioridad por volumen.
- **Check de falsabilidad:** Repetir la consulta filtrando por estas keywords dentro de 4-6 semanas; si la posición media baja de 8-15 a top 10 estable, la mejora es efectiva.
- **Indicador adelantado:** Aumento del CTR de "pymetur" y aparición de clics en las consultas de "ayudas digitalización junta de andalucía" / "ayudas kit digital granada" (actualmente 0 clics con impresiones ya significativas) indicaría que se ha cruzado el umbral de página 1.

### Hallazgo 5 — Volumen de búsqueda global extremadamente bajo (15 clics / 1.756 impresiones en 28 días)
- **Severidad:** **Alta** (contexto crítico para priorizar el resto de la auditoría)
- **Evidencia:** Totales de sitio confirmados (`totals_complete: true`): 15 clics, 1.756 impresiones, CTR 0,85%, posición media 11,2 en 28 días. Es un volumen muy bajo para un sitio con contenido en `/subvenciones/*` orientado a búsquedas informativas de alto interés (kit digital, ayudas). Coincide con la falta de datos de CrUX (Hallazgo 1) por insuficiente tráfico Chrome.
- **Recomendación:** El resto de la auditoría SEO debe priorizarse en función de estos datos reales: los mayores fallos técnicos no importan si no hay volumen de búsqueda detrás. Concentrar esfuerzo en: (1) indexar `/subvenciones/kit-digital-granada/` (Hallazgo 2), que es la única consulta con volumen realmente alto (219 impr.) y encaja exactamente con esa página; (2) mejorar snippets de las páginas con impresiones pero CTR 0% (Hallazgo 3); (3) evaluar si faltan páginas/contenido para otras variantes geográficas de "kit digital" con demanda demostrada en las consultas actuales (Málaga, Sevilla, Córdoba, etc., si existiera intención de expandir — sin crear páginas nuevas sin decisión explícita del usuario, según memoria del proyecto).
- **Check de falsabilidad:** Repetir `gsc_query.py query --property sc-domain:rpidev.com --days 28 --json` cada 4 semanas y comparar `totals.impressions`/`totals.clicks` en el tiempo.
- **Indicador adelantado:** Tendencia ascendente de impresiones totales mes a mes es la señal más temprana de que el sitio está ganando visibilidad, antes incluso de que se traduzca en clics.

---

## 4. GA4 — Tráfico orgánico (PENDIENTE)

### Hallazgo 6 — No se ha podido obtener el ID de propiedad GA4 de rpidev.com
- **Severidad:** Media (bloqueante para esta sección, no indica un problema del sitio en sí)
- **Evidencia:** `ga4_report.py --report organic --days 28 --json` y `--report top-pages` se ejecutaron contra el ID de propiedad configurado por defecto en el entorno (`properties/523270049`) y devolvieron `totals: {}`, `daily_data: []`, `pages: []`, `total_organic_sessions: 0`, sin ningún error de permisos. Ese mismo ID de propiedad por defecto (`default_property: sc-domain:casvisol.com` en la config) corresponde a otro sitio gestionado con las mismas credenciales (casvisol.com), lo que indica que 523270049 es la propiedad GA4 de casvisol.com, no de rpidev.com — el resultado vacío es porque se consultó la propiedad equivocada, no porque rpidev.com tenga 0 sesiones orgánicas reales.
- **Recomendación:** Confirmar con el usuario el ID numérico de la propiedad GA4 de rpidev.com (Admin → Configuración de la propiedad en GA4) y volver a ejecutar `ga4_report.py --property <ID_RPIDEV> --report organic --days 28 --json` y `--report top-pages`. No se ha aplicado ningún cambio; esta sección queda pendiente de ese dato.
- **Check de falsabilidad:** Con el ID correcto, `ga4_report.py` debería devolver `totals` no vacío o, si real y verdaderamente hay 0 sesiones orgánicas, un error de permisos explícito en su defecto — un `{}` silencioso con el ID de otro sitio confirmado no es una respuesta fiable.
- **Indicador adelantado:** N/A — depende de obtener el ID correcto primero.

---

## Resumen priorizado (para el resto de la auditoría)

| # | Hallazgo | Severidad | Fuente |
|---|---|---|---|
| 2 | `/subvenciones/kit-digital-granada/` no indexada pese a estar en sitemap | Alta | URL Inspection API |
| 3 | Impresiones altas (219, 586, 1.098) con CTR ≈0-1,4% en consultas/páginas clave | Alta | Search Analytics |
| 5 | Volumen de búsqueda global muy bajo (15 clics/1.756 impr. en 28 días) | Alta | Search Analytics |
| 4 | 14 consultas en posición 8-15, candidatas a top 10 | Media | Search Analytics |
| 6 | GA4 pendiente — falta ID de propiedad correcto para rpidev.com | Media | GA4 (bloqueado) |
| 1 | Sin datos de CrUX (field CWV) por bajo tráfico Chrome | Baja/Informativo | CrUX / CrUX History |

## Archivos y comandos relevantes
- Datos GSC: `sc-domain:rpidev.com`, rango 2026-08-13 a 2026-09-07 (28 días), vía `gsc_query.py query|sitemaps`.
- URL Inspection: `gsc_inspect.py <url> --site-url sc-domain:rpidev.com` sobre las 8 URLs de `https://www.rpidev.com/sitemap-0.xml`.
- CrUX: `crux_history.py https://www.rpidev.com --origin --json`, CrUX embebido en `pagespeed_check.py https://www.rpidev.com --json`.
- GA4: `ga4_report.py --report organic|top-pages --days 28 --json` (pendiente de ID de propiedad correcto, ver Hallazgo 6).
- Salida completa de PSI (lab data) guardada en el historial de esta sesión de auditoría.
