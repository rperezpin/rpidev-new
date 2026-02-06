# RPIDEV - Web Profesional

Web profesional de RPI Dev (Ruben Perez Izuel). Consultor digital y desarrollador web especializado en digitalizacion, automatizacion y desarrollo de software para autonomos y pymes.

## Stack Tecnico

| Componente | Tecnologia |
|------------|-----------|
| Framework | Astro 5.x |
| Estilos | Tailwind CSS 4.x |
| Lenguaje | TypeScript |
| Fuente | IBM Plex Mono (Google Fonts) |
| Iconos | Lucide |
| SEO | Schema.org, Open Graph, Sitemap |

## Estructura del Proyecto

```
src/
  layouts/
    Layout.astro          # Layout base con meta tags, fonts, SEO
  components/
    Nav.astro             # Navegacion fija superior
    Footer.astro          # Barra inferior fija
    sections/
      Hero.astro          # Seccion 1: Presentacion + CTA
      Problem.astro       # Seccion 2: Pain points del cliente
      Services.astro      # Seccion 3: 4 servicios
      Plan.astro          # Seccion 4: Plan 3 pasos
      Portfolio.astro     # Seccion 5: Proyectos destacados
      Contact.astro       # Seccion 6: Formulario + contacto
  pages/
    index.astro           # Pagina principal (single-page horizontal scroll)
    legal.astro           # Aviso legal (noindex)
    privacy.astro         # Politica de privacidad (noindex)
    cookies.astro         # Politica de cookies (noindex)
  styles/
    global.css            # Estilos globales y Tailwind
public/
  images/                 # Imagenes optimizadas (AVIF/WebP)
  favicon.svg             # Favicon
```

## Diseno

- **Single-page** con scroll horizontal (snap) y 6 secciones
- **Modo oscuro** exclusivo
- **Animaciones** de entrada por seccion (opacity, translate)
- **Gradiente dinamico** que sigue el cursor
- **Mobile-first** responsive

## SEO

- Meta tags completos (title, description, canonical)
- Open Graph y Twitter Card
- Schema.org JSON-LD (WebPage, LocalBusiness)
- Sitemap automatico
- robots.txt
- HTML semantico (header, nav, main, section, article, footer)
- Preload de fuentes criticas
- URLs canonicas

## Scripts

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de produccion
npm run preview   # Preview del build
```

## Contacto

- **Web:** https://www.rpidev.com
- **Email:** ruben@rpidev.com
- **LinkedIn:** https://www.linkedin.com/in/ruben-perez-izuel-a02607189
- **GitHub:** https://github.com/rperezpin
