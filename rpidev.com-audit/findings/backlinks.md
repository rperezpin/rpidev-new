# Auditoría de Perfil de Backlinks — rpidev.com

**Fecha de análisis:** 2026-09-10
**Dominio analizado:** `rpidev.com` / `www.rpidev.com`
**Nivel de acceso (tier):** 0 — Common Crawl + crawler de verificación propio. **No hay API key de Moz ni de Bing Webmaster configurada** (`backlinks_auth.py --check` confirma `moz.available: false`, `bing.available: false`).

## Resumen ejecutivo

Con las fuentes disponibles (Tier 0) **no es posible calcular una puntuación numérica de salud de backlinks** ni obtener una lista de dominios de referencia concretos. Common Crawl solo confirma que `rpidev.com` ha sido rastreado, pero está por debajo del umbral necesario para reportar PageRank, centralidad armónica o número de hosts vinculantes — típico de un dominio nuevo o de bajo volumen de enlaces entrantes, no necesariamente de "cero autoridad" (ver Hallazgo 1, matiz importante). No hay ningún fichero de backlinks conocidos en el proyecto para pasar al crawler de verificación, así que ese verificador no se ha podido ejecutar sobre datos reales.

**Puntuación de salud de backlinks: DATOS INSUFICIENTES** (1 de 7 factores de scoring con dato disponible — muy por debajo del mínimo de 4 factores requerido para emitir un número; ver tabla de factores al final).

---

## Hallazgo 1 — Dominio presente en el rastreo de Common Crawl pero por debajo del umbral de ranking (sin PageRank/centralidad calculables)

