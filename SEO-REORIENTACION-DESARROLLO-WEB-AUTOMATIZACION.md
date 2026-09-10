# Plan SEO — Reorientación hacia Desarrollo Web y Automatización

**Fecha:** 2026-09-10  
**Objetivo:** Conseguir visibilidad orgánica real para los servicios core de RPI Dev (desarrollo web + automatización), que hoy generan tráfico casi nulo pese a ser los servicios más rentables.

---

## 1. El problema real

El sitio actual tiene un H1 correcto: *"Desarrollo Web, Automatización de Procesos y Consultoría Digital para Pymes en Granada"*. El meta title también menciona ambos servicios. **Entonces, ¿por qué no aparece en esas SERPs?**

Tres motivos:

### 1.1 — Arquitectura SPA: una URL para todo
El sitio es un SPA de scroll horizontal con 7 secciones bajo `/`. Google ve **una sola página** y tiene que distribuir su relevancia entre todos los servicios, el portfolio, las subvenciones y el contacto. Una URL no puede rankear para "desarrollo web Granada" **Y** "automatización pymes Granada" **Y** "consultor digital Granada" al mismo tiempo — Google elige una y sacrifica las demás.

### 1.2 — Todo el tráfico real va a subvenciones
Las páginas de `/subvenciones/*` concentran 1.684 de las 1.756 impresiones (28 días). Google ha aprendido que rpidev.com es un sitio de ayudas/subvenciones, no de desarrollo web. Ese es el posicionamiento implícito que transmite la distribución actual de contenido.

### 1.3 — Competencia local fragmentada (oportunidad real)
La investigación competitiva confirma:
- **"Desarrollo web Granada"**: mercado local, baja-media dificultad, domina agencias pequeñas con páginas de 500-1.500 palabras. No hay thought leadership.
- **"Automatización pymes Granada"**: nadie lo trabaja localmente. Todo el contenido es nacional (Sage, APD, Mecalux). Gap claro.
- **"n8n automatización España"**: dificultad media, dominado por agencias de Madrid y tutoriales. Sin presencia en Andalucía.
- **"Consultor digital Granada"**: dominado por directorios spam. Oportunidad de posicionamiento con contenido de calidad.

---

## 2. Diagnóstico de señales actuales

| Señal | Estado actual | Impacto en reorientación |
|---|---|---|
| H1 home | ✅ Menciona "Desarrollo Web" y "Automatización" | Señal correcta pero diluida en SPA |
| Meta title | ✅ "Desarrollo web y automatización... Granada" | Bien orientado |
| Meta description | ✅ Menciona ambos servicios | Bien orientado |
| URLs dedicadas a servicios | ❌ No existen | **Bloqueante principal** |
| Schema `hasOfferCatalog` | ⚠️ Genérico en Layout.astro | Sin especificidad de servicio |
| Backlinks | ⚠️ Sin datos Moz (API no configurada) | Desconocido |
| Contenido indexado sobre web dev | ❌ 0 páginas dedicadas | Tráfico imposible |
| Contenido indexado sobre automatización | ❌ 0 páginas dedicadas | Tráfico imposible |
| llms.txt | ⚠️ Menciona servicios pero sin URLs propias | Señal débil para IA |
| Portfolio (señal indirecta) | ✅ 12 proyectos web reales | E-E-A-T por experiencia demostrable |

---

## 3. Estrategia de reorientación

### Palanca principal: páginas de servicio dedicadas

Esta es la única acción que puede generar rankings sostenibles para "desarrollo web Granada" y "automatización pymes". Sin URLs propias, el resto son optimizaciones marginales.

**Nota:** el plan de auditoría anterior identificó esto como *"el hallazgo de mayor severidad"* y lo dejó pendiente de confirmación explícita. El usuario confirma ahora la dirección. A partir de aquí es una decisión tomada.

### Estructura recomendada

```
/desarrollo-web-granada/          ← servicio principal #1
/automatizacion-pymes/            ← servicio principal #2
/blog/                            ← thought leadership + long-tail
  /blog/n8n-para-pymes-espana/
  /blog/automatizar-facturacion/
  /blog/como-elegir-desarrollador-web-granada/
  ...
```

Estas páginas no sustituyen la SPA de la home — la complementan. Vivirán en `src/pages/` con su propio `<head>`, schema y contenido, igual que las páginas de subvenciones.

---

## 4. Acciones priorizadas

### Bloque A — Páginas de servicio (máximo impacto, 4-8 semanas para ver resultados)

