# Auditoría Visual — rpidev.com (Home)

Método: capturas Playwright/Chromium (desktop 1920x1080, mobile 375x812 @2x), inspección del árbol de accesibilidad y HTML renderizado, revisión de consola.

Screenshots:
- `/home/ruben/Proyectos/rpidev-new/rpidev.com-audit/screenshots/desktop.png`
- `/home/ruben/Proyectos/rpidev-new/rpidev.com-audit/screenshots/mobile.png`
- `/home/ruben/Proyectos/rpidev-new/rpidev.com-audit/screenshots/mobile_full.png` (full page, ver hallazgo 2)
- Variantes adicionales: `www_rpidev_com_laptop.png`, `www_rpidev_com_tablet.png`

---

## 1. Above-the-fold móvil: gran espacio vacío antes del titular

- **Hallazgo:** En viewport 375x812 hay ~400px de espacio en blanco entre el header (logo + indicador de paso "1 2 3 4 5 6 7") y el bloque de texto "CONSULTOR DIGITAL & DEV / Digitaliza tu negocio...". El titular, subtítulo y CTA principal quedan empujados fuera de la zona visible sin scroll.
- **Severidad:** Alta (afecta directamente la conversión above-the-fold en móvil, que es previsiblemente el tráfico mayoritario).
- **Evidencia:** `screenshots/mobile.png` — franja vacía visible entre y=100px y y=530px aprox. (coords a 2x, ≈ y=50–265 CSS px).
- **Recomendación:** Reducir el padding/margin superior de la sección hero en breakpoint móvil, o mover el badge "CONSULTOR DIGITAL & DEV" más arriba, para que titular + CTA sean visibles sin scroll en un iPhone estándar.
- **Check de falsabilidad:** Medir con DevTools el `padding-top`/`margin-top` real de la sección hero en mobile; si es <100px y el hueco persiste, la causa es otra (imagen/elemento no renderizado) y el hallazgo debe corregirse.
- **Indicador adelantado:** % de scroll hasta el primer clic en "DIAGNÓSTICO GRATUITO" en móvil (GA4/Clarity); debería reducirse tras el fix.

---

## 2. Posible "scroll-jacking" / diseño por slides no confirmado como scrollable estándar

- **Hallazgo:** La captura "full page" en móvil (`--full`) generó una imagen de idéntica altura (750x1624) a la captura de un solo viewport, y el header muestra un indicador de paso "1 2 3 4 5 6 7" en vez de un menú de navegación tradicional. Esto sugiere que la home podría estar implementada como secciones de 100vh controladas por JS en lugar de scroll nativo, lo que puede impedir que Playwright (y potencialmente algunos usuarios/lectores de pantalla) accedan al contenido completo mediante scroll estándar.
- **Severidad:** Media-Alta (si se confirma, es un patrón de riesgo para SEO/accesibilidad/UX; si es un falso positivo de la herramienta de captura, la severidad baja a informativa).
- **Evidencia:** `screenshots/mobile_full.png` idéntico en altura a `screenshots/mobile.png`; el HTML renderizado sí contiene todas las secciones (Problema, Servicios, Plan, Proyectos, Subvenciones, Contacto) por lo que el contenido existe en el DOM pero no se reflejó en la captura "full page".
- **Recomendación:** Verificar manualmente en un móvil real si el scroll de la página es nativo y fluido, o si depende de JS (scrollytelling). Si es scroll-jacking, evaluar simplificarlo por accesibilidad y compatibilidad con lectores de pantalla/gestos táctiles.
- **Check de falsabilidad:** Repetir la captura full-page con `wheel`/scroll manual simulado en Playwright y comparar; si la altura capturada aumenta a la suma real de secciones, el problema es solo de la herramienta de captura, no del sitio.
- **Indicador adelantado:** Tasa de scroll profundo (scroll depth 75%/90%) en Analytics/Clarity segmentado por móvil.

---

## 3. Banner de cookies solapa el CTA secundario y el footer en móvil

- **Hallazgo:** En móvil, el banner de consentimiento de cookies se solapa con el botón "VER CÓMO FUNCIONA" y con el texto del footer ("© 2026 RPIDEV | ONLINE"), que aparece parcialmente cortado/ilegible detrás del banner.
- **Severidad:** Media (bloquea temporalmente un CTA secundario hasta que el usuario decide sobre cookies; problema de legibilidad, no de conversión primaria).
- **Evidencia:** `screenshots/mobile.png`, franja inferior (y≈1200–1624px a 2x).
- **Recomendación:** Reducir la altura del banner en móvil o mostrarlo como bottom-sheet compacto de una línea con enlace "Más info", evitando tapar CTAs.
- **Check de falsabilidad:** Inspeccionar el z-index/posición del banner en DevTools; si no se solapa con ningún elemento interactivo tras medir coordenadas exactas, descartar el hallazgo.
- **Indicador adelantado:** Ratio de clics en "VER CÓMO FUNCIONA" antes vs. después de aceptar/rechazar cookies (si es mucho menor antes, confirma el bloqueo).

---

## 4. Indicador de pasos "1–7" en móvil con touch targets pequeños

- **Hallazgo:** Los círculos numerados (1 a 7) en el header móvil miden aproximadamente 30-35px de diámetro aparente, por debajo del mínimo recomendado de 48x48px para targets táctiles.
- **Severidad:** Baja-Media (usabilidad móvil, no bloquea conversión pero dificulta la navegación por secciones a usuarios con menor precisión táctil).
- **Evidencia:** `screenshots/mobile.png`, header superior, fila de números junto al logo.
- **Recomendación:** Aumentar el área táctil (padding invisible) de cada indicador a mínimo 48x48px, aunque el elemento visual se mantenga pequeño.
- **Check de falsabilidad:** Medir con DevTools el `width`/`height` computado de cada botón numerado (incluyendo padding clickeable); si ya es ≥48px, el hallazgo es incorrecto.
- **Indicador adelantado:** Tasa de error de tap (clics fallidos/reintentos) en heatmap móvil (Clarity/Hotjar) sobre esa zona.

