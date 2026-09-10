# SXO Gap Analysis — rpidev.com

Fecha: 2026-09-10
Alcance: `https://www.rpidev.com/` (SPA homepage) + subpáginas indexadas en sitemap (`/subvenciones/`, `/subvenciones/kit-digital-granada/`, `/subvenciones/ayudas-andalucia/`, `/subvenciones/ayudas-aragon/`, `/subvenciones/leader-digitalizacion/`, `/subvenciones/pyme-digital-granada/`).

Nota: la puntuación SXO aquí descrita es un **SXO Gap Score**, independiente del SEO Health Score técnico.

---

## Inventario real del sitio (sitemap)

Solo 8 URLs indexables en `sitemap-0.xml`: home ES, home EN, `/subvenciones/` y 5 guías de ayudas. **No existe ninguna URL dedicada** para "desarrollo web Granada", "automatización pymes Granada" ni "kit digital Granada" como página de servicio — esos temas viven como secciones ancla (H2/H3) dentro del único H1 de la home.

---

## Hallazgo 1 — Ausencia total en SERP para las keywords de servicio principales

**Severidad:** CRÍTICA

**Evidencia (SERP real vía Google/WebSearch):**
- "desarrollo web Granada": resultados 100% páginas de agencia dedicadas (Beedigital, Citysem, Wit Creativo, Just Quality, Idento...). `rpidev.com` no aparece.
- "automatización pymes Granada": dominan agencias especializadas en IA/automatización (ForgeNEX, Stepwise, Upliora, TACTO, asesor-ia.io). `rpidev.com` no aparece.
- "kit digital Granada" (intención de servicio/gestoría): dominan "agentes digitalizadores" acreditados (inforges.es, kitdigitalgranada.com, incorporamarketing.es, Amarillo Limón). `rpidev.com` no aparece.

**Diagnóstico:** RPIDev intenta posicionar 4 servicios distintos (Desarrollo Web, Automatización, Integraciones/IoT, Consultoría) con una única URL (la home), cuyo H1 es "Desarrollo Web, Automatización de Procesos y Consultoría Digital para Pymes en Granada". Los competidores que sí aparecen tienen una página dedicada y monotemática por servicio+ciudad. Esto es dilución de relevancia temática, no solo un problema de autoridad.

**Recomendación:** Crear páginas de servicio dedicadas (una por intención: desarrollo web Granada, automatización de procesos Granada, consultoría digital Granada), cada una con H1 monotemático, proceso, casos de portfolio filtrados por servicio y CTA propio. **Esto implica páginas nuevas standalone — según memoria del proyecto, presentar como propuesta y esperar confirmación explícita antes de implementar, no crear directamente.**

**Check de falsabilidad:** Si en 60-90 días tras publicar páginas dedicadas indexadas rpidev.com sigue sin aparecer en el top 20 de Google Search Console para estas 3 consultas, la causa no es de tipo de página sino de autoridad/backlinks — habría que descartar esta hipótesis y revisar E-E-A-T/enlaces.

**Indicador adelantado:** Impresiones en Search Console para las consultas "desarrollo web Granada", "automatización pymes Granada", "kit digital Granada" (actualmente probablemente ~0); aparición de la URL en el informe de cobertura de búsqueda de Google.

---

## Hallazgo 2 — Mismatch de tipo de página en "kit digital Granada": informativo vs. transaccional-servicio

**Severidad:** ALTA

**Evidencia:** El consenso SERP para "kit digital Granada" combina dos tipos: (a) páginas de **Agente Digitalizador acreditado** (Service Page: proceso de gestión de la ayuda, "te tramitamos el Kit Digital") y (b) contenido informativo de estado. La página de RPIDev (`/subvenciones/kit-digital-granada/`) usa schema `Article` + `FAQPage`, formato de guía informativa ("estado, convocatoria y cómo prepararse"), pero **no menciona "agente digitalizador" en ningún punto del texto** (verificado por grep sobre el HTML renderizado) y solo tiene 2 CTAs de contacto genérico (cal.com) en 1.392 palabras.

**Diagnóstico:** RPIDev sí es "proveedor técnico" en estos programas (lo dice en el FAQ de la home: "Tenemos experiencia como proveedor técnico..."), pero esa proposición de valor transaccional no se traslada a la página que específicamente compite por la keyword "kit digital Granada". El usuario que busca esa keyword con intención de contratar gestión no encuentra ese ángulo aquí.

