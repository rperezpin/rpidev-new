# GEO / AI Search Readiness — rpidev.com

Auditado: 2026-09-10. Fetch en vivo (https://www.rpidev.com) + código fuente en `/home/ruben/Proyectos/rpidev-new`. Solo diagnóstico, sin cambios aplicados.

## GEO Readiness Score: 78/100

| Dimensión | Peso | Score | Nota |
|---|---|---|---|
| Citabilidad | 25% | 82/100 | FAQ schema + respuestas directas en subvenciones; homepage es marketing copy corto |
| Estructura para extracción | 20% | 85/100 | H2 en forma de pregunta, tablas, `<details>` FAQ, breadcrumbs |
| Contenido multi-modal | 15% | 45/100 | Sin vídeo/YouTube embebido, sin imágenes con datos, sin transcripciones |
| Autoridad y marca | 20% | 75/100 | Autoría, NAP, sameAs completos; sin Wikipedia/Reddit, YouTube solo enlazado no explotado |
| Accesibilidad técnica IA | 20% | 88/100 | SSR real, robots.txt y llms.txt correctos; charset HTTP ausente |

## Estado de crawlers IA (robots.txt, verificado en vivo)

| Bot | Estado |
|---|---|
| GPTBot | Allow `/` y `/llms.txt` |
| ChatGPT-User | Allow `/` |
| OAI-SearchBot | Allow `/` |
| ClaudeBot | Allow `/` y `/llms.txt` |
| PerplexityBot | Allow `/` |
| Google-Extended | Allow `/` |
| Googlebot / bingbot | Allow `/` (bingbot con `Crawl-delay: 5`) |
| CCBot, anthropic-ai, cohere-ai | Sin regla específica → heredan `User-agent: *` → **permitidos** (el skill sugiere bloqueo opcional solo-entrenamiento) |

`/legal`, `/privacy`, `/cookies` bloqueados para todos — correcto, son páginas sin valor de cita.

## llms.txt: presente, bien formado, pero incompleto

`public/llms.txt` (idéntico en `dist/llms.txt` y en producción vía `curl`) sigue la convención de llmstxt.org: H1, blockquote resumen, secciones H2. Contiene NAP, servicios, contacto, founder.

**Hallazgo:** la lista "Main Content" solo enlaza `/` y `/en/`. Las 6 páginas de mayor densidad de citas potenciales (`/subvenciones/`, `/subvenciones/pyme-digital-granada/`, `/subvenciones/kit-digital-granada/`, `/subvenciones/leader-digitalizacion/`, `/subvenciones/ayudas-andalucia/`, `/subvenciones/ayudas-aragon/`) no aparecen en `llms.txt`.
- Severidad: **Alta**
- Evidencia: `public/llms.txt` líneas 9-11 (`## Main Content`); páginas confirmadas en `src/pages/subvenciones/*.astro` y en `dist/sitemap-0.xml`.
- Recomendación: añadir una sección `## Subvenciones y ayudas` en `public/llms.txt` listando las 6 URLs con una línea de descripción cada una (formato ya usado en "Services"). No requiere tocar plantillas ni crear páginas.
- Check de falsabilidad: `curl https://www.rpidev.com/llms.txt | grep subvenciones` debe devolver ≥6 líneas.
- Indicador adelantado: aparición de `/subvenciones/*` citado por Perplexity/ChatGPT en Search Console de terceros o en logs de `GPTBot`/`PerplexityBot` a esas rutas (actualmente solo se puede verificar indirectamente vía logs de servidor, no hay tracking de "AI referrer" implementado).

**No existe RSL 1.0** (`/llms.xml` o licencia RSL enlazada desde `llms.txt`/`robots.txt`): ambos endpoints comprobados devuelven 502 (mismo código que cualquier ruta inexistente en este servidor, ver hallazgo de infraestructura más abajo).
- Severidad: Baja (RSL es un estándar emergente, no crítico en sep-2026, pero cuesta poco declarar términos de uso explícitos frente a bots de entrenamiento).
- Recomendación: opcional, no prioritario. Si se quiere, añadir bloque de licencia en `public/llms.txt` bajo `## Optional` indicando términos de reutilización.

## Citabilidad a nivel de pasaje

### Páginas de subvenciones — punto fuerte del sitio
`src/pages/subvenciones/pyme-digital-granada.astro`, `kit-digital-granada.astro`, `leader-digitalizacion.astro`, `ayudas-andalucia.astro`, `ayudas-aragon.astro`, `index.astro`:
- H2 en forma de pregunta ("Cuándo abre...", "Cuánto dinero es en realidad...").
- Bloque de "respuesta directa" explícito en `kit-digital-granada.astro` líneas 121-126, con la pregunta como `<p class="font-bold">` seguida de respuesta autocontenida en 2-3 frases — exactamente el patrón que citan AI Overviews/Perplexity.
- FAQ schema (`FAQPage`) + `Article` schema con `datePublished`/`dateModified` + `BreadcrumbList` en las 6 páginas.
- Fechas de "última verificación" visibles en el HTML (no solo en JSON-LD), reforzando frescura ante el usuario y ante el LLM que lee el texto plano.
- Cifras específicas con atribución de fuente y sección "Fuentes oficiales" con enlaces salientes a Cámara Granada, BOE, Red.es — señal fuerte de verificabilidad para RAG.

Verificación de longitud de pasaje: los `<p>` de respuesta directa en `pyme-digital-granada.astro` (p.ej. líneas 218-226, sección "Qué es") están en el rango ~40-90 palabras por párrafo, ligeramente por debajo del óptimo de 134-167 palabras para citación cuando se miden como bloque único, pero se compensan por venir troceados en 2-3 párrafos consecutivos bajo el mismo H2 (el LLM concatena el bloque completo de sección, que sí cae en 150-250 palabras).
- Severidad: Baja/informativa.
- Recomendación: para las secciones clave ("Qué es", "Cuánto dinero"), fusionar el primer párrafo en un único bloque de 134-167 palabras que responda la pregunta del H2 sin depender de los párrafos siguientes, por si el extractor solo toma el primer `<p>` tras el heading.
- Check de falsabilidad: contar palabras del primer `<p>` tras cada `<h2>` en las 6 páginas; objetivo 134-167.
- Indicador adelantado: en pruebas manuales de citación (pegar la URL en ChatGPT/Perplexity y preguntar "¿cuánto da Pyme Digital Granada?"), la respuesta reproduce la cifra completa (6.366,50 €) y no solo "7.000 €".

### Homepage — landing corta, no artículo
`src/pages/index.astro` + secciones (`Hero.astro`, `Problem.astro`, `Services.astro`, `Plan.astro`, `Portfolio.astro`, `Subvenciones.astro`, `Contact.astro`): contenido SSR total ≈400-820 palabras (medido con `extracted_text` del fetch en vivo y con extracción cruda de `dist/index.html`), repartido en frases cortas de eslogan/UI. Ningún párrafo alcanza el rango 134-167 palabras porque es una landing de conversión, no un artículo.
- Severidad: Media (afecta solo a queries genéricas tipo "quién ofrece automatización con n8n en Granada"; las queries específicas de subvenciones ya están bien cubiertas).
- Evidencia: `src/i18n/ui.ts` — `hero.subtitle`, `problem.footer`, `services.items[].desc` son frases de 10-30 palabras.
- Recomendación: el `FAQPage` JSON-LD ya embebido en `src/layouts/Layout.astro` (líneas 274-368) contiene las respuestas largas y correctas (40-80 palabras) que faltan en el HTML visible. Evaluar renderizar 2-3 de esas preguntas como texto visible (no solo JSON-LD) en `Contact.astro` o `Plan.astro`, ya que los LLM leen el DOM/texto extraído con más peso que el JSON-LD puro para citación conversacional (el JSON-LD sí ayuda a AI Overviews/rich results de Google).
- Check de falsabilidad: comparar si las respuestas de FAQPage aparecen citadas en Google AI Overview (que sí parsea `FAQPage`) vs. en ChatGPT/Perplexity (que priorizan texto plano) para las mismas preguntas.
- Indicador adelantado: diferencia de tasa de citación homepage vs. subvenciones en herramientas de tracking de menciones LLM, si se instrumenta `ai_opt_llm_ment_search` de DataForSEO.

### Contenido de casos de éxito existe pero no se publica
`src/content.config.ts` define una content collection `proyectos` con schema rico: `challenge`, `solution`, `results` (array), `testimonial`, `testimonialAuthor`. Los 10 archivos en `src/content/proyectos/*.md` (p.ej. `amacapricci.md`) contienen datos citables de alto valor: métricas concretas ("Lighthouse Performance: 98+", "TTFB < 200ms"), reto/solución/resultado — el formato que AI Overviews y Perplexity prefieren para "estudios de caso".
- Severidad: **Alta** (contenido ya escrito, cero coste de creación, actualmente inaccesible a cualquier bot).
- Evidencia: `grep -rn "getCollection" src` no devuelve ningún uso de la colección `proyectos` fuera de `content.config.ts`; `Portfolio.astro` usa un array hardcodeado (`projectData` + `t(lang,'portfolio.projects')`) con descripciones de una frase, no el Markdown de la colección.
- Recomendación: **no crear páginas nuevas** (según preferencia registrada del usuario). En su lugar: (a) enriquecer el JSON-LD de cada proyecto embebiéndolo como `CreativeWork`/`Service` con `result` dentro del schema existente de `Portfolio.astro`, o (b) exponer el `results` array como texto visible en la cara trasera de la flip-card en `src/components/sections/Portfolio.astro` (líneas 97-124), sustituyendo o complementando `desc`. Presentar como opción antes de implementar, conforme a la nota de memoria del proyecto.
- Check de falsabilidad: `grep -rn "getCollection('proyectos')" src` debe devolver al menos un resultado tras el cambio.
- Indicador adelantado: aumento de longitud de `extracted_text` en la sección Portfolio del `render_page.py` de la homepage, y aparición de cifras concretas (98+, <200ms) en el texto plano indexable.

## Autoría y señales de marca

- `<meta name="author" content="Rubén Pérez Izuel">` presente en `src/layouts/Layout.astro:41` y `src/layouts/LayoutStatic.astro:43` — correcto y consistente en todas las páginas.
- `Person` + `Organization` schema con `@id` enlazados vía `founder`/`worksFor` (`Layout.astro` líneas 236-248) — buena práctica para entity resolution en Knowledge Graph / RAG.
- `sameAs`: LinkedIn, GitHub, Instagram, Facebook, YouTube (organización) y LinkedIn/GitHub/Instagram (persona). **YouTube es el mayor predictor de citación IA (~0.737 correlación)** según los datos de referencia, pero el canal solo está enlazado en `sameAs`, sin contenido de vídeo evidenciado ni transcripciones enlazadas desde el sitio.
  - Severidad: Media.
  - Recomendación: si el canal de YouTube tiene o va a tener vídeos (demos de proyectos, explicación de subvenciones), enlazarlos desde las páginas de subvenciones/portfolio con `VideoObject` schema, no solo desde `sameAs` global. Si el canal está vacío/inactivo, evaluar si mantenerlo en `sameAs` (un `sameAs` a un perfil vacío no aporta y puede diluir la señal de entidad).
  - Check de falsabilidad: `curl -s https://www.youtube.com/@rpidev` — comprobar si hay vídeos publicados.
  - Indicador adelantado: ninguno hasta que exista contenido; una vez publicado, medir aparición de "rpidev" en resultados de YouTube dentro de Perplexity/AI Overviews.
- Sin presencia verificada en Reddit o Wikipedia (esperable para un negocio local pequeño; no es un déficit corregible a corto plazo, solo una limitación estructural del perfil de autoridad).
- No hay página `/en/subvenciones/` — el contenido más citable (con cifras, fechas, FAQ) solo existe en español. Coherente con el mercado objetivo (Granada, España), pero limita citación en ChatGPT/Perplexity para queries en inglés sobre ayudas España.
  - Severidad: Baja (fuera de alcance salvo que haya demanda de audiencia angloparlante).

## Accesibilidad técnica para crawlers IA

- **SSR real, no CSR**: `render_page.py --mode auto` detectó `is_spa: False` — Astro genera HTML estático en build (`output: 'static'` implícito, sin integraciones SSR). Confirmado además comparando `dist/index.html` (contenido completo en el HTML fuente) con el resultado del fetch en vivo. Esto es la señal técnica más importante y está resuelta correctamente: ningún bot de IA necesita ejecutar JS para leer el contenido.
- La homepage usa transform CSS (`.section-hidden`/`.section-visible`, ver `src/styles/global.css` líneas 92-98) para el efecto de scroll tipo "snake", no `display:none` ni renderizado condicional — el texto de las 7 secciones está en el DOM inicial y es extraíble sin ejecutar JS. Correcto.
- **Content-Type sin charset**: la respuesta HTTP de `https://www.rpidev.com/` devuelve `content-type: text/html` (sin `; charset=utf-8`), dependiendo únicamente de `<meta charset="UTF-8">` en el `<head>` (`Layout.astro:38`, `LayoutStatic.astro:40`) para la decodificación correcta.
  - Severidad: Media.
  - Evidencia: `curl -sI https://www.rpidev.com/` → `content-type: text/html`. El propio fetch del skill de auditoría (`render_page.py`, basado en trafilatura) decodificó mal acentos en `extracted_text` ("AutÃ³nomo" en vez de "Autónomo"), confirmando que al menos un pipeline de extracción de texto real sufre mojibake por esta causa.
  - Recomendación: en el servidor (nginx, ver `nginx-security-headers.conf`) añadir `charset utf-8;` o `add_header Content-Type "text/html; charset=utf-8"` para las respuestas HTML. Revisar también la config de Plesk/nginx que sirve el sitio (headers muestran `x-powered-by: PleskLin`), no solo el repo del proyecto.
  - Check de falsabilidad: `curl -sI https://www.rpidev.com/ | grep -i charset` debe devolver `charset=utf-8`.
  - Indicador adelantado: re-ejecutar `render_page.py` sobre la home y comprobar que `extracted_text` ya no contiene secuencias `Ã.` en palabras con tilde/ñ.
- **Rutas inexistentes devuelven 502 en vez de 404**: `curl -o /dev/null -w "%{http_code}" https://www.rpidev.com/this-does-not-exist-xyz` → `502`. Esto es un problema de infraestructura (Plesk/nginx/reverse proxy), fuera del código del repo, pero relevante para GEO porque un 502 en vez de 404 puede hacer que crawlers de IA reintenten, bajen la prioridad de crawl del dominio, o interpreten temporalmente el sitio como caído.
  - Severidad: Media-Alta (aunque fuera del alcance del código Astro).
  - Recomendación: revisar la configuración del servidor/proxy (fuera de `src/`) para que rutas no encontradas devuelvan `404` correctamente en vez de `502`.
  - Check de falsabilidad: mismo comando `curl`, esperar código `404`.
  - Indicador adelantado: ninguno específico de GEO; monitorizar Search Console/logs de crawl errors.
- `robots.txt` y `llms.txt` idénticos entre `public/`, `dist/` y producción — pipeline de build/deploy consistente, sin riesgo de desincronización.
- `astro.config.mjs` con `trailingSlash: 'always'` y `sitemap` integration activa (`sitemap-index.xml` accesible) — buena señal de estructura de URLs consistente para crawl.

## Top 5 cambios de mayor impacto

1. **Añadir las 6 URLs de `/subvenciones/*` a `public/llms.txt`.** Esfuerzo: bajo (editar 1 archivo de texto). Impacto: alto — es el contenido con FAQ schema y cifras más citables del sitio y hoy es invisible para cualquier LLM que solo lea `llms.txt` como índice.
2. **Corregir el `Content-Type` HTTP para incluir `charset=utf-8`.** Esfuerzo: bajo (config de servidor, no de Astro). Impacto: medio-alto — afecta directamente a la fidelidad del texto extraído (tildes/ñ) que cualquier pipeline de citación consume.
3. **Exponer el `results`/`challenge`/`solution` de la content collection `proyectos` en `Portfolio.astro`.** Esfuerzo: medio (contenido ya existe, solo falta conectarlo; requiere confirmación del usuario por la preferencia de no crear páginas nuevas, pero esto es enriquecer una sección existente). Impacto: alto — añade prueba social con métricas concretas, justo el formato que motores de IA prefieren citar como caso de éxito.
4. **Fusionar el primer párrafo de cada H2 de las páginas de subvenciones en un bloque único de 134-167 palabras.** Esfuerzo: bajo-medio (edición de copy en 6 archivos `.astro`). Impacto: medio — optimiza para extractores que solo toman el primer `<p>` tras un heading.
5. **Corregir el código de error 502 en rutas inexistentes → 404.** Esfuerzo: bajo (config nginx/Plesk, fuera del repo Astro). Impacto: medio — mejora la señal de salud del dominio ante crawlers, aunque no es un problema de citabilidad directa.

## Scores por plataforma (estimación cualitativa, sin acceso a herramientas DataForSEO en esta sesión)

| Plataforma | Score estimado | Razonamiento |
|---|---|---|
| Google AI Overviews | 80/100 | Explota bien `FAQPage`/`Article`/`BreadcrumbList` JSON-LD; Google-Extended permitido; fechas de artículo correctas |
| ChatGPT Search | 75/100 | GPTBot/OAI-SearchBot/ChatGPT-User permitidos y `llms.txt` presente, pero incompleto (falta indexar subvenciones); prioriza texto plano, que en subvenciones es bueno y en home es débil |
| Perplexity | 78/100 | PerplexityBot permitido; fuentes oficiales enlazadas favorecen su modelo de citación con atribución; falta contenido multimedia/YouTube activo |
| Bing Copilot | 72/100 | bingbot permitido con `Crawl-delay: 5`; depende de indexación Bing tradicional, sin señales específicas adicionales verificadas en esta auditoría |

Nota: estos scores por plataforma son estimaciones basadas en configuración estática (robots.txt, schema, estructura), no en mediciones reales de citación. Para validarlos se recomienda instrumentar `ai_optimization_chat_gpt_scraper` / `ai_opt_llm_ment_search` (DataForSEO MCP) si están disponibles, o pruebas manuales periódicas de las preguntas del FAQ contra cada plataforma.

## Archivos referenciados

- `/home/ruben/Proyectos/rpidev-new/public/robots.txt`
- `/home/ruben/Proyectos/rpidev-new/public/llms.txt`
- `/home/ruben/Proyectos/rpidev-new/src/layouts/Layout.astro`
- `/home/ruben/Proyectos/rpidev-new/src/layouts/LayoutStatic.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/index.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/index.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/pyme-digital-granada.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/kit-digital-granada.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/leader-digitalizacion.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/ayudas-andalucia.astro`
- `/home/ruben/Proyectos/rpidev-new/src/pages/subvenciones/ayudas-aragon.astro`
- `/home/ruben/Proyectos/rpidev-new/src/content.config.ts`
- `/home/ruben/Proyectos/rpidev-new/src/content/proyectos/amacapricci.md`
- `/home/ruben/Proyectos/rpidev-new/src/components/sections/Portfolio.astro`
- `/home/ruben/Proyectos/rpidev-new/src/components/sections/Subvenciones.astro`
- `/home/ruben/Proyectos/rpidev-new/src/i18n/ui.ts`
- `/home/ruben/Proyectos/rpidev-new/astro.config.mjs`
