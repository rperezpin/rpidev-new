# Auditoría SEO Local — rpidev.com

**Fecha:** 2026-09-10
**Tipo de negocio detectado:** Service-Area Business (SAB) — sin local físico visible al público. Confirmado por: ausencia total de dirección visible en el HTML renderizado (la dirección solo existe dentro del JSON-LD, ver Hallazgo 1), sin Maps embed, sin enlace "cómo llegar", con lenguaje de "videollamada" y trabajo remoto en el FAQ.
**Vertical:** Servicios profesionales / desarrollo web y automatización (freelance). No hay tipo de schema específico dedicado en `local-schema-types.md` para este vertical; `ProfessionalService` es correcto.
**Páginas auditadas:** `/` (ES) y `/en/` (EN), vía render de HTML crudo (`render_page.py --mode auto`, `is_spa: false`, sin necesidad de Playwright).

---

## Hallazgos

### 1. Dirección física completa en el schema pero invisible en la página (contradicción SAB)
- **Severidad:** Alta
- **Evidencia:** El bloque JSON-LD (`@type: ["LocalBusiness","ProfessionalService"]`) declara `"address":{"streetAddress":"Calle Ermita 42","addressLocality":"Huétor Vega","addressRegion":"Granada","postalCode":"18198","addressCountry":"ES"}`. Búsqueda en el HTML completo (103 464 caracteres) confirma que la cadena "Ermita" y el resto de la dirección **solo aparecen dentro del bloque `<script type="application/ld+json">`**; no hay ninguna mención visible de calle, código postal o "Huétor Vega" en el body renderizado, ni en ES ni en EN. Google exige que el structured data refleje contenido visible en la página ("Structured data markup should reflect the primary content of the page a user can also see").
- **Recomendación:** Decidir explícitamente el modelo de negocio: (a) si es SAB puro sin atención presencial, eliminar `address` completa del schema (o sustituir por una zona de servicio sin calle exacta) y quedarse solo con `areaServed`; (b) si hay intención de que esa dirección sea la de verificación de un futuro Google Business Profile, hacerla visible al menos en el footer o página de contacto para que coincida con lo que verá un usuario. Publicar una dirección residencial exacta que nunca se muestra al usuario, solo para el crawler, es una práctica de riesgo (puede leerse como intento de manipular señales locales) y no verificable en GBP sin coincidir con la política de Google para SAB (dirección oculta al público es un requisito de Google Business Profile, pero entonces NO debería declararse como `PostalAddress` pública en el sitio).
- **Check de falsabilidad:** Sería falso si al inspeccionar manualmente el HTML renderizado (view-source o DevTools) apareciera la dirección en algún componente visible (footer, sección contacto, aviso legal enlazado). Verificar también `/legal` (bloqueada en robots.txt para bots, pero visible a usuarios) por si ahí sí se declara la dirección — si es así, el hallazgo pasa de "contradicción" a "posible NAP-en-legal no enlazado a schema", que es un matiz distinto.
- **Indicador adelantado:** Si Google indexa esta URL con Rich Results Test / Search Console y marca advertencias de "dirección no coincide con contenido visible", o si en el futuro se da de alta un GBP con esta dirección y Google lo rechaza/suspende por no poder verificar presencia física coherente con lo publicado.

