# Auditoría de Calidad de Contenido (E-E-A-T / AI-readiness) — rpidev.com

Alcance analizado: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/layouts/Layout.astro` / `LayoutStatic.astro`, `src/components/sections/Portfolio.astro`, `src/components/Footer.astro`, y las 6 páginas de `/subvenciones/*` (hub `index.astro` + 5 hijas: `kit-digital-granada`, `ayudas-andalucia`, `ayudas-aragon`, `leader-digitalizacion`, `pyme-digital-granada`). Verificado también en producción vía `curl` contra `https://www.rpidev.com` el 10/09/2026. No se ha modificado ningún fichero.

## Resumen
- Ninguna página de `/subvenciones/*` incumple el mínimo de palabras (todas ≥800 palabras de texto visible; el hub y `pyme-digital-granada` superan 1.500). El mínimo de contenido no es el problema de este sitio.
- El problema principal es de **integridad de las señales E-E-A-T** (schema roto), **profundidad desigual entre páginas hermanas** (patrón casi-programático en Aragón/Andalucía) y **una cita legal muy específica y no verificable** que sostiene gran parte del argumento de "Kit Digital pendiente".
- La página `pyme-digital-granada` es, con diferencia, la más sólida en E-E-A-T (cifras exactas, fuentes primarias con URLs reales de prensa/Cámara, fecha y hora exactas).

---

## Hallazgo 1 — Referencias `@id` de autor/organización rotas en todo `/subvenciones/*`
- **Severidad:** Alta
- **Evidencia:** Las 6 páginas de subvenciones declaran en su `articleSchema`:
  ```
  "author": { "@id": `${siteUrl}/#founder` },
  "publisher": { "@id": `${siteUrl}/#organization` },
  ```
  (idéntico en `index.astro:25-26`, `kit-digital-granada.astro:26-27`, `ayudas-andalucia.astro:26-27`, `ayudas-aragon.astro:26-27`, `leader-digitalizacion.astro:26-27`, `pyme-digital-granada.astro:27-28`). Pero estas páginas usan `LayoutStatic.astro`, que **no** emite ningún nodo `Person`/`Organization` con esos `@id` — ese `@graph` completo (con `jobTitle`, `sameAs`, dirección, etc.) solo existe en `Layout.astro`, usado únicamente por `index.astro` y `en/index.astro`. Verificado en producción: `curl -s https://www.rpidev.com/subvenciones/ | grep -o '"@type":"[A-Za-z]*"' | sort | uniq -c` devuelve solo `Answer`, `Article`, `BreadcrumbList`, `FAQPage`, `ListItem`, `Question` — cero `Person` y cero `Organization`. El string `#founder` aparece 1 sola vez en el HTML (la referencia), nunca la definición.
- **Recomendación:** Cada motor de búsqueda evalúa el JSON-LD por documento; una referencia `@id` a una entidad que no está declarada en la misma página normalmente no se resuelve (Google no une automáticamente `@graph`s de páginas distintas salvo casos muy concretos con `sameAs`/Merchant Center). Esto significa que, a ojos del rastreador, el `Article` de estas 6 páginas **no tiene autor ni editor identificable**, justo el tipo de señal de confianza que la QRG de sept. 2025 pide reforzar en contenido financiero/subvenciones. Corregir incluyendo el nodo `Person`/`Organization` completo (o al menos un `author`/`publisher` inline con `name`, `url`, `sameAs`) en el propio `articleSchema` de cada página de `/subvenciones/*`, sin necesidad de crear páginas nuevas.
- **Check de falsabilidad:** `curl -s https://www.rpidev.com/subvenciones/kit-digital-granada/ | grep -o '"@type":"Person"'` — si sigue sin aparecer, el hallazgo persiste.
- **Indicador adelantado:** Test de resultados enriquecidos de Google (`Rich Results Test`) sobre cualquier URL de `/subvenciones/*` debería dejar de mostrar advertencias de campos de autor/editor no resueltos una vez corregido.

---

## Hallazgo 2 — Cita legal única y no verificable como pilar argumental de 4 páginas
- **Severidad:** Alta
- **Evidencia:** La afirmación central de que "el Kit Digital no está abierto" se apoya en una única referencia normativa repetida literalmente en `index.astro`, `kit-digital-granada.astro`, `ayudas-andalucia.astro` y `ayudas-aragon.astro`:
  > "La Orden TDF/39/2026 (BOE 28/01/2026) reactivó el programa con fondos remanentes [...] pero a julio de 2026 Red.es aún no ha publicado los plazos concretos para nuevas solicitudes."

  y en `kit-digital-granada.astro:363` se enlaza como fuente oficial: `https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1426`. No hay ninguna otra fuente citada para esta orden ni una fecha de verificación independiente de esa URL concreta.
- **Recomendación:** Esta es la afirmación más "citable por IA" de todo el clúster (aparece en el FAQPage schema de 2 páginas y en el párrafo de respuesta directa de `kit-digital-granada`), y si el número de orden, la fecha de BOE o el enlace fueran incorrectos, se propagaría un error factual a AI Overviews/ChatGPT en 4 páginas simultáneamente. Verificar manualmente en boe.es que `BOE-A-2026-1426` corresponde efectivamente a la Orden TDF/39/2026 antes de dejar el contenido tal cual, y añadir la fecha de verificación de esa fuente concreta (no solo la fecha genérica de "última actualización" de la página).
- **Check de falsabilidad:** Abrir `https://www.boe.es/buscar/doc.php?id=BOE-A-2026-1426` y comprobar que el título/fecha coincide con "Orden TDF/39/2026" del 28/01/2026.
- **Indicador adelantado:** N/A — verificación manual puntual, no medible vía consola de Search Console; el riesgo se materializa como corrección/queja de usuario o desmentido en foros, no como métrica de rastreo.

---

## Hallazgo 3 — Contenido genérico/plantilla en Aragón y Andalucía frente a Granada/LEADER/Kit Digital
- **Severidad:** Media-Alta
- **Evidencia:** `ayudas-aragon.astro` y `ayudas-andalucia.astro` recurren repetidamente a la etiqueta de estado "🟡 Verificar convocatoria vigente" y a texto sin cifras verificables. Grep de la palabra "Verificar" (variantes): 8 apariciones en `ayudas-aragon.astro` y 8 en `ayudas-andalucia.astro`, frente a solo 1 en `kit-digital-granada.astro` y 1 en `leader-digitalizacion.astro` (0 en `pyme-digital-granada.astro`). Ejemplo textual (`ayudas-aragon.astro:262`):
  > "Porcentaje de ayuda | Variable según convocatoria — verificar en la Junta de Andalucía" *(nota: este texto concreto está en `ayudas-andalucia.astro:282`, ejemplo equivalente en Aragón: "Porcentaje de ayuda | Hasta el 50-80% de la inversión subvencionable (según convocatoria)")*
  y en `ayudas-andalucia.astro:282`: "Porcentaje de ayuda | Variable según convocatoria — verificar en la Junta de Andalucía". Ambas páginas comparten estructura idéntica sección por sección (Tabla de estado → Programa 1 "qué es/qué financia/fuentes" → Programa 2 → Programa 3 → LEADER regional → FAQ → Fuentes → CTA), con el nombre de la región y de los programas intercambiados pero el mismo patrón de frases ("Los plazos y porcentajes de cobertura varían según convocatoria — hay que verificar el estado en el momento de solicitar", casi idéntica en ambas). Word count en vivo confirma la brecha: Aragón 908 palabras vs. Pyme Digital Granada 1.556 palabras.
- **Recomendación:** Este patrón (misma plantilla, mismas frases de relleno, cifras sustituidas por "variable/verificar" cuando no se tiene el dato real) es exactamente el que Google identifica como "scaled/programmatic content" de bajo valor cuando no aporta información verificada específica por página — ver sub-skill `seo-programmatic` para el patrón general. Recomendación: o bien completar estas dos páginas con datos reales verificados (porcentajes exactos, fechas de convocatoria, importes) al mismo nivel que `pyme-digital-granada`/`leader-digitalizacion`, o bajar la ambición de la página (title/H1) para no prometer "guía completa" cuando el contenido es un directorio de enlaces a fuentes externas.
- **Check de falsabilidad:** Releer ambas páginas dentro de 3-6 meses; si las cajas "Verificar convocatoria vigente" y "Variable según convocatoria" siguen sin actualizarse con datos concretos, el contenido sigue siendo genérico por diseño, no por desactualización puntual.
- **Indicador adelantado:** Tiempo medio en página / scroll depth de estas dos URLs en Analytics sensiblemente por debajo del resto del clúster de subvenciones sería la señal de comportamiento de usuario que confirmaría el problema antes de ver caída de rankings.

---

## Hallazgo 4 — Duplicación literal de bloques de contenido entre el hub y las páginas hijas
- **Severidad:** Media
- **Evidencia:** La tabla de bonos del Kit Digital (`Segmento I/II/III — 12.000€/6.000€/2.000-3.000€`) está copiada palabra por palabra en `index.astro`, `kit-digital-granada.astro` y `ayudas-aragon.astro`. El párrafo sobre LEADER y Granada se repite casi verbatim en al menos 4 ficheros, por ejemplo:
  > "Granada es la provincia con mayor asignación LEADER de toda Andalucía (~22 M€)" — aparece en `ayudas-andalucia.astro:358`, `index.astro:333`, `kit-digital-granada.astro:297`, y variantes ("~22 M€ hasta 2029" / "casi 22 millones de euros") en `leader-digitalizacion.astro` (líneas 124, 170, 290, 347).
- **Recomendación:** La duplicación entre hub y detalle es una práctica SEO legítima (resumen + enlace "ver guía completa"), pero aquí varios párrafos completos se repiten sin variación real de valor añadido, lo que diluye la señal de contenido único por URL. Sustituir los resúmenes duplicados en el hub por versiones realmente resumidas (1 frase + dato clave + enlace) en vez de reutilizar el párrafo completo de la página hija, y centralizar datos que cambian con el tiempo (el bono del Kit Digital, la cifra de LEADER) en un solo lugar de referencia para evitar que una futura actualización deje cifras inconsistentes en unos ficheros sí y en otros no.
- **Check de falsabilidad:** `grep -c "22 M€\|22 millones" src/pages/subvenciones/*.astro` — si el número de ficheros con la cifra baja tras una edición y sigue siendo consistente entre ellos, está resuelto; si en el futuro cambia el dato en un fichero y no en los demás, confirma el riesgo de inconsistencia señalado.
- **Indicador adelantado:** Google Search Console → informe de páginas indexadas mostrando alguna de las páginas de subvenciones como "Duplicada, Google eligió una URL canónica distinta a la del usuario" sería la alerta temprana de que el buscador está tratando estos párrafos compartidos como señal de duplicidad.

---

## Hallazgo 5 — FAQ con la misma pregunta y respuestas distintas en dos páginas (riesgo de conflicto en Featured Snippet / AI Overview)
- **Severidad:** Media
- **Evidencia:** La pregunta `"¿Tengo que adelantar el dinero de la inversión?"` aparece literalmente igual en el `faqSchema` de `index.astro` (líneas 76-81) y en `pyme-digital-granada.astro` (líneas 66-71), pero con respuestas distintas y no intercambiables:
  - `index.astro`: "Depende del programa. En LEADER generalmente sí [...] En Kit Digital funciona diferente: el bono se aplica directamente al pago al proveedor [...]"
  - `pyme-digital-granada.astro`: "Sí. La empresa prefinancia el 100% del proyecto y recibe la ayuda del 85% después de justificarlo. No funciona como el bono del Kit Digital [...]"
- **Recomendación:** Al ser la misma pregunta textual con `FAQPage` markup en dos URLs distintas del mismo dominio, Google puede mostrar cualquiera de las dos como rich result o fuente de AI Overview para esa consulta — si un usuario/IA cruza ambas páginas puede leer respuestas aparentemente contradictorias (una dice "depende", la otra dice "sí" sin matices). Renombrar la pregunta del hub a algo más genérico ("¿Cómo funciona el pago de las ayudas: adelanto o bono?") para que no compita textualmente con la pregunta específica de Pyme Digital.
- **Check de falsabilidad:** Buscar en Google `site:rpidev.com "tengo que adelantar el dinero"` y comprobar si aparecen ambas URLs con extractos distintos para la misma consulta.
- **Indicador adelantado:** Google Search Console → Rendimiento → filtrando por la consulta "adelantar dinero subvención" (o similar), ver si el CTR se reparte de forma errática entre las dos URLs (señal de que Google no tiene claro cuál priorizar).

---

## Hallazgo 6 — Sin firma de autor visible ni credenciales en el cuerpo de las páginas de subvenciones (contenido financiero/YMYL-adjacent)
- **Severidad:** Media
- **Evidencia:** Ninguna de las 6 páginas de `/subvenciones/*` muestra en el HTML visible (no JSON-LD) el nombre del autor, su cargo o experiencia. `grep` de "Rubén", "años de experiencia", "escrito por" en el `<main>` de estas páginas no arroja resultados; el único lugar donde aparece "Rubén Pérez Izuel" es la meta `<meta name="author">` (invisible) y el JSON-LD del homepage (que, por el Hallazgo 1, no está enlazado a estas páginas). El pie de cada página solo tiene: *"Última actualización: [fecha]. Los plazos y condiciones de cada programa pueden cambiar. Consulta siempre las fuentes oficiales [...]"* — un disclaimer, no una atribución de autoría.
- **Recomendación:** Añadir una línea visible tipo "Por Rubén Pérez Izuel — desarrollador web, colabora como proveedor técnico en proyectos de Kit Digital/LEADER" junto a la fecha de actualización en cada página de subvenciones (sin crear páginas nuevas, solo añadir un bloque de texto reutilizable en el layout o en cada página). Es contenido sobre dinero público y plazos administrativos: la QRG de sept. 2025 espera señales explícitas de quién firma el contenido, no solo metadatos ocultos.
- **Check de falsabilidad:** Ver el HTML renderizado de cualquier página de `/subvenciones/*` y comprobar si existe un elemento de texto visible (no `<meta>`, no `<script>`) con el nombre del autor.
- **Indicador adelantado:** N/A directo en GSC; se podría verificar cualitativamente contrastando futuras capturas de "cómo cita esta página" en AI Overviews/Perplexity — si citan solo "rpidev.com" sin atribuir a un autor, confirma la ausencia de señal de autoría reconocible.

---

## Hallazgo 7 — Señales de "verificación reciente" desactualizadas respecto a la fecha actual
- **Severidad:** Media
- **Evidencia:** Hoy es 10/09/2026. `kit-digital-granada.astro` muestra "Última verificación: 2 julio 2026" (más de 2 meses) junto a la afirmación "la apertura es inminente" y "conviene estar preparado para entrar en cuanto abra". `ayudas-andalucia.astro` y `ayudas-aragon.astro` también fechan su última verificación el "2 julio 2026". Solo `pyme-digital-granada.astro` y el hub `index.astro` tienen verificación de "20 julio 2026", más reciente pero también con más de 7 semanas de antigüedad frente a hoy.
- **Recomendación:** Estas páginas se posicionan explícitamente como "estado real y verificado" y "qué está abierto hoy" — la propuesta de valor central es la frescura. Con más de 2 meses sin repasar el estado del Kit Digital (que la propia página describe como de apertura "inminente"), existe riesgo real de que la información mostrada como actual ya no lo sea (p. ej. si Red.es publicó plazos en agosto). Establecer una cadencia de revisión (mensual como mínimo mientras el Kit Digital siga "pendiente") y actualizar `dateModified` + el texto "Última verificación" en el mismo commit que cualquier revisión real de contenido.
- **Check de falsabilidad:** Comparar la fecha "Última verificación" mostrada en cada página con la fecha del sistema en el momento de la lectura; si la diferencia supera ~4-6 semanas de forma sistemática, el hallazgo se mantiene vigente.
- **Indicador adelantado:** Si Red.es publica una convocatoria de Kit Digital antes de que se actualice la página, un usuario o la propia IA (AI Overview) podría citar rpidev.com como fuente desactualizada — vigilar menciones/capturas de terceros citando esta página con información ya superada.

---

## Hallazgo 8 — Ausencia de testimonios/casos de éxito con métricas en la home (mitigado parcialmente por el portfolio)
- **Severidad:** Baja
- **Evidencia:** `grep` de "testimonio", "caso de éxito", "cliente" en `src/pages/index.astro` y `src/components/sections/*.astro` no devuelve resultados. `Portfolio.astro` sí lista 11 proyectos reales con URL en producción verificable (`fpcinstalaciones.com`, `agropur.es`, `nievesmuriel.com`, etc.), lo cual aporta una señal de Experiencia real y comprobable, pero no hay ninguna cita textual de cliente, resultado cuantificado (p. ej. "aumento de leads", "horas ahorradas") ni fecha de entrega junto a esos proyectos.
- **Recomendación:** Aprovechar que ya existe la lista de proyectos reales añadiendo, para 2-3 de ellos, una frase corta con resultado medible o cita del cliente (aunque sea informal, tipo WhatsApp/email con permiso). No requiere página nueva, solo enriquecer el array `projectData`/`portfolio.projects` ya existente en `Portfolio.astro` e i18n.
- **Check de falsabilidad:** Releer `src/components/sections/Portfolio.astro` y el fichero i18n de textos del portfolio; si `desc` sigue siendo solo una descripción funcional del proyecto sin cifra ni cita, el hallazgo persiste.
- **Indicador adelantado:** N/A — mejora cualitativa de confianza, sin métrica de rastreo asociada; se podría valorar en el tiempo en página de la sección Portfolio si se instrumenta scroll tracking.

---

## Validación de checks estándar

| Check | Resultado |
|---|---|
| Mínimo de palabras por tipo de página (service page ≥800) | ✅ Pasa en las 6 páginas de subvenciones (908–1.926 palabras de texto visible en producción) |
| Mínimo de palabras (blog post ≥1.500) si se tratan como guías largas | ⚠️ Parcial — solo el hub (1.926) y `pyme-digital-granada` (1.556) lo superan; `kit-digital-granada` (1.306), `leader-digitalizacion` (1.319) y `ayudas-andalucia` (1.099) quedan por debajo; `ayudas-aragon` (908) es la más corta |
| E-E-A-T: Trustworthiness — contacto/transparencia | ✅ Pasa — teléfono, WhatsApp, email (`ruben@rpidev.com`), dirección física y CIF/legal, cookies/privacy/legal existen como páginas propias |
| E-E-A-T: Authoritativeness — enlaces a fuentes oficiales externas | ✅ Pasa en general (BOE, Red.es, Junta de Andalucía, Cámara Granada, IAF, REDR); ⚠️ ver Hallazgo 2 sobre la fiabilidad de la cita BOE concreta |
| E-E-A-T: Expertise — autoría visible en el contenido | ❌ Falla (Hallazgo 6) |
| E-E-A-T: Experience — señales de primera mano | ⚠️ Parcial — portfolio con proyectos reales y verificables (bien), pero sin testimonios/resultados cuantificados (Hallazgo 8) y sin relato de experiencia directa gestionando expedientes de subvención en el propio texto de las páginas de ayudas |
| Contenido duplicado/thin entre páginas hermanas | ❌ Falla — Hallazgos 3 y 4 |
| AI-citation readiness: bloques de "respuesta directa" + FAQ schema | ✅ Pasa en `kit-digital-granada` y `leader-digitalizacion` (caja "lo que las IA extraen" explícita); ⚠️ Aragón/Andalucía no tienen ese bloque de respuesta directa, solo tabla de estado |
| Legibilidad (proxy: longitud media de frase) | ✅ Pasa en general (18-22 palabras/frase); ⚠️ `ayudas-aragon` destaca con ~27,5 palabras/frase, coherente con su contenido más genérico (Hallazgo 3) — medido con un script propio (words/sentence split), no con una librería de legibilidad estandarizada; tratar como indicativo, no como puntuación oficial |