---

## 5. Navegación principal implementada como botones JS, no enlaces

- **Hallazgo:** En el árbol de accesibilidad, los ítems del menú (INICIO, PROBLEMA, SERVICIOS, PLAN, PORTFOLIO, SUBVENCIONES, CONTACTO) tienen `role: button`, no `role: link`/`<a href>`. Es decir, la navegación depende de JS sin URLs de ancla navegables.
- **Severidad:** Media (accesibilidad: usuarios de teclado/lector de pantalla esperan comportamiento de enlace; SEO: no aporta anclas internas rastreables; usabilidad: no se puede abrir en pestaña nueva ni compartir enlace directo a sección).
- **Evidencia:** Extracto del árbol de accesibilidad (`render_page.py --a11y-tree`): `{"role": "button", "name": "INICIO", ...}`, `{"role": "button", "name": "SERVICIOS", ...}`.
- **Recomendación:** Cambiar los ítems de navegación a elementos `<a href="#seccion">` (o Link de router) manteniendo el comportamiento de scroll/JS vía `preventDefault` si es necesario, para conservar semántica y accesibilidad.
- **Check de falsabilidad:** Inspeccionar el DOM real (no solo el a11y tree) para confirmar si son `<button>` o `<a>` con rol sobreescrito por ARIA; si son `<a>` con `role="button"` forzado incorrectamente, la recomendación cambia a solo quitar el `role`.
- **Indicador adelantado:** Errores de axe-core/Lighthouse relacionados con "Links do not have a discernible name/role" tras el cambio.

---

## 6. Contenido duplicado en el DOM (carrusel de proyectos y bloque "Hablamos/Diseñamos/Implementamos")

- **Hallazgo:** Tanto la sección de logos de proyectos como el bloque de 3 pasos ("Hablamos", "Diseñamos", "Implementamos") aparecen duplicados en el árbol de accesibilidad/HTML (cada H3 aparece dos veces), consistente con una técnica de marquee/loop infinito que clona los elementos.
- **Severidad:** Baja (funcionalmente es una técnica común de carrusel, pero duplica contenido para lectores de pantalla y puede diluir señales de contenido único para buscadores si no se marca `aria-hidden` en la copia).
- **Evidencia:** Extracto de encabezados extraídos del HTML: "Hablamos/Diseñamos/Implementamos" y los 10 logos de proyectos (FPC Instalaciones, Agropur, RPIoT, etc.) listados dos veces consecutivas.
- **Recomendación:** Añadir `aria-hidden="true"` y `role="presentation"` al set duplicado usado solo para el efecto visual del loop, dejando un único set accesible.
- **Check de falsabilidad:** Verificar en el DOM si la copia duplicada ya tiene `aria-hidden`; si el a11y tree la sigue exponiendo pese a `aria-hidden`, es un bug de la herramienta, no del sitio.
- **Indicador adelantado:** Ninguna alerta de "contenido duplicado" en auditoría de accesibilidad (axe) tras el cambio.

---

## 7. Analítica (GA4) bloqueada por la propia CSP del sitio

*(Hallazgo técnico detectado durante la carga de la página, no estrictamente visual, pero con impacto directo en la medición de la efectividad del above-the-fold/CTA.)*

- **Hallazgo:** La consola del navegador muestra que las peticiones de Google Analytics 4 a `region1.analytics.google.com` y `stats.g.doubleclick.net` son bloqueadas por la directiva `connect-src` de la Content-Security-Policy del sitio, que solo permite `google-analytics.com`, `analytics.google.com` y `googletagmanager.com`.
- **Severidad:** Media-Alta (los eventos `page_view` y de conversión probablemente no se están registrando correctamente, invalidando cualquier métrica de CTR del hero/CTA).
- **Evidencia:** Errores de consola capturados: *"Fetch API cannot load https://region1.analytics.google.com/g/collect... Refused to connect because it violates the document's Content Security Policy"* (y equivalente para `stats.g.doubleclick.net`).
- **Recomendación:** Añadir `https://*.analytics.google.com` y `https://*.g.doubleclick.net` (o los dominios regionales específicos que use GA4) a `connect-src` en la CSP.
- **Check de falsabilidad:** Repetir la carga con DevTools Network abierto y filtrar por "collect"; si las peticiones devuelven 200 (no bloqueadas), el hallazgo es falso o ya corregido.
- **Indicador adelantado:** Comparar el volumen de eventos `page_view` en GA4 Realtime durante una visita de prueba controlada vs. el número de sesiones reales generadas.

---

## Resumen above-the-fold

- **Desktop (1920x1080):** Correcto. H1 visual, subtítulo y CTA "DIAGNÓSTICO GRATUITO" + CTA secundario "VER CÓMO FUNCIONA" visibles sin scroll. Buen contraste (texto claro sobre fondo oscuro navy). Banner de cookies en esquina inferior derecha no tapa el CTA principal.
- **Móvil (375x812):** CTA principal visible pero desplazado hacia el borde inferior por el espacio vacío superior (hallazgo 1); CTA secundario parcialmente tapado por el banner de cookies (hallazgo 3). Texto legible (tamaño aparente ≥16px). No se detecta scroll horizontal ni overflow de texto en el hero.