### 2. `areaServed` incluye Zaragoza/Aragón sin ningún respaldo en el contenido visible (dilución geográfica)
- **Severidad:** Alta
- **Evidencia:** El schema declara `areaServed: [Granada (City), Zaragoza (City), Andalucía, Aragón, Spain]`. En todo el HTML visible (title, meta description, og:*, H1, copy de secciones), "Zaragoza" aparece **0 veces** y "Aragón" **0 veces**; solo existen dentro del propio JSON-LD. El texto de la home, el `<title>`, la meta description y el H1 están 100% orientados a "Granada" ("autónomos y pymes en Granada", `geo.placename: Granada`, `geo.region: ES-GR`). Zaragoza/Aragón son ciudades y comunidad autónoma en el extremo opuesto de España respecto a Granada/Andalucía.
- **Recomendación:** Elegir un mercado principal claro. Si Granada es el foco real (como indica todo el copy), retirar Zaragoza/Aragón del `areaServed` del schema principal, o bien crear contenido/sección propia (no necesariamente página nueva — puede ser un bloque dentro de una sección existente del SPA, respetando la preferencia de no crear páginas standalone) que justifique visiblemente el servicio en Zaragoza. Servir dos regiones no contiguas sin contenido que lo sustente diluye la relevancia de proximidad para ambas (la proximidad explica el 55.2% de la varianza de ranking local según el estudio de Search Atlas citado en las referencias del skill) y puede generar señales contradictorias en Google.
- **Check de falsabilidad:** Sería falso si existiera contenido oculto tras interacción (acordeón, tab, sección posterior en el scroll de la SPA) que mencione Zaragoza y que no fue capturado por el render estático; se recomienda re-verificar con `--mode always` (forzando Playwright) recorriendo las 7 secciones del scroll antes de descartar el hallazgo del todo.
- **Indicador adelantado:** Si tras eliminar/justificar Zaragoza del schema mejora el CTR o el ranking local para consultas "Granada" en Search Console (rendimiento por consulta), o si aparecen impresiones erráticas para consultas de Zaragoza que nunca conviertan (señal de dilución ya activa).

