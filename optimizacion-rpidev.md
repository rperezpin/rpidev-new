# Plan de optimización web — rpidev.com
**Fecha:** Julio 2026 · **Basado en:** Google Search Console (últimos 3 meses) + auditoría previa + estrategia de captación

---

## Resumen del diagnóstico

Los datos de Search Console cuentan una historia clara: la web tiene demanda real llegando (sobre todo por subvenciones en Granada), pero la está desperdiciando por tres motivos, en orden de gravedad:

1. **Crisis de indexación.** Solo 4-5 páginas indexadas frente a 23 sin indexar. Google conoce la web pero descarta el ~85% de ella por errores técnicos (8 páginas en 404, 6 con error 5xx, 4 con redirección, 3 con noindex, 2 rastreadas sin indexar). Ninguna estrategia de contenido funciona sobre esta base.
2. **/subvenciones/ atrae pero no convence.** 464 impresiones (5× más que la home) con solo 2 clics — CTR del 0,43% en posición media 10,7. Es la página con más potencial de toda la web y la que peor convierte su visibilidad.
3. **Demanda concentrada en "kit digital granada"** con posiciones mejorables (16-34) y ya hay posiciones top 10 en consultas de "nueva convocatoria 2026" sin haberlas trabajado.

Total actual: ~19 clics en 3 meses. El objetivo realista tras aplicar este plan: multiplicar por 5-10 en el siguiente trimestre, principalmente vía /subvenciones/.

---

## FASE 1 — Fixes técnicos (bloqueante: nada funciona sin esto)

### 1.1 Errores de indexación (de Search Console)

| Problema | Páginas | Acción |
|---|---|---|
| 404 No encontrado | 8 | Identificar cada URL en GSC → Indexación → Páginas. Si la página debe existir: restaurarla. Si no: redirección 301 a la página equivalente o dejar 404 solo si no hay equivalente lógico. |
| Error de servidor (5xx) | 6 | Prioridad máxima. Revisar logs de Arsys/Plesk. Si son intermitentes, suele ser límite de recursos del hosting o algún proceso del build de Astro. Verificar cada URL manualmente. |
| Página con redirección | 4 | Localizar qué enlaces internos o sitemap apuntan a URLs que redirigen, y actualizarlos para apuntar al destino final directamente. |
| Excluida por noindex | 3 | Verificar si el noindex es intencionado. Si son páginas que deberían posicionar, quitar la etiqueta. |
| Rastreada sin indexar | 2 | Suele resolverse solo al mejorar el enlazado interno y la calidad de contenido (Fases 2-3). Solicitar indexación manual en GSC tras mejorar. |

### 1.2 Canonicalización de dominio

- Elegir **rpidev.com** como dominio único (es donde está todo el histórico de GSC).
- Redirección 301 de **todo** rpidev.es → rpidev.com (página a página, no todo a la home).
- Verificar que solo existe una versión canónica: `https://www.rpidev.com` (con o sin www, pero solo una). Las demás variantes (http, sin www) → 301.
- Etiqueta `rel="canonical"` autorreferente en cada página.

### 1.3 Sitemap

- Regenerar el sitemap incluyendo **solo** URLs finales (código 200, indexables, canónicas). Ahora mismo, si el sitemap incluye URLs con 404/redirect/noindex, le está diciendo a Google que la web está descuidada.
- Reenviar en GSC y solicitar validación de los problemas corregidos ("Validar corrección" en cada categoría de error).

### 1.4 Verificación final de fase

Antes de pasar a la fase 2: en GSC, todas las categorías de error en estado "Validación iniciada" o resueltas, y el número de páginas indexadas subiendo semana a semana (ahora está estancado en 4-5 desde abril).

---

## FASE 2 — Estrategia de keywords (basada en datos reales de GSC)

### 2.1 Lo que dicen los datos

Las consultas con más impresiones NO son de desarrollo web, son de **subvenciones en Granada**:

| Consulta | Impresiones | Posición | Diagnóstico |
|---|---|---|---|
| kit digital granada | 83 | 16,2 | El premio gordo. A posición 5-8 son decenas de clics/mes. |
| subvención kit digital granada | 16 | 34,1 | Misma intención, posición muy mejorable. |
| ayudas kit digital granada | 13 | 33,5 | Ídem. |
| kit digital en granada | 9 | 12,9 | A un empujón del top 10. |
| kit digital nueva convocatoria 2026 | 3 | 6,7 | **Ya en top 10 sin trabajarlo.** Contenido de actualidad = oportunidad. |
| nueva convocatoria kit digital 2026 | 1 | 4,0 | Ídem. |
| kit digital plazos 2026 | 1 | 6,0 | Ídem. |
| agente digitalizador granada | 3 | 27,7 | Intención comercial directa. |
| kit consulting granada | 4 | 10,0 | Programa hermano del Kit Digital, sin competencia local. |