| # | Acción | URL | Prioridad | Esfuerzo |
|---|---|---|---|---|
| A1 | Crear `/desarrollo-web-granada/` | `/desarrollo-web-granada/` | Crítica | M (1-2 días) |
| A2 | Crear `/automatizacion-pymes/` | `/automatizacion-pymes/` | Crítica | M (1-2 días) |
| A3 | Enlazar desde home (sección Servicios) | `Portfolio.astro`, `Services.astro` | Alta | XS |
| A4 | Enlazar desde páginas de subvenciones | 6 páginas subvenciones | Alta | XS |

**Contenido mínimo viable para cada página (800-1.500 palabras):**
- Propuesta de valor específica (qué problema resuelve, para quién)
- Proceso de trabajo (3-5 pasos)
- Casos reales del portfolio (con métricas si existen)
- FAQ (5-7 preguntas reales de clientes)
- CTA hacia diagnóstico gratuito
- Schema `Service` + `ProfessionalService`

### Bloque B — Optimizaciones inmediatas sin nuevas páginas (esta semana)

| # | Acción | Fichero | Esfuerzo |
|---|---|---|---|
| B1 | Añadir `hasOfferCatalog` con servicios específicos al schema de `Layout.astro` | `src/layouts/Layout.astro` | S |
| B2 | Actualizar `llms.txt`: añadir URLs de servicios y casos del portfolio | `public/llms.txt` | XS |
| B3 | Cambiar `areaServed` en schema: eliminar Zaragoza/Aragón, dejar Granada + Andalucía + España | `src/layouts/Layout.astro` | XS |
| B4 | Actualizar meta title home para priorizar "desarrollo web" sobre términos genéricos | `src/i18n/ui.ts` | XS |
| B5 | Añadir `href="tel:+34614830864"` clicable en sección Contacto | componente Contact | XS |
| B6 | Actualizar descripciones de portfolio para señalar tecnologías específicas (Astro, n8n, WooCommerce) | `src/i18n/ui.ts` | S |

### Bloque C — Contenido de blog (resultados a 3-6 meses)

Publica estos posts por orden de prioridad. Apuntan a keywords de intención informacional pero con alta correlación con intención de compra en el nicho local:

| # | Título del post | Keyword objetivo | Intent | Por qué |
|---|---|---|---|---|
| C1 | "n8n para pymes españolas: guía práctica 2026" | n8n automatización España | Informacional → comercial | Gap claro, competencia moderada, demuestra expertise |
| C2 | "Qué procesos automatizar primero en tu negocio (con ejemplos reales)" | automatizar procesos negocio | Informacional | Long-tail alto, entrada al funnel |
| C3 | "Cómo elegir un desarrollador web en Granada: lo que nadie te dice" | desarrollador web Granada | Informacional → comercial | Gap en thought leadership local |
| C4 | "n8n vs Make vs Zapier en 2026: qué usar si eres pyme española" | n8n vs make zapier España | Comparativa | Alto CPC, buyer intent, poca competencia en español |
| C5 | "Automatización para hostelería en Granada: casos reales" | automatización hostelería Granada | Informacional local | Segmento target con volumen local + portfolio demostrable |
| C6 | "Cuánto cuesta una web profesional en Granada (precios reales, 2026)" | precio web Granada | Informacional → comercial | Alta intención de compra, pocas páginas honestas |
| C7 | "Desarrollo web con Astro: por qué lo usamos en RPI Dev" | Astro desarrollo web | Informacional técnico | E-E-A-T, señal de expertise para LLMs |

---

## 5. Especificaciones para las páginas de servicio

### `/desarrollo-web-granada/`

**Keyword primaria:** "desarrollo web Granada"  
**Keywords secundarias:** "diseño web Granada", "páginas web para pymes Granada", "web para autónomos Granada"  
**Intent:** Comercial local  
**Competencia:** Baja-media (agencias pequeñas, sin thought leadership)

**Estructura del contenido:**
```
H1: Desarrollo Web en Granada para Pymes y Autónomos
  ↳ tagline: Webs rápidas, con SEO desde el primer día.

[Propuesta de valor — 2-3 párrafos]
  - Por qué una web lenta o genérica pierde clientes
  - Qué diferencia una web que convierte
  - Por qué Astro/SSG frente a WordPress genérico

[Servicios específicos — cards/lista]
  - Web corporativa / landing page
  - Tienda online (WooCommerce headless)
  - Web con CMS (WordPress headless, Astro Content Collections)
  - Mantenimiento y optimización de webs existentes

[Proceso de trabajo — 3-4 pasos]
  1. Diagnóstico gratuito (30 min)
  2. Propuesta con precio fijo
  3. Desarrollo y revisiones
  4. Entrega y formación

[Portfolio — 4-5 casos]
  Espacio Negua, FPC Instalaciones, Nieves Muriel, Amacapricci, Casvisol
  (con métrica real si existe: Lighthouse, tiempo de carga, conversión)

[FAQ — 5-7 preguntas]
  - ¿Cuánto cuesta una web profesional en Granada?
  - ¿Cuánto tiempo tarda el desarrollo?
  - ¿Puedo actualizar yo mismo el contenido?
  - ¿Incluye SEO?
  - ¿Qué pasa si ya tengo una web?

[CTA]
  → Diagnóstico gratuito de 30 min
```