### 3. Sin ninguna señal de Google Business Profile en la página
- **Severidad:** Alta
- **Evidencia:** Búsqueda exhaustiva en el HTML de: iframes de Google Maps (0, solo hay un iframe de GTM), `maps.google`, `google.com/maps`, `place_id`, `g.page` (0 resultados todos). No hay widget de reseñas, no hay `aggregateRating` en el schema, no hay rating/estrellas visibles, no hay logo "Google Reviews". Verificación externa de GBP no fue posible (Google Search redirige a página de consentimiento de cookies inaccesible por fetch automatizado) — ver Limitaciones.
- **Recomendación:** Dado que es un SAB, crear/verificar un Google Business Profile con dirección oculta al público (opción estándar de Google para SAB), categoría principal correcta (candidatas: "Diseñador de páginas web" / "Website designer" — factor de ranking #1 según Whitespark 2026), área de servicio configurada (Granada capital + provincia, sin mezclar con Zaragoza salvo que se justifique con negocio real allí), y enlazar el perfil desde la web (botón "Ver perfil de Google" o similar) una vez creado. Esto es una tarea externa a la web (no requiere crear páginas nuevas).
- **Check de falsabilidad:** Falso si el negocio ya tiene un GBP verificado que simplemente no está enlazado ni embebido en la home — en ese caso el hallazgo pasa de "GBP inexistente" a "GBP existente pero sin integración on-page", que es un problema menor. Verificar manualmente buscando "RPI Dev Granada" o "Rubén Pérez Izuel desarrollador web" en Google Maps.
- **Indicador adelantado:** Aparición de un local pack/perfil en Google Maps para búsquedas de marca ("RPI Dev") en 2-4 semanas tras la alta y verificación; ausencia total de "insights" de GBP (llamadas, direcciones, clics a web) confirmaría que no existe perfil activo.

### 4. Cero reseñas / reputación no explotada
- **Severidad:** Media-Alta
- **Evidencia:** No hay `aggregateRating`, `review`, testimonios, ni menciones de "opinión"/"testimonio"/"estrella" en ningún punto del HTML (búsquedas con 0 coincidencias reales; las 4 coincidencias de "review" detectadas eran falsos positivos del atributo `alt="Choose ...preview.png"`).
- **Recomendación:** Sin GBP verificado no puede haber reseñas nativas de Google que contar. Una vez creado el perfil, activar solicitud sistemática de reseñas tras cada proyecto cerrado. La regla de los 18 días (Sterling Sky) indica que el ranking cae si pasan 3 semanas sin nueva reseña — la prioridad no es solo volumen sino cadencia constante. El umbral de "10 reseñas" (Magic 10, Sterling Sky) es el primer objetivo cuantificable.
- **Check de falsabilidad:** Falso si existen reseñas en LinkedIn recommendations, Google Maps u otra plataforma no verificada en este análisis (no se pudo consultar Maps/Search en vivo). Confirmar con búsqueda manual.
- **Indicador adelantado:** Ausencia de cualquier notificación de "nueva reseña" en Search Console/GBP dashboard tras la primera solicitud activa a clientes recientes.

### 5. `geo` con solo 4 decimales de precisión (recomendación incumplida)
- **Severidad:** Baja
- **Evidencia:** `"geo":{"latitude":37.1548,"longitude":-3.5826}` — 4 decimales. Google recomienda mínimo 5 decimales (~1.1 m de precisión) según `local-schema-types.md`.
- **Recomendación:** Ampliar a 5 decimales reales (no rellenar con ceros) si se decide mantener geo-coordenadas en el schema; en todo caso, resolver primero el Hallazgo 1 (si la dirección se retira, las coordenadas asociadas deberían revisarse igualmente).
- **Check de falsabilidad:** Falso si Google Rich Results Test no marca ninguna advertencia sobre precisión geo (Google no siempre valida el número de decimales como error, solo como recomendación).
- **Indicador adelantado:** N/A — cambio de bajo impacto medible de forma aislada.

### 6. FAQPage en schema sin contenido visible correspondiente
- **Severidad:** Media
- **Evidencia:** El `@graph` incluye un bloque `FAQPage` completo con 6 preguntas (precios, automatización, cobertura geográfica "¿Trabajáis solo en Granada...?", diagnóstico gratuito, subvenciones). Ninguna de esas preguntas ni respuestas aparece como texto visible en el HTML renderizado de la home (verificado por posición de cadena: todas las coincidencias caen dentro del rango de bytes del `<script type="application/ld+json">`). Desde 2023 Google limita el rich result de FAQ a sitios gubernamentales/salud autorizados, pero la regla general de "schema debe reflejar contenido visible" sigue aplicando como buena práctica y riesgo de spam estructurado.
- **Recomendación:** Añadir un bloque de FAQ visible (acordeón) reutilizando este contenido dentro de una de las secciones existentes del SPA (p. ej. cerca de "Plan" o "Contact"), sin crear una página nueva — esto es coherente con la preferencia del proyecto de mejorar el contenido existente y no crear páginas standalone. Este contenido de FAQ es también donde ya está redactada la aclaración de "servicio remoto en toda España" que hoy no llega al usuario.
- **Check de falsabilidad:** Falso si el FAQ se muestra tras una interacción no capturada por el render estático (acordeón cargado dinámicamente en scroll posterior); recomendable confirmar con `--mode always` recorriendo manualmente las 7 secciones.
- **Indicador adelantado:** Si tras publicar el FAQ visible aumenta el dwell time o aparecen impresiones para long-tail conversacional ("cuánto cuesta una web en Granada") en Search Console.

### 7. No existen páginas de servicio dedicadas (factor #1 de SEO local orgánico)
- **Severidad:** Alta
- **Evidencia:** `robots.txt` y el sitemap solo exponen `/` y `/en/` como rutas indexables (más `/legal`, `/privacy`, `/cookies`, bloqueadas). El proyecto es una SPA de una sola página con 7 secciones en scroll (confirmado también en la memoria del proyecto: Hero, Problem, Services, Plan, Portfolio, Subvenciones, Contact). No hay URLs individuales para "Desarrollo Web", "Automatización de procesos", "Integraciones", "Consultoría digital" — los 4 servicios del `hasOfferCatalog` del schema no tienen página propia.
- **Recomendación:** Según Whitespark 2026, las páginas de servicio dedicadas son el factor #1 de ranking orgánico local y el #2 de visibilidad en IA. Esto es una recomendación estructural que implica crear páginas nuevas, lo cual choca con la preferencia explícita del usuario de "no crear páginas nuevas standalone sin confirmación". **Se deja como recomendación a validar con el usuario antes de implementar**, no como acción directa. Alternativa de menor fricción: ampliar sustancialmente el contenido de la sección "Services" existente dentro del SPA con anclas propias (`/#services-desarrollo-web`, etc.) y encabezados H2/H3 optimizados, aunque el impacto SEO de anclas dentro de una SPA es inferior al de URLs indexables propias.
- **Check de falsabilidad:** Falso si el usuario confirma que ya evaluó y descartó conscientemente las páginas de servicio por motivos de negocio (p. ej. bajo volumen de servicios, preferencia de conversión centralizada).
- **Indicador adelantado:** Comparar posiciones/impresiones en Search Console para consultas de servicio específico ("automatización de procesos Granada", "desarrollo web Granada") antes/después de cualquier cambio; si la sección única del SPA nunca aparece para esas consultas de forma independiente, confirma la limitación estructural.

### 8. Sin enlace `tel:` clicable ni presencia confirmada en directorios Tier 1
- **Severidad:** Media
- **Evidencia:** El teléfono `+34614830864` solo aparece en el schema y en un enlace `wa.me` (WhatsApp) — no se encontró ningún `href="tel:"` en el HTML. No fue posible verificar presencia en Yelp/BBB/Google directamente (ver Limitaciones); dado que es un negocio freelance español, Yelp/BBB tienen relevancia limitada en España — más relevantes serían Google Business Profile, Bing Places, LinkedIn (ya enlazado vía `sameAs`), y directorios locales/sectoriales españolas (p. ej. asociaciones de autónomos, Kit Digital agentes digitalizadores si aplica).
- **Recomendación:** Añadir `href="tel:+34614830864"` en el CTA de contacto para mejorar click-to-call en móvil. Priorizar altas en Google Business Profile y Bing Places sobre Yelp/BBB, de menor relevancia en el mercado español.
- **Check de falsabilidad:** Falso si el número solo debe usarse por WhatsApp por decisión de negocio (atención exclusiva por chat) — en ese caso la ausencia de `tel:` es intencional, no un defecto.
- **Indicador adelantado:** Incremento de clics en el CTA de teléfono medible en GTM/GA4 tras añadir el enlace `tel:`.

### 9. NAP consistente entre ES/EN (aspecto positivo)
- **Severidad:** N/A (hallazgo positivo)
- **Evidencia:** El schema de `/` y `/en/` comparte el mismo `@id` (`https://www.rpidev.com/#organization`) con idéntico nombre, teléfono, dirección y geo en ambos idiomas — no hay discrepancia de NAP entre versiones lingüísticas.
- **Recomendación:** Mantener este patrón (un único nodo `@graph` reutilizado) al añadir cualquier página nueva o sección adicional.
- **Check de falsabilidad:** N/A.
- **Indicador adelantado:** N/A.

---

## Resumen de acciones priorizadas

| Prioridad | Acción | Hallazgo |
|---|---|---|
| Crítica | Resolver contradicción dirección visible vs. schema (decidir modelo SAB y ajustar schema/contenido) | #1 |
| Crítica | Crear y verificar Google Business Profile (SAB, dirección oculta, categoría correcta) | #3 |
| Alta | Depurar `areaServed` (Zaragoza/Aragón) o justificarlo con contenido real | #2 |
| Alta | Activar generación constante de reseñas en Google (regla de 18 días) | #4 |
| Alta | Evaluar con el usuario la creación de páginas de servicio dedicadas (no implementar sin confirmación) | #7 |
| Media | Hacer visible el FAQ ya redactado en el schema (dentro de sección existente del SPA) | #6 |
| Media | Añadir enlace `tel:` clicable | #8 |
| Baja | Ajustar `geo` a 5 decimales | #5 |

---

## Limitaciones

- No se pudo consultar Google Search/Maps en vivo (redirección a página de consentimiento de cookies de Google no accesible por fetch automatizado) — no se pudo confirmar si ya existe un GBP verificado, su categoría, reseñas nativas o posición en el local pack. **Requiere verificación manual.**
- No se dispuso de acceso a Google Search Console ni a herramientas DataForSEO en esta sesión — no hay datos de impresiones/clics reales por consulta local.
- No se verificó presencia en Yelp/BBB/directorios mediante fetch directo (baja prioridad dado el mercado español; se recomienda revisar Google Business Profile y Bing Places como equivalentes prioritarios).
- El render se hizo en modo `auto` (sin forzar Playwright); si algún contenido de la SPA se carga solo tras scroll/interacción del usuario, podría no haberse capturado — los hallazgos #2 y #6 incluyen su propio check de falsabilidad para este caso.
- No se aplicó ningún cambio de código; este documento es exclusivamente diagnóstico, conforme a lo solicitado.