Conclusión: **Google ya ha decidido que rpidev.com es "la web de subvenciones de digitalización en Granada".** No luchar contra eso: reforzarlo, y usar esa puerta de entrada para vender los servicios.

### 2.2 Arquitectura de contenido propuesta

**Nivel 1 — Página pilar:** `/subvenciones/` (reescrita, ver Fase 3)
Keyword objetivo: "ayudas digitalización granada", "subvenciones digitalización pymes"

**Nivel 2 — Páginas hijas (una URL por programa, colgando de /subvenciones/):**

| URL | Keyword principal | Contenido clave |
|---|---|---|
| /subvenciones/kit-digital-granada/ | kit digital granada + variantes "2026", "convocatoria", "plazos" | Estado REAL del programa (sin convocatoria abierta para nuevos, Orden TDF/39/2026 solo reactiva remanentes de expedientes previos). Qué hacer mientras: prepararse + alternativas activas. Actualizar cada vez que Red.es publique algo. |
| /subvenciones/leader-digitalizacion/ | ayudas leader digitalización, subvención leader web | Ya tienes el contenido de los posts de LinkedIn. Hasta 65%, orden de llegada, GDR locales. Vigente hasta 2028. |
| /subvenciones/ayudas-aragon/ | ayudas digitalización pymes aragón, subvención comercio aragón | IAF digitalización (Orden PEJ/443/2026) + pequeño comercio Aragón. Indicar estado de cada ventana y fecha de última verificación. |
| /subvenciones/ayudas-andalucia/ | ayudas digitalización andalucía, subvención comercio andalucía | Línea comercio/artesanía (hasta 100%), RETECH, Pymetur. Misma lógica de fechas verificadas. |

Regla editorial (crítica para credibilidad y para no incumplir tu propio estándar): **cada página muestra "Última verificación: [fecha]" y solo afirma estados comprobados ese día contra la fuente oficial.** Nunca "Kit Digital abierto" si no lo está. La honestidad sobre el estado real es, además, un diferenciador frente a las webs de agentes digitalizadores que mantienen contenido caducado — y es justo lo que las IA premian al citar fuentes (ver Fase 5).

### 2.3 Keywords secundarias detectadas

- "kit consulting granada" (pos. 10) → mencionar Kit Consulting en la página de Kit Digital o darle sección propia. Casi nadie lo trabaja localmente.
- "agente digitalizador granada" (pos. 27,7) → si estás adherido como agente digitalizador, página o sección específica; es consulta de contratación directa.
- "web development" (32 imp., pos. 10,5, tráfico mayoritariamente extranjero — EE.UU. 105 impresiones) → **ignorar**. No es tu cliente. No invertir en la versión /en/ por ahora.
- "automation consultant near me" (pos. 1) → señal de que Google te asocia a automatización local. Refuerza la futura página de servicio de automatización con enfoque local.

### 2.4 Qué NO perseguir

- Keywords genéricas de "diseño web" a nivel nacional: competencia brutal, intención difusa.
- Tráfico internacional (EE.UU., Países Bajos...): impresiones sin valor comercial para ti.
- Cualquier keyword de Kit Digital redactada como si el programa estuviera abierto a nuevos: tráfico que rebota y riesgo reputacional.

---

## FASE 3 — Reescritura de /subvenciones/ (la página con más ROI de toda la web)

### 3.1 El problema exacto

464 impresiones → 2 clics. La gente la ve en Google y no entra. Eso es un problema de **title y meta description**, no de contenido. Y una vez dentro, la página debe convertir (problema 2).

### 3.2 Title y meta description

**Ahora (probable):** algo genérico tipo "Subvenciones - RPIdev".

**Propuesto:**
```html
<title>Ayudas y Subvenciones para Digitalizar tu Negocio [2026] | Granada y Aragón</title>
<meta name="description" content="Estado real y verificado de las ayudas de digitalización: Kit Digital, LEADER, ayudas de Andalucía y Aragón. Qué está abierto hoy, cuánto cubre cada una y cómo solicitarlas. Valoración gratuita.">
```

Claves del porqué: el año entre corchetes sube CTR en consultas "2026" (donde ya estás top 10); "estado real y verificado" es tu diferenciador; "qué está abierto hoy" responde a la intención exacta del buscador; "valoración gratuita" es el CTA que ya usas.