**Schema:**
```json
{
  "@type": "Service",
  "name": "Desarrollo Web en Granada",
  "provider": { "@id": "https://www.rpidev.com/#organization" },
  "areaServed": "Granada, Andalucía, España",
  "serviceType": "Web Development",
  "description": "...",
  "url": "https://www.rpidev.com/desarrollo-web-granada/"
}
```

---

### `/automatizacion-pymes/`

**Keyword primaria:** "automatización pymes"  
**Keywords secundarias:** "automatización procesos empresa", "automatización con n8n", "automatizar tareas negocio Granada"  
**Intent:** Comercial / investigación  
**Competencia:** Nacional alta, pero local = gap real

**Estrategia:** No competir con Sage/APD en "automatización pymes España" genérico. Atacar por flanco local ("Granada") y por herramienta específica ("n8n", "Make"). El expertise en herramientas concretas es el diferenciador.

**Estructura del contenido:**
```
H1: Automatización de Procesos para Pymes en Granada
  ↳ tagline: Menos tareas repetitivas. Más horas para lo que importa.

[Propuesta de valor]
  - Qué es la automatización (sin jerga)
  - Qué ROI real puede esperar una pyme (ejemplos concretos)
  - n8n, Make, Zapier: cuándo usar cada uno

[Qué automatizamos — casos de uso reales]
  - Facturación y contabilidad
  - CRM y seguimiento de leads
  - Notificaciones y recordatorios
  - Sincronización entre plataformas (Shopify, WooCommerce, Google Sheets)
  - Informes automáticos

[Tecnologías]
  n8n (self-hosted, RGPD compliance), Make, Zapier, APIs personalizadas

[Proceso]
  1. Auditoría de procesos (gratuita)
  2. Diseño del flujo
  3. Implementación y pruebas
  4. Formación y traspaso

[FAQ]
  - ¿Es caro automatizar?
  - ¿Necesito conocimientos técnicos?
  - ¿Qué pasa si un flujo falla?
  - ¿Por qué n8n en vez de Zapier?
  - ¿Cuánto tiempo tardan en estar listos?

[CTA]
  → Cuéntame qué proceso quieres automatizar
```

---

## 6. Cambios en schema (Bloque B1)

En `src/layouts/Layout.astro`, añadir dentro del `LocalBusiness`:

```json
"hasOfferCatalog": {
  "@type": "OfferCatalog",
  "name": "Servicios RPI Dev",
  "itemListElement": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Desarrollo Web para Pymes",
        "url": "https://www.rpidev.com/desarrollo-web-granada/"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Automatización de Procesos con n8n y Make",
        "url": "https://www.rpidev.com/automatizacion-pymes/"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Integraciones IoT y Software",
        "url": "https://www.rpidev.com/"
      }
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Consultoría Digital",
        "url": "https://www.rpidev.com/"
      }
    }
  ]
}
```

---

## 7. Actualización de `llms.txt` (Bloque B2)

Sustituir la sección `## Services` actual por:

```markdown
## Services

RPI Dev offers four core service areas:

1. **Web development** ([/desarrollo-web-granada/](https://www.rpidev.com/desarrollo-web-granada/)) — Fast, SEO-optimized websites built with Astro, React and WooCommerce for freelancers and SMBs in Granada and Andalucía. Specialization in headless CMS architectures, e-commerce, and local SEO.
2. **Process automation** ([/automatizacion-pymes/](https://www.rpidev.com/automatizacion-pymes/)) — Automated workflows using n8n (self-hosted, GDPR-compliant), Make, and Zapier. Typical use cases: invoicing automation, CRM sync, notification flows, cross-platform integrations.
3. **Software & IoT integrations** — Connecting ERP, POS, custom APIs, and IoT hardware for agriculture, hospitality, warehouses, and industrial environments.
4. **Digital consulting** — 30-minute free diagnosis and personalized digital transformation roadmap.

## Portfolio highlights

- Espacio Negua (espacionegua.com) — Therapeutic center website with headless WordPress CMS, contact form, PostgreSQL blog
- FPC Instalaciones (fpcinstalaciones.com) — Corporate web for plumbing/HVAC company
- Amacapricci (amacapricci.com) — Headless WooCommerce jewelry e-commerce with Astro frontend
- RPIoT (rpiot.es) — IoT monitoring platform landing
- SEO Pilot (seopilot.es) — AI-powered SEO audit SaaS (Python + React + FastAPI)
- Choose (easychoose.es) — AI device recommendation app (Python + Reflex + Gemini AI)
```

