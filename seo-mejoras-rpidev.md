# Plan de mejoras SEO para rpidev — instrucciones para agente de IA

> **Stack:** Astro + WordPress headless, Tailwind. Dominio en Search Console: `www.rpidev.com`.
> **Objetivo:** corregir errores técnicos de indexación, mejorar on-page/CTR y reescribir la sección de subvenciones con datos reales de 2026.
> **Cómo usar este documento:** ejecutar las partes EN ORDEN. La Parte A es bloqueante: nada de lo demás rinde si el sitio devuelve errores 5xx. Cada tarea tiene un criterio de validación. No inventar datos de subvenciones: usar solo los del bloque C, y marcar como "verificar en fuente oficial" lo que indique.

---

## PARTE A — Errores técnicos (BLOQUEANTE, hacer primero)

Origen: informe de Páginas Indexadas de Google Search Console (últimos 3 meses).

### A1. Errores de servidor 5xx (6 páginas) — máxima prioridad
- Identificar las 6 URLs que devuelven 5xx (GSC → Indexación → "Error de servidor (5xx)").
- Para cada una determinar la causa: ruta rota en Astro, fallo de fetch a la API de WordPress en build/SSR, timeout, o recurso inexistente.
- Corregir el origen. Si la URL ya no debe existir, devolver **410 Gone** (contenido eliminado para siempre) o **301** a su equivalente vivo. Nunca dejar una página de contenido respondiendo 5xx.
- Si hay SSR con llamadas a la API headless de WordPress, envolver los fetch en try/catch con fallback y código de estado correcto; un fallo de la API no debe propagar un 500 a Google.
- **Validación:** las 6 URLs devuelven 200 / 301 / 410 según corresponda (comprobar con `curl -I`). Pulsar "Validar corrección" en GSC.

### A2. Páginas 404 (8 páginas)
- Listar las 8 URLs (GSC → "No se ha encontrado (404)").
- Las que tuvieron valor o enlaces: **301** a la página equivalente actual.
- Las que son basura/erróneas: dejarlas en **404 limpio** (no redirigir todo a la home en masa: el "soft 404 a home" es contraproducente).
- **Validación:** ninguna URL con valor queda en 404; el resto devuelve 404 real.

### A3. Decisión de dominio canónico (split .com / .es)
- Search Console usa `www.rpidev.com`, pero la marca/infra apunta a `rpidev.es`. Confirmar cuál es el dominio oficial y único.
- Implementar **301 permanente** de TODAS las variantes hacia la canónica elegida: `http→https`, `no-www→www` (o al revés), y el dominio secundario completo → canónico.
- Asegurar `<link rel="canonical">` en cada página apuntando a la URL canónica absoluta.
- Sitemap y enlaces internos: usar SIEMPRE el dominio canónico, nunca el secundario.
- **Validación:** todas las variantes resuelven con un único 301 hacia la canónica (sin cadenas de redirección). Una sola propiedad recibe el tráfico.

### A4. Páginas con redirección (4) y excluidas por noindex (3)
- Revisar las 4 redirecciones: eliminar cadenas (A→B→C debe ser A→C) y quitar redirecciones internas innecesarias.
- Revisar las 3 con `noindex`: confirmar que es intencionado (ej. páginas legales, gracias, etc.). Si alguna debería indexarse, quitar la etiqueta `noindex`/cabecera `X-Robots-Tag`.
- **Validación:** sin cadenas de redirección; noindex solo en páginas que de verdad no deben indexarse.

### A5. Sitemap y robots
- Generar/regenerar `sitemap.xml` solo con URLs canónicas, 200 e indexables (sin 404, sin noindex, sin redirecciones).
- `robots.txt` debe permitir el rastreo y enlazar el sitemap (`Sitemap: https://<canónico>/sitemap.xml`).
- Reenviar el sitemap en GSC.
- **Validación:** sitemap sin URLs en error; robots.txt accesible y correcto.

---

## PARTE B — On-page y CTR

Datos relevantes de GSC: la home y `/subvenciones/` reciben impresiones pero con CTR muy bajo (`/subvenciones/` 0,9 %, posición 14,8). Hay que mejorar titles/metas y la estructura semántica.

### B1. Títulos y meta descriptions
Reescribir `<title>` (≤ 60 caracteres) y `<meta name="description">` (≤ 155) de cada página clave, concretos y locales. Propuestas (ajustar al estilo de marca: primera persona, directo, sin hype):

| Ruta | `<title>` propuesto | Enfoque de la meta |
|------|---------------------|--------------------|
| `/` | `RPIDev — Desarrollo web y automatización para autónomos y pymes en Granada` | Qué hago, para quién, dónde. CTA suave. |
| `/subvenciones/` | `Subvenciones para digitalizar tu negocio en Granada (2026)` | Qué ayudas hay abiertas ahora y cómo te acompaño. Sin "gratis 12.000€" de relleno. |
| `/portfolio` | `Portfolio — Proyectos web y de automatización | RPIDev` | Casos reales. |
| `/about` | `Sobre RPIDev — Quién está detrás` | Persona real, cercanía. |
| `/contact` | `Contacto — Hablemos de tu proyecto | RPIDev` | Facilidad de contacto. |
| `/diagnostico` | `Diagnóstico digital gratuito para tu negocio | RPIDev` | Llamada a la acción del embudo. |