### 3.3 Estructura de la página pilar

1. **H1:** "Ayudas para digitalizar tu negocio: qué está abierto ahora mismo"
2. **Bloque de estado (arriba del todo):** tabla-resumen con cada programa, estado (🟢 abierta / 🟡 pendiente / 🔴 cerrada), % de cobertura y enlace a su página hija. Con "Última verificación: [fecha]". Este bloque es lo que la gente busca y lo que las IA citan.
3. **Bloque de captación:** "¿No sabes cuál te encaja? Te lo digo gratis en 24h" + formulario mínimo (nombre, negocio, provincia, contacto) o botón WhatsApp.
4. **Secciones por programa** (resumen 3-4 líneas + enlace a página hija).
5. **FAQ con schema** (ver Fase 5): "¿Está abierto el Kit Digital en 2026?", "¿Qué ayuda cubre una página web en Granada?", "¿Puedo combinar ayudas?", "¿Qué es un GDR de LEADER?".
6. **Prueba social:** proyectos reales tuyos ejecutados en sectores subvencionables (Agropur = agroalimentario, Casvisol = energía, Valdeferrín = comercio).

---

## FASE 4 — Conversión (aplicable a toda la web + landings de Ads)

### 4.1 Principios (de la estrategia acordada)

- **Una landing por ángulo de campaña**, no tráfico de pago a la home. Mínimo: landing subvenciones (puede ser la /subvenciones/ optimizada o una variante sin menú para Ads) y landing servicio web.
- **Titular = resultado, no servicio.** "Digitaliza tu negocio con hasta un 70% financiado" > "Desarrollo web y digitalización".
- **Una sola acción por página.** Formulario corto o WhatsApp. En landings de Ads: sin menú de navegación.
- **Coherencia anuncio→landing:** el titular de la landing repite la promesa del anuncio.
- **Prueba social arriba:** logos/mini-casos de Casvisol, Agropur, FPC, Amacapricci, Valdeferrín, Nieves Muriel. Cuando existan reseñas de Google (pedirlas ya), incrustarlas.
- **Fricción cero de contacto:** teléfono y WhatsApp visibles, "valoración inicial gratuita".
- **Test de los 5 segundos:** alguien que no te conoce debe poder decir qué ofreces y qué debe hacer.

### 4.2 Portfolio: de catálogo a prueba

Cada proyecto añade **una línea de resultado**, no solo descripción:
- Ahora: "Web corporativa para gestión integral de purines y fertilización agrícola."
- Mejor: añadir → "Desde el lanzamiento, [X] consultas de clientes nuevos al mes / primera página de Google para [búsqueda del sector]."
Aunque el dato sea aproximado, transforma la página. Pedir el dato a cada cliente es además excusa perfecta para pedir la reseña y el referido.

### 4.3 Móvil primero

El CTR móvil (6,4%) ya dobla al de escritorio (2,6%) con posiciones similares. Tu cliente tipo (autónomo, comercio) busca desde el móvil. Verificar en cada página clave: velocidad móvil, botón WhatsApp accesible con el pulgar, formulario rellenable sin zoom.

### 4.4 Medición (obligatoria antes de encender Ads)

Configurar en Google Tag Manager + GA4 eventos de conversión: envío de formulario, clic en WhatsApp, clic en teléfono, clic en email. Importarlos como conversiones en Google Ads. Sin esto, no encender campañas.

---

## FASE 5 — GEO y AEO: optimizar para búsquedas con IA

Objetivo doble: que ChatGPT/Perplexity/Gemini te citen como fuente (GEO) y que Google te use en respuestas directas/featured snippets (AEO). La buena noticia: el 80% del trabajo es el mismo, y tu ángulo de "estado verificado de subvenciones" es justo el tipo de contenido que las IA necesitan citar (dato concreto, fechado, con fuente).

### 5.1 Datos estructurados (schema.org) — base técnica

Implementar en JSON-LD:

- **`LocalBusiness` / `ProfessionalService`** en la home: nombre, dirección (Granada), teléfono, área de servicio (Granada, Zaragoza, España), servicios, enlace a perfiles (sameAs → LinkedIn, YouTube). Esto alimenta tanto el SEO local como el knowledge graph que consultan las IA.
- **`FAQPage`** en /subvenciones/ y páginas hijas: cada pregunta-respuesta del FAQ marcada. Es el formato nº1 para featured snippets y para que los asistentes lean tu respuesta en voz alta (AEO).
- **`Article`** con `dateModified` visible en cada página de subvenciones: las IA priorizan contenido con fecha de actualización reciente para temas cambiantes. Tu "Última verificación" debe existir también a nivel de schema.
- **`Service`** en cada página de servicio (web, automatización, IoT).
- **`BreadcrumbList`** en toda la arquitectura /subvenciones/*.

### 5.2 Formato del contenido (lo que las IA extraen)

- **Respuesta directa en las primeras 2-3 líneas de cada sección.** Patrón pregunta→respuesta inmediata→desarrollo. Ejemplo: "¿Está abierto el Kit Digital? No para nuevas solicitudes a fecha [X]. La Orden TDF/39/2026 solo reactiva expedientes con fondos remanentes. Las alternativas activas ahora son…". Las IA extraen ese primer párrafo literal.
- **Una idea por párrafo, párrafos cortos.** Los LLM citan bloques autocontenidos; los párrafos-río no se citan.
- **Tablas para datos comparables** (programa / % cobertura / estado / plazo): los motores de respuesta adoran las tablas y las reproducen citándote.
- **Cifras siempre con contexto y fecha:** "hasta el 65% (LEADER 2023-2027, verificado julio 2026)" es citable; "grandes ayudas disponibles" no.
- **Definiciones limpias de términos** que tu público busca: qué es un GDR, qué es un agente digitalizador, qué es Kit Consulting. Formato: término en negrita + definición de 1-2 frases. Es material de snippet directo.

### 5.3 Autoridad y consistencia de entidad (GEO)

- **Consistencia NAP** (nombre, dirección, teléfono) idéntica en web, Google Business Profile, LinkedIn y directorios. Las IA trianguran fuentes; las inconsistencias restan confianza de entidad.
- **Google Business Profile completo** (ya en la estrategia): es una de las fuentes que los asistentes usan para "cerca de mí" y recomendaciones locales.
- **Página "Sobre mí" reforzada:** quién eres, experiencia verificable, proyectos con enlace real. Las IA evalúan autoría (E-E-A-T) antes de citar.
- **Citabilidad externa:** cada post de LinkedIn/YouTube que enlaza a las páginas de subvenciones refuerza la señal. El canal de YouTube es un activo GEO fuerte: los asistentes citan vídeos con transcripción sobre temas nicho ("cómo pedir ayuda LEADER") donde apenas hay competencia.

### 5.4 Verificación

- Probar mensualmente en ChatGPT/Perplexity/Gemini: "ayudas para digitalizar un negocio en Granada", "¿está abierto el kit digital?", "quién puede ayudarme con una subvención LEADER". Anotar si apareces citado y qué web citan en tu lugar.
- En GSC, vigilar el crecimiento de impresiones en consultas conversacionales largas (señal de tráfico procedente de AI Overviews).
- Nota: usar SEO Pilot aquí — la herramienta ya analiza las tres capas (SEO/GEO/AEO); aplicarla a rpidev.com es además el mejor caso de estudio para venderla.

---

## Orden de ejecución recomendado

| Semana | Acción | Resultado esperado |
|---|---|---|
| 1 | Fase 1 completa (errores, canonicalización, sitemap) + solicitar validaciones en GSC | Desbloquear indexación |
| 2 | Reescritura /subvenciones/ (title, meta, bloque de estado, FAQ + schema FAQPage) | CTR de 0,4% → 3-5% sobre 464 impresiones ≈ 15-25 clics/mes solo con eso |
| 2-3 | Schema LocalBusiness + Google Business Profile + pedir reseñas a clientes | Base SEO local y GEO |
| 3-4 | Páginas hijas: kit-digital-granada (la de mayor demanda) y leader (contenido ya existente) | Capturar las 120+ impresiones/mes de "kit digital granada" |
| 4-5 | Páginas Aragón y Andalucía + resultados en portfolio | Cobertura completa del ángulo subvenciones |
| 5-6 | Medición de conversiones (GTM/GA4) + landing de Ads sin menú | Prerequisito de campañas |
| 6+ | Encender Google Ads (campaña subvenciones, según estrategia acordada: 150-300€/mes, concordancia de frase, solo Search, geo Granada+Zaragoza) | Amplificar lo validado |

---

## Métricas de seguimiento (revisar cada 2 semanas en GSC)

- Páginas indexadas (objetivo: de 4-5 a 15+ en 8 semanas)
- CTR de /subvenciones/ (objetivo: >3%)
- Posición media de "kit digital granada" (objetivo: <10)
- Clics totales/mes (objetivo: de ~6/mes a 30-60/mes en el trimestre)
- Leads (formulario + WhatsApp) — la única métrica que paga facturas