---

## 8. Meta title home (Bloque B4)

**Actual:**
```
RPIDev — Desarrollo web y automatización para autónomos y pymes en Granada
```

**Propuesta:**
```
Desarrollo Web y Automatización en Granada | RPI Dev
```

**Por qué:** el título actual empieza por la marca (RPIDev), que tiene autoridad cero en Google. Empezar por la keyword primaria da más peso al término en el snippet. La marca va al final como refuerzo de entidad.

**Meta description home — propuesta:**
```
Webs rápidas con SEO local y automatización de procesos para pymes en Granada. Astro, n8n, WooCommerce. Diagnóstico gratuito de 30 min — sin compromiso.
```
(153 caracteres — dentro del límite)

---

## 9. KPIs y seguimiento

| Métrica | Hoy (28d) | Objetivo 3 meses | Objetivo 6 meses |
|---|---|---|---|
| Impresiones "desarrollo web Granada" | ~0 | 100-300 | 500+ |
| Impresiones "automatización pymes" | ~0 | 50-150 | 300+ |
| Clics desde SERPs de servicios | ~0 | 5-20 | 30-80 |
| Posición media `/desarrollo-web-granada/` | N/A | top 20 | top 10 |
| Posición media `/automatizacion-pymes/` | N/A | top 30 | top 15 |
| Páginas de blog indexadas | 0 | 3-4 | 7+ |

**Revisión recomendada:** GSC cada 4 semanas, filtrar por "desarrollo web" + "automatización" en las dimensiones de consulta.

---

## 10. Hoja de ruta de implementación

### Semana 1-2 (impacto inmediato, sin nuevas páginas)
- [ ] B1 — `hasOfferCatalog` en schema de Layout.astro
- [ ] B2 — Actualizar `llms.txt` con URLs y portfolio
- [ ] B3 — Eliminar `areaServed` Zaragoza/Aragón del schema global
- [ ] B4 — Cambiar meta title home
- [ ] B5 — Añadir `tel:` clicable en Contacto
- [ ] B6 — Enriquecer descripciones de portfolio en i18n con tecnologías

### Semana 3-4 (palanca principal)
- [ ] A1 — Crear `/desarrollo-web-granada/` (800-1.500 palabras, schema Service, FAQ)
- [ ] A2 — Crear `/automatizacion-pymes/` (800-1.500 palabras, schema Service, FAQ)
- [ ] A3 — Enlazar desde home (sección Servicios, CTA secundario)
- [ ] A4 — Enlazar desde páginas de subvenciones ("¿Necesitas web o automatización?")

### Mes 2 (primera publicación de blog)
- [ ] C1 — "n8n para pymes españolas: guía práctica 2026"
- [ ] C3 — "Cómo elegir un desarrollador web en Granada"

### Mes 3 (expansión de contenido)
- [ ] C2 — "Qué procesos automatizar primero"
- [ ] C4 — "n8n vs Make vs Zapier en 2026"
- [ ] Revisión GSC: ¿qué consultas nuevas aparecen? ajustar contenido

### Mes 4-6 (consolidación)
- [ ] C5 — Automatización para hostelería Granada
- [ ] C6 — Cuánto cuesta una web en Granada (precios reales)
- [ ] C7 — Desarrollo web con Astro
- [ ] Revisión de posiciones y ajuste de enlazado interno

---

## 11. Decisiones que confirmar antes de ejecutar

| Decisión | Opciones | Recomendación |
|---|---|---|
| ¿Crear páginas de servicio? | Sí / No | **Sí** — es la única palanca real para rankear en servicios |
| ¿URL para automatización? | `/automatizacion-pymes/` vs `/automatizacion-granada/` | `/automatizacion-pymes/` (más volumen de búsqueda nacional) |
| ¿Blog propio o sección en home? | `/blog/` dedicado vs sin blog | `/blog/` dedicado — el contenido necesita URLs propias para rankear |
| ¿`areaServed` Aragón? | Mantener (justificado por clientes) / Eliminar (solo Granada) | Si hay clientes reales en Aragón, mantener en páginas de subvenciones pero eliminar del schema global |
| ¿Dirección visible? | SAB sin dirección / SAB con dirección en HTML | SAB sin dirección visible (solo en schema JSON-LD) |