**Recomendación:** Añadir una sección explícita en `/subvenciones/kit-digital-granada/` (y en pyme-digital-granada, ayudas-aragon, ayudas-andalucia) tipo "Cómo te ayudo a solicitarla" con lenguaje de agente/gestor, mencionando explícitamente el rol de proveedor técnico, y un CTA de mayor compromiso ("Solicita que te prepare el presupuesto para el Kit Digital") en vez de solo el genérico de diagnóstico.

**Check de falsabilidad:** Medir CTR y conversión (clics a cal.com) en esta página antes/después del cambio. Si no mejora la tasa de contacto tras 30 días con tráfico estable, el mismatch no era la causa principal.

**Indicador adelantado:** Ratio de clics al CTA de contacto / sesiones en `/subvenciones/kit-digital-granada/` (actualmente sin medir explícitamente aparte del genérico del footer).

---

## Hallazgo 3 — Las páginas de subvenciones sí están alineadas con el consenso SERP (punto fuerte a proteger)

**Severidad:** ALINEADO (hallazgo positivo, no acción urgente)

**Evidencia:** Para consultas informativas de ayudas ("LEADER digitalización Granada subvención", "ayudas digitalización Andalucía"), `rpidev.com/subvenciones/` y `rpidev.com/subvenciones/ayudas-andalucia/` **sí aparecen** en resultados de Google, compitiendo con mapasubvenciones.es, becasyayudas.com, inforges.es y fuentes oficiales (Junta de Andalucía). Estas páginas tienen schema `Article` + `FAQPage` + `BreadcrumbList`, 1.100-2.100 palabras, `publication_date` reciente (jul 2026), y estructura de guía (qué es, cuánto da, requisitos, cómo solicitar) — coincide con el tipo dominante en SERP (Guía/Blog informativo de subvenciones).

**Recomendación:** No tocar la estructura; replicar este patrón (Article+FAQ+Breadcrumb, freshness explícita, CTA de valoración gratuita) al crear las futuras páginas de servicio del Hallazgo 1.

**Check de falsabilidad:** Confirmar en Search Console que estas URLs efectivamente reciben impresiones/clics para esas consultas (no solo aparecer en una búsqueda puntual vía WebSearch).

**Indicador adelantado:** Posición media en Search Console para "ayudas digitalización Andalucía" / "kit digital estado 2026" — si ya es <20 esto es evidencia adicional a favor del hallazgo positivo.

---

## Hallazgo 4 — Techo de autoridad institucional en queries muy transaccionales/oficiales

**Severidad:** MEDIA (limitación estructural, no error de la web)

**Evidencia:** Para "pyme digital Granada 2026 cámara" y "ayudas digitalización Aragón", el SERP está dominado casi en su totalidad por fuentes oficiales (Cámara de Comercio Granada, Gobierno de Aragón, sede electrónica) y agregadores especializados (SubvenIA, UPTA Aragón). Ninguna consultora/agencia de terceros aparece en el top de estas dos consultas concretas; `rpidev.com/subvenciones/ayudas-aragon/` y `pyme-digital-granada/` no aparecen en esta muestra.

**Diagnóstico:** Para queries donde el usuario busca literalmente el trámite oficial, ninguna página de tipo "guía de tercero" va a desplazar a la fuente primaria — el objetivo realista no es el top 3 sino capturar el tráfico de cola larga ("cómo solicitar", "requisitos", "qué cubre") donde sí compiten guías de terceros.

**Recomendación:** Reorientar el KPI de estas páginas hacia variantes long-tail (ya cubiertas parcialmente por los H2 existentes) en vez de competir por la keyword corta+oficial. No se recomienda ninguna reestructuración de tipo de página.

**Check de falsabilidad:** Si tras 90 días las variantes long-tail (ej. "requisitos pyme digital Granada", "cómo solicitar ayudas digitalización Aragón") tampoco generan impresiones, revisar autoridad de dominio/enlaces, no el enfoque de contenido.

**Indicador adelantado:** Impresiones segmentadas por longitud de consulta (short-tail vs long-tail) en Search Console para estas 2 páginas.

---

## User Stories derivadas (citando señal SERP)

1. **Como autónomo con negocio en Granada que busca contratar una web**, quiero encontrar una agencia local con portfolio y precio orientativo, porque necesito visibilidad ya, pero estoy bloqueado por **no encontrar a RPIDev en el resultado** frente a Beedigital/Citysem/Just Quality. *(Fuente: SERP "desarrollo web Granada" — ausencia total)*. Etapa: consideración.

2. **Como pyme que quiere automatizar tareas repetitivas**, quiero un proveedor especializado en automatización en mi zona, porque pierdo horas semanales en tareas manuales, pero no encuentro a RPIDev entre las opciones (ForgeNEX, Stepwise, TACTO). *(Fuente: SERP "automatización pymes Granada")*. Etapa: consideración.