- **Validación:** cada página tiene title y meta únicos, dentro de longitud, con la keyword local cuando aplica.

### B2. Estructura semántica (H1/H2)
- Un único `<h1>` por página, con la keyword principal de esa página.
- En `/subvenciones/`, el H1 debe contener "subvenciones" + "Granada" de forma natural; los H2 deben mapear a cada programa (ver bloque C) para que Google entienda la cobertura del tema.

### B3. Datos estructurados (schema.org JSON-LD)
- **Todas las páginas:** `Organization` (nombre RPIDev, logo, URL, sameAs con LinkedIn y YouTube @rpidev).
- **Home / contacto:** `LocalBusiness` (o `ProfessionalService`) con dirección/área de servicio Granada, para reforzar señales locales.
- **`/subvenciones/`:** bloque `FAQPage` con las preguntas reales que se buscan (ver C5). Es la vía más rápida a rich results y a captar consultas de cola larga.
- **Validación:** JSON-LD válido (Rich Results Test), sin errores.

### B4. hreflang para `/en/`
- La versión inglesa (`/en/`) atrae tráfico internacional que no convierte (EE.UU., Países Bajos, India). No es el mercado objetivo, pero no hay que romperla: implementar `hreflang` correcto entre `es` y `en` (y `x-default`) para que cada idioma se sirva a su audiencia y no compitan entre sí.
- No invertir esfuerzo de contenido nuevo en `/en/`; mantenerla técnicamente correcta y punto.

---

## PARTE C — Reescritura de `/subvenciones/` con datos reales 2026

> **Contexto que debe transmitir la página:** a junio de 2026 el Kit Digital NO tiene convocatoria abierta para nuevas solicitudes (está reactivado por la Orden TDF/39/2026 pero pendiente de que Red.es publique nuevas convocatorias). Mucha gente busca esto y está confundida. La oportunidad de contenido es ser la página clara y honesta que responde "¿qué subvenciones hay realmente abiertas ahora para digitalizar mi negocio en Granada?" — y orientar a las que SÍ están vivas.
>
> **Tono:** primera persona del singular, directo, sin alarmismo ni "consigue 12.000€ gratis". Enmarcar como ayuda, no como presión. No prometer concesión: las ayudas dependen de requisitos y presupuesto.

### C1. Estructura recomendada de la página
1. H1 + intro corta: qué ayudas hay abiertas hoy para digitalizar un negocio en Granada y cómo acompaño en el proceso.
2. Bloque "Estado del Kit Digital en 2026" (responde la duda más buscada).
3. Tarjetas/secciones por programa abierto (C2).
4. FAQ con schema (C5).
5. CTA a `/diagnostico` o `/contact`.

### C2. Programas a incluir (datos verificados a junio 2026)

**1) Kit Digital 2026 — reactivado, pendiente de nueva convocatoria**
- Las convocatorias masivas cerraron el 31/10/2025. La Orden TDF/39/2026 (BOE 28/01/2026) reactivó el programa con fondos remanentes, eliminó la fecha de cierre fija (sigue hasta agotar fondos) y añadió categorías de IA y automatización.
- A día de hoy NO se pueden presentar solicitudes nuevas: Red.es aún no ha publicado los plazos. Apertura probable e inminente por la presión de la UE para ejecutar fondos NextGenerationEU.
- Importes de referencia por segmento: hasta 2.000–3.000 € (Seg. III: autónomos/microempresas 0–<3 empleados), hasta 6.000 € (Seg. II: 3–<10), hasta 12.000 € (Seg. I: 10–<50).
- Ángulo de la página: "Te aviso y preparamos tu solicitud para cuando abra; mientras, mira estas otras que SÍ están abiertas." Fuente oficial: sede.red.gob.es / acelerapyme.gob.es / BOE. **(Verificar estado de apertura antes de publicar.)**

**2) LEADER Andalucía (PEPAC 2023–2027) — ABIERTA hasta 31/12/2028**
- Convocatoria dotada con 97,5 M€ en Andalucía; Granada es la provincia con mayor asignación de fondos LEADER (~22 M€ hasta 2029). Bases por Orden de 3 de febrero de 2026. Concesión en concurrencia NO competitiva (por orden de solicitud hasta agotar presupuesto → la rapidez importa).
- Financia creación y modernización de empresas y actividades no agrícolas en zonas rurales, incluyendo digitalización.
- Se tramita a través de los 8 Grupos de Desarrollo Rural de Granada: Altiplano, Guadix, Los Montes, Valle de Lecrín, Alpujarra–Sierra Nevada, Temple y Costa, Alfanevada y Poniente Granadino.
- Ángulo: ideal para negocios en pueblos de la provincia que quieran web/tienda online/automatización. Encaja con el segmento rural.

