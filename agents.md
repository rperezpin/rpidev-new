# Agents - RPIDEV Web

Instrucciones para agentes IA que trabajen en este proyecto.

## Contexto del Proyecto

Web profesional de RPI Dev (Ruben Perez Izuel), consultor digital y desarrollador web en Granada, Espana. El sitio es una single-page con scroll horizontal dirigida a autonomos y pymes que necesitan digitalizacion, automatizacion y desarrollo web.

## Reglas SEO Criticas

### Meta Tags Obligatorios
Cada pagina debe incluir:
- `<title>` unico y descriptivo (max 60 caracteres)
- `<meta name="description">` unico (max 155 caracteres)
- `<link rel="canonical">` con URL absoluta
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `<meta name="theme-color" content="#0a0a0a">`

### Schema.org JSON-LD
La pagina principal debe incluir:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "RPI Dev",
  "description": "Consultoria digital y desarrollo web para autonomos y pymes",
  "url": "https://www.rpidev.com",
  "email": "ruben@rpidev.com",
  "telephone": "+34614830864",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Ermita 42",
    "addressLocality": "Huetor Vega",
    "addressRegion": "Granada",
    "postalCode": "18198",
    "addressCountry": "ES"
  },
  "founder": {
    "@type": "Person",
    "name": "Ruben Perez Izuel"
  },
  "sameAs": [
    "https://www.linkedin.com/in/ruben-perez-izuel-a02607189",
    "https://github.com/rperezpin",
    "https://www.instagram.com/rpi.dev/",
    "https://www.facebook.com/profile.php?id=61583465244829"
  ]
}
```

### HTML Semantico
- Usar `<header>` para la zona de navegacion
- Usar `<nav>` para menus de navegacion
- Usar `<main>` para el contenido principal
- Usar `<section>` para cada pantalla del scroll horizontal
- Cada seccion debe tener un heading (`<h2>` o `<h3>`)
- Usar `<article>` para tarjetas de proyecto
- Usar `<footer>` para el pie de pagina
- El `<h1>` debe estar oculto con `sr-only` para accesibilidad

### Imagenes
- Formato preferido: AVIF con fallback WebP y JPG
- Atributo `alt` descriptivo obligatorio
- `loading="lazy"` para imagenes fuera del viewport
- `width` y `height` explicitos para evitar CLS
- Usar el componente `<Image>` de Astro cuando sea posible

### Rendimiento
- Preload de fuentes criticas (IBM Plex Mono)
- CSS critico inline
- Scripts con `defer` o carga al final del body
- Evitar JavaScript innecesario en el cliente
- Preferir CSS para animaciones (no JS cuando sea posible)

## Estructura de Secciones (scroll horizontal)

| Indice | Seccion | Archivo | Heading |
|--------|---------|---------|---------|
| 0 | Hero | `Hero.astro` | h1 (sr-only) + h2 visible |
| 1 | Problema | `Problem.astro` | h2 |
| 2 | Servicios | `Services.astro` | h2 |
| 3 | Plan 3 Pasos | `Plan.astro` | h2 |
| 4 | Portfolio | `Portfolio.astro` | h2 |
| 5 | Contacto | `Contact.astro` | h2 |

## Paleta de Colores (solo modo oscuro)

| Variable | Valor | Uso |
|----------|-------|-----|
| Fondo | `#0a0a0a` | Background principal |
| Texto | `#ededed` | Texto principal |
| Acento | `#2563eb` (blue-600) | Botones, links, highlights |
| Acento hover | `#1d4ed8` (blue-700) | Estados hover |
| Secundario | `#94a3b8` (slate-400) | Texto secundario |
| Borde | `rgba(255,255,255,0.05)` | Bordes sutiles |
| Superficie | `rgba(255,255,255,0.03)` | Fondos de tarjetas |

## Tipografia

- **Fuente principal:** IBM Plex Mono
- **Pesos:** 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Fallback:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

## Datos de Contacto (usar estos exactos)

- **Email:** ruben@rpidev.com
- **WhatsApp:** https://wa.me/34614830864
- **Cal.com:** https://cal.com/ruben-perez-yumwg8/30min
- **Telegram:** https://t.me/rpidev
- **LinkedIn:** https://www.linkedin.com/in/ruben-perez-izuel-a02607189
- **GitHub:** https://github.com/rperezpin
- **Instagram:** https://www.instagram.com/rpi.dev/

## Proyectos del Portfolio

| Proyecto | URL | Tech |
|----------|-----|------|
| Hebe Psico | https://www.hebepsicologa.com | Astro, Tailwind |
| SEO Pilot | https://www.seopilot.es | Python, React, FastAPI |
| CRM rpidev | https://crm-rpidev.vercel.app/ | Next.js, Node.js, PostgreSQL |
| BasicPlanner | https://landing-basic-planner.vercel.app/ | React, Firebase |
| VeriFax Landing | https://landing-verifax.vercel.app/ | Next.js, TypeScript |
| VeriFax Sistema | https://verifactu2.onrender.com/ | Node.js, Express, MongoDB |

## Convenciones de Codigo

- Componentes Astro con PascalCase
- Archivos CSS con kebab-case
- Clases Tailwind en orden: layout > spacing > sizing > typography > colors > effects
- Scripts del cliente con `<script>` tag en componentes Astro (no archivos separados)
- Sin dependencias innecesarias: preferir CSS y HTML nativo