3. **Como pyme que necesita gestionar el Kit Digital**, quiero un agente digitalizador que tramite el papeleo por mí, porque no tengo tiempo ni conocimiento del proceso administrativo, pero la página de RPIDev que mejor rankea para "kit digital" no me ofrece explícitamente ese servicio de gestión. *(Fuente: competidores tipo "agente digitalizador" + ausencia del término en la página de RPIDev)*. Etapa: decisión.

4. **Como autónomo en zona rural de Granada/Aragón**, quiero saber qué ayuda de digitalización sigue abierta ahora mismo y cuánto cubre, porque las convocatorias cambian constantemente y temo perder el plazo, y en `/subvenciones/` y `/subvenciones/ayudas-andalucia/` SÍ encuentro esa respuesta clara con fecha de actualización. *(Fuente: presencia real en SERP de "LEADER digitalización Granada" y "ayudas digitalización Andalucía")*. Etapa: awareness/consideración — este journey SÍ está bien servido.

5. **Como pyme en Aragón buscando la convocatoria IAF 2026**, quiero información oficial y actualizada, porque el importe (10.000-50.000 €) es relevante para mi decisión de inversión, pero solo encuentro fuentes oficiales del Gobierno de Aragón, no a RPIDev. *(Fuente: SERP "ayudas digitalización Aragón" — dominado por gobierno/cámaras)*. Etapa: awareness.

---

## Persona Scoring

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Autónomo busca web en Granada (servicio) | 8/25 | 10/25 | 12/25 | 10/25 | 40/100 | Needs Work — página existe pero no aparece en su búsqueda real |
| Pyme busca automatización de procesos | 8/25 | 10/25 | 12/25 | 10/25 | 40/100 | Needs Work — mismo problema, sección diluida en la home |
| Pyme que quiere gestionar Kit Digital (transaccional) | 14/25 | 14/25 | 12/25 | 12/25 | 52/100 | Needs Work — contenido informativo correcto, falta framing de "agente/gestor" |
| Autónomo/pyme rural buscando LEADER/Andalucía (informativo) | 22/25 | 20/25 | 18/25 | 16/25 | 76/100 | Good — página bien alineada, mejorable en CTA de mayor compromiso |
| Pyme en Aragón buscando ayuda oficial (institucional) | 15/25 | 16/25 | 14/25 | 12/25 | 57/100 | Needs Work — techo de autoridad institucional, contenido correcto pero no visible |

**Persona más débil:** Autónomo busca web en Granada / Pyme busca automatización (empatados, 40/100).
**Problema principal:** No existe URL dedicada e indexable para estos dos servicios — es un problema de arquitectura de contenido, no de redacción.
**Fix recomendado:** Proponer (no implementar sin confirmación) páginas de servicio dedicadas por keyword, siguiendo el patrón ya validado de las páginas de subvenciones (Article+FAQ+Breadcrumb+freshness).

**Issue sistémico:** Dimensión "Relevance" es la más baja de forma consistente en las 3 personas de intención de servicio/institucional — confirma que el problema es de cobertura temática dedicada, no de UX superficial (títulos, CTAs, schema ya son correctos donde existen páginas dedicadas).

---

## Limitaciones

- WebSearch no reproduce el layout visual completo del SERP (no confirma con certeza presencia/ausencia de local pack, PAA exacto, ni AI Overview); los hallazgos de ausencia se basan en el top ~9 resultados devueltos por cada consulta, no en el ranking exacto por posición.
- No se ha verificado Google Search Console real (impresiones/posición histórica); los indicadores adelantados propuestos requieren acceso a esa cuenta para confirmarse.
- No se evaluó el rendimiento de `/subvenciones/ayudas-aragon/` y `/subvenciones/leader-digitalizacion/` con el mismo detalle de contenido que kit-digital-granada y pyme-digital-granada (se priorizó cerrar el análisis).
- Análisis realizado sobre snapshot puntual (10-sep-2026); las convocatorias de subvenciones mencionadas tienen fechas de cierre que cambiarán la vigencia de varios hallazgos (p. ej. Pyme Digital Granada cierra 30/10/2026).

---

## Siguiente paso sugerido

`/seo content` para profundizar en E-E-A-T de las páginas de subvenciones (autoría, credenciales como "proveedor técnico") y `/seo local` para evaluar Google Business Profile ante la ausencia en SERPs locales de servicio.

¿Genero un informe PDF? Usa `/seo google report`.