**3) Fomento del trabajo autónomo (Junta de Andalucía) — ABIERTAS hasta 30/06/2026**
- Línea 1 "Cuota Cero" (subvención de ~100 % de la cuota de autónomos el primer año, ampliable) y Línea 2 "Inicio de actividad". Muy buscadas ("cuota cero andalucía").
- No son ayudas de digitalización en sí, pero captan al autónomo que arranca y que luego necesita web/presencia online. Útil como gancho informativo y para captar al cliente en su fase inicial.
- **Atención al plazo: cierran el 30/06/2026.** Revisar fechas vigentes antes de publicar.

**4) Línea de Innovación y Digitalización autónomos/pymes Andalucía (Programa I)**
- Incluye integración de tecnologías digitales. Fecha de apertura 2026 pendiente de publicación. Marcar como "próximamente, atento a convocatoria".

**5) Kit Consulting (Red.es) — para pymes de 10 a 250 empleados**
- Bonos de 12.000 / 18.000 / 24.000 € para asesoramiento digital especializado (IA, ciberseguridad, análisis de datos, ventas digitales). Presupuesto 300 M€, NextGenerationEU.
- Relevante solo para clientes pyme de cierto tamaño, no para autónomos. Incluir como vía adicional. **(Verificar si hay convocatoria/plazo abierto antes de publicar.)**

**6) Pyme Digital — Cámara de Comercio de Granada**
- Programa de apoyo a la digitalización de pymes de la Cámara de Granada. Reapertura prevista (orientativa) en torno a verano de 2026. Marcar como "próximamente" y preparar para cuando reabra.

**7) Ayudas nacionales a IA (mención breve, compatible con lo anterior)**
- Ticket Innova: hasta ~7.000 € para proyectos de IA/automatización en pymes.
- CDTI Express IA: convocatoria continua, hasta ~250.000 € (préstamo blando + tramo de subvención) para proyectos de IA más ambiciosos.
- Incluir como "si tu proyecto es de IA/automatización, hay más vías".

### C3. Regla de mantenimiento (importante para SEO de frescura)
- Las queries con año ("kit digital nueva convocatoria 2026") y de estado cambian rápido. La página debe llevar una fecha visible de "última actualización" y revisarse al menos cada 4–6 semanas (o cuando Red.es publique convocatoria).
- Recomendado: que el agente parametrice el estado de cada programa (campo `estado: abierta | pendiente | cerrada` + `fecha_actualizacion`) en un JSON/colección de contenido de Astro, para actualizar sin tocar el maquetado.

### C4. Enlazado interno
- Desde la home y desde `/diagnostico`, enlazar a `/subvenciones/` con anchor natural ("ayudas para digitalizar tu negocio en Granada").
- Desde `/subvenciones/`, enlazar a servicios concretos (web, tienda online, automatización) y al CTA de contacto/diagnóstico.

### C5. FAQ (usar en bloque visible + schema FAQPage)
Preguntas reales que se buscan; respuestas breves, honestas, en primera persona:
- ¿Está abierto el Kit Digital en 2026?
- ¿Qué subvenciones hay abiertas ahora para digitalizar mi negocio en Granada?
- ¿Puedo pedir ayudas si mi negocio está en un pueblo de la provincia? (→ LEADER)
- ¿Soy autónomo nuevo, qué ayudas me interesan? (→ Cuota Cero + digitalización)
- ¿Tengo que adelantar dinero? / ¿Cómo funciona el proceso?
- ¿Me ayudas con la solicitud o solo con la parte técnica?

---

## PARTE D — Local SEO (fuera del código, pero crítico)

Las queries con más intención de compra son locales ("kit digital granada", "ayudas kit digital granada") y ahí ganan competidores por señales locales. Recomendar a Rubén (no es tarea de código, pero anotarlo):
- Crear/optimizar la ficha de Google Business Profile (categoría, NAP coherente con la web, descripción, fotos, reseñas).
- NAP (nombre, dirección, teléfono) idéntico en web y ficha; reflejarlo en el footer y en el schema `LocalBusiness`.
- Conseguir unos pocos enlaces locales de calidad (Cámara de Comercio, directorios de Granada, prensa local, GDR si colabora con rurales, YouTube @rpidev enlazando a la web).

---

## Orden de ejecución y criterios de cierre
1. Parte A completa y validada en GSC (sin 5xx ni 404 con valor; dominio único). ← imprescindible.
2. Parte B (titles/metas/H1/schema/hreflang).
3. Parte C (reescritura de `/subvenciones/` con datos C2 + FAQ + fecha de actualización).
4. Parte D anotada para Rubén.

**Cierre:** sitemap limpio reenviado, Rich Results Test sin errores, `/subvenciones/` publicada con estado de cada programa y fecha visible, y todas las variantes de dominio resolviendo a la canónica con un solo 301.