- **Severidad:** Media (bloquea cualquier medición cuantitativa de autoridad de enlace hasta que se añadan fuentes de pago/gratuitas adicionales; no implica necesariamente un problema del sitio en sí)
- **Evidencia:** `commoncrawl_graph.py rpidev.com --json` y `commoncrawl_graph.py www.rpidev.com --json` (ambas consultas resuelven al mismo registro de dominio `rpidev.com`, dato a nivel de dominio, no de host) devuelven:
  ```json
  {
    "domain": "rpidev.com",
    "in_crawl": true,
    "in_rankings": false,
    "pagerank": null,
    "pagerank_rank": null,
    "harmonic_centrality": null,
    "harmonic_centrality_rank": null,
    "n_hosts": null,
    "note": "Domain found in CC crawl but below ranking threshold (too small/new for PageRank rankings)."
  }
  ```
  Fuente: Common Crawl Web Graph, release `cc-main-2026-jan-feb-mar` (dato trimestral, ver https://commoncrawl.org/web-graphs). **Confianza: 0.50** (dato a nivel de dominio, no de página, sin texto ancla ni lista de dominios de referencia individuales — esto es una limitación de la propia fuente, no del análisis).
  - **Interpretación correcta (validada con `validate_backlink_report.py`):** `in_crawl: true` + `in_rankings: false` se reporta como "por debajo del umbral de ranking", **no** como "el dominio no tiene autoridad". No hay suficientes datos para afirmar ninguna de las dos cosas con certeza.
  - El script de Common Crawl **no expone una lista de dominios de referencia concretos** para este caso (no hay `n_hosts` ni lista de hosts enlazantes) — no existen "dominios de referencia conocidos por Common Crawl" que reportar para `rpidev.com`, más allá de la confirmación de presencia en el rastreo. Esto contradice la expectativa inicial de la tarea; se documenta explícitamente para no inventar datos.
- **Recomendación:** No se requiere ninguna acción sobre el sitio en sí a partir de este dato — es una limitación de visibilidad de la fuente gratuita, no un defecto del sitio. Para obtener una lista real de dominios de referencia y métricas de autoridad (DA/PA, spam score), añadir una Moz API key gratuita (`https://moz.com/products/api`, 2.500 filas/mes) en `MOZ_API_KEY` o `/home/ruben/.config/claude-seo/backlinks-api.json`. Alternativa igualmente gratuita y más directa para un sitio propio: revisar el informe **Enlaces** de Google Search Console (si la propiedad `rpidev.com` ya está verificada), que sí lista dominios de referencia reales sin necesidad de ninguna key de este skill.
- **Check de falsabilidad:** Repetir `"$HOME/.claude/skills/seo/bin/claude-seo" run commoncrawl_graph.py rpidev.com --json` en un release trimestral posterior de Common Crawl; si `in_rankings` pasa a `true` y aparecen valores numéricos de `pagerank`/`harmonic_centrality`, el dominio ha acumulado suficiente enlace entrante detectado por CC.
- **Indicador adelantado:** En Google Search Console → Enlaces → "Sitios que enlazan más", un aumento del número de dominios de referencia distintos (no solo del número total de enlaces) sería la señal principal de progreso, ya que es el factor con más peso en la puntuación de salud de backlinks (20%, ver tabla de factores).

---

## Hallazgo 2 — No hay lista de backlinks conocidos para verificar con el crawler propio

- **Severidad:** Baja (limitación de proceso, no un hallazgo del sitio)
- **Evidencia:** `verify_backlinks.py` requiere `--links <fichero.json>` con formato `[{"source_url": "..."}]`. No existe en el repositorio (`/home/ruben/Proyectos/rpidev-new`) ni en el directorio de auditoría ningún fichero de backlinks conocidos (`find ... -iname "*backlink*" -o -iname "*known-links*"` no devuelve nada relevante salvo un fichero de terceros en `node_modules`). Sin una lista de origen (que normalmente vendría de Moz, Bing Webmaster, GSC o del propio cliente), el crawler de verificación no tiene nada que verificar.
- **Recomendación:** Si el cliente (freelancer en Granada) tiene constancia de menciones o enlaces concretos hacia `rpidev.com` (directorios locales, colaboraciones, prensa, perfiles de asociaciones profesionales de Granada, etc.), recopilarlos en un JSON `[{"source_url": "https://..."}]` y ejecutar `verify_backlinks.py --target https://www.rpidev.com --links <fichero> --json` para confirmar si siguen activos (rel=nofollow/dofollow, texto ancla, estado HTTP). Es la única fuente Tier 0 con confianza alta (0.95) por ser observación directa.
- **Check de falsabilidad:** Ejecutar `verify_backlinks.py` en cuanto exista una lista de candidatos; el resultado (`verified` / `link_removed` / `unverifiable_js`) es directamente reproducible.
- **Indicador adelantado:** N/A — depende de que exista una lista de entrada; no hay indicador adelantado sin ese insumo.

---

## Hallazgo 3 — Ausencia de credenciales Moz y Bing Webmaster limita el análisis a nivel de dominio agregado, sin autoridad, spam score ni texto ancla

- **Severidad:** Alta (para el objetivo de un análisis de backlinks completo; no es un defecto del sitio sino una limitación de configuración del entorno de auditoría)
- **Evidencia:** `backlinks_auth.py --check --json` confirma:
  ```json
  "moz": {"available": false, "error": "No Moz API key found..."},
  "bing": {"available": false, "error": "No Bing Webmaster API key found..."}
  ```
  Sin estas fuentes, faltan por completo los siguientes factores de la puntuación de salud de backlinks (ver tabla de pesos): Domain Authority/Page Authority, Spam Score (toxicidad), texto ancla, distribución de calidad de dominios de referencia, ratio follow/nofollow, y tendencia de velocidad de enlaces (esta última solo la ofrece DataForSEO, ni siquiera Moz/Bing la cubren).
- **Recomendación:**
  1. **Moz API** (gratis, requiere tarjeta pero sin cargo, 2.500 filas/mes): `https://moz.com/products/api`. Configurar `MOZ_API_KEY` o añadir `moz_api_key` a `/home/ruben/.config/claude-seo/backlinks-api.json`. Habilita DA/PA, Spam Score, dominios de referencia y texto ancla (confianza 0.85).
  2. **Bing Webmaster Tools** (gratis, requiere verificar la propiedad `rpidev.com` en `https://www.bing.com/webmasters`): habilita enlaces entrantes detectados por Bing (confianza 0.70). Solo aplica a propiedades verificadas por el propio usuario, no sirve para analizar dominios de la competencia.
  3. Si se necesita detección de enlaces tóxicos más allá del Spam Score básico de Moz, análisis de velocidad de enlaces o comparativa de competidores no verificados en Bing, sería necesaria la extensión de pago DataForSEO (`./extensions/dataforseo/install.sh`), fuera del alcance de un análisis gratuito.
  4. Mientras tanto, la fuente más práctica y ya disponible sin ninguna key de este skill es **Google Search Console** (si la propiedad está verificada), que da lista real de dominios de referencia y páginas enlazadas — recomendar revisarla directamente aunque quede fuera del alcance de este skill de backlinks.
- **Check de falsabilidad:** Volver a ejecutar `backlinks_auth.py --check --json` tras configurar cualquiera de las dos keys; `available` debe pasar a `true` para esa fuente.
- **Indicador adelantado:** N/A — es una limitación de configuración, no una métrica del sitio.

---

## Tabla de factores de la puntuación de salud de backlinks (0-100)

| Factor | Peso | Dato disponible (Tier 0) | Fuente / confianza |
|---|---|---|---|
| Nº de dominios de referencia | 20% | ❌ No disponible | Requiere Moz o DataForSEO |
| Distribución de calidad de dominio | 20% | ❌ No disponible | Requiere Moz (DA) o DataForSEO |
| Naturalidad del texto ancla | 15% | ❌ No disponible | Requiere Moz, Bing o DataForSEO |
| Ratio de enlaces tóxicos | 20% | ❌ No disponible | Requiere Moz (Spam Score) o DataForSEO |
| Tendencia de velocidad de enlaces | 10% | ❌ No disponible | Solo DataForSEO (ninguna fuente gratuita la ofrece) |
| Ratio follow/nofollow | 5% | ❌ No disponible | Requiere Bing o DataForSEO |
| Relevancia geográfica | 10% | ❌ No disponible | Requiere Bing (país) o DataForSEO |
| — Presencia en rastreo (dato adicional, no ponderado en la tabla estándar) | — | ✅ Confirmado (`in_crawl: true`) | Common Crawl, confianza 0.50 |

**1 de 7 factores ponderados tiene dato** (y ese único dato adicional de "presencia en rastreo" no forma parte de los 7 factores ponderados oficiales). Por debajo del mínimo de 4 factores requerido → **se reporta DATOS INSUFICIENTES, no un número de 0-100**, siguiendo la validación automática (`validate_backlink_report.py` → status `PASS`, con nota informativa de no interpretar "fuera de rankings" como "sin autoridad").

## Qué NO se ha podido evaluar en este análisis (fuera de alcance de este skill)
- E-E-A-T / calidad de contenido → usar `/seo content https://www.rpidev.com`
- Rastreabilidad técnica / crawlability → usar `/seo technical https://www.rpidev.com`

## Resultado de validación automática
```
"$HOME/.claude/skills/seo/bin/claude-seo" run validate_backlink_report.py --report report_data.json --json
→ status: PASS (0 errores, 0 warnings, 1 info)
→ info: "Domain in CC crawl but not in rankings. Report as 'below ranking threshold' — not 'domain has no authority'."
```
Esta nota se ha incorporado literalmente en el Hallazgo 1.

## Archivos relevantes
- N/A en el repositorio del proyecto — este análisis se basa únicamente en llamadas en vivo al skill `seo` (Common Crawl Web Graph, `backlinks_auth.py`, `verify_backlinks.py --help`) y no ha modificado ningún fichero del proyecto.
- Configuración de credenciales (no presente): `/home/ruben/.config/claude-seo/backlinks-api.json`
