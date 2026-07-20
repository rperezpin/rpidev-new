# Plan SEO local — Pyme Digital / Cámara Granada 2026

**Fecha de elaboración:** 20 de julio de 2026
**Verificación de fuentes:** camaragranada.org (convocatoria 2026 publicada), granadaeconomica.es, ahoragranada.com — consultadas el 20/07/2026
**Ventana de oportunidad:** 27 julio – 30 octubre 2026 (95 días)

---

## 0. Resumen ejecutivo

La convocatoria 2026 de las ayudas Cámara Granada + Diputación se publicó el 17 de julio. Abre el **27 de julio a las 09:00** y cierra el **30 de octubre a las 14:00**. Se concede **por estricto orden de registro** (en 2025 era sorteo notarial), lo que convierte la búsqueda en un problema de urgencia: quien lo sepa antes, entra.

Nadie está posicionado todavía para `pyme digital granada 2026`. La consulta ni siquiera aparece en tus datos de Search Console. La competencia por ese término hoy es prácticamente cero, y el término tendrá pico de demanda entre el 24 de julio y el 15 de septiembre.

**Acción central:** publicar antes del 24 de julio una página dedicada `/subvenciones/pyme-digital-granada/` y redirigir hacia ella la demanda existente de "kit digital granada".

---

## 1. Diagnóstico de los datos actuales

### 1.1 Rendimiento por página (últimos 3 meses)

| URL | Clics | Impr. | CTR | Pos. | Lectura |
|---|---|---|---|---|---|
| `/` | 13 | 69 | 18,84% | 8,68 | Sana. Marca + cola larga |
| `/subvenciones/ayudas-andalucia/` | 10 | 121 | 8,26% | 5,90 | **La que mejor funciona.** Este es el modelo a replicar |
| `/subvenciones/` | 6 | 1.561 | 0,38% | 8,55 | Acumula el 74% de las impresiones y el 12% de los clics |
| `/subvenciones/ayudas-aragon/` | 2 | 48 | 4,17% | 10,08 | Correcta pero sin volumen |
| `/en/` | 1 | 90 | 1,11% | 7,49 | Tráfico internacional sin valor comercial |
| `/subvenciones/leader-digitalizacion/` | 0 | 11 | 0% | 3,27 | Posición excelente, demanda inexistente |

**Conclusión:** las páginas específicas convierten (8,26% y 4,17%), la página hub no (0,38%). El patrón es inequívoco: una página = una ayuda = una intención de búsqueda.

### 1.2 El malentendido del CTR

La hipótesis de "buenas impresiones, mal CTR" en `/subvenciones/` no se sostiene al desglosar por consulta:

| Consulta | Impr. | Pos. | CTR real esperable |
|---|---|---|---|
| kit digital granada | 161 | 16,23 | ~0,5% |
| subvención kit digital granada | 37 | 22,11 | ~0,2% |
| ayudas kit digital granada | 31 | 21,26 | ~0,2% |
| kit digital en granada | 27 | 19,15 | ~0,3% |
| ayudas digitalización junta de andalucía | 11 | 27,91 | ~0% |
| kit digital andalucía | 7 | 20,86 | ~0,2% |

Las consultas con volumen están **en la segunda página de resultados**. Un CTR del 0% ahí es el comportamiento normal, no una anomalía. Reescribir el `<title>` de `/subvenciones/` no moverá la aguja mientras la página siga en posición 16-22 para esos términos.

En cambio, las consultas donde sí estás en top 5 (`ayudas públicas digitalización ia pymes españa` pos. 4, `kit digital plazo 2026` pos. 1, `automation consultant near me` pos. 1) tienen 1-5 impresiones cada una. Posición sin volumen.

**El diagnóstico correcto es:** una página hub genérica compite mal contra páginas dedicadas de gestorías y consultoras. La solución es estructural, no de copy.

### 1.3 El hueco que nadie está cubriendo

Cluster "Kit Digital en Granada": **256 impresiones**, 0 clics.

Estas personas están buscando dinero público para digitalizarse en Granada. El Kit Digital sigue sin plazos publicados por Red.es. Pyme Digital abre en 7 días, es local, y financia exactamente lo mismo (web, comercio electrónico, marketing digital).

Es la misma persona, buscando lo mismo, con una respuesta mejor disponible. Hoy no se la estás dando.

### 1.4 Tráfico internacional

España: 800 impresiones, 33 clics (4,12%). Resto del mundo: ~1.058 impresiones, 1 clic.

Estados Unidos (373), Países Bajos (212), Alemania (172) y Reino Unido (92) suman 849 impresiones con cero clics, probablemente vía `/en/` y consultas como `web development`. No es tráfico dañino, pero distorsiona todas tus métricas agregadas. **Segmenta siempre por España en Search Console antes de sacar conclusiones.**

### 1.5 Evolución temporal

Las impresiones despegan el 21 de junio (de ~5/día a 23/día) y llegan a un pico de 169 el 7 de julio. Esa curva coincide con el rumor de convocatoria. Los clics no acompañan porque no había página que respondiera a esa búsqueda concreta.

Si la curva se repite con la publicación oficial del 17 de julio, el pico de demanda cae entre el 25 de julio y el 10 de agosto.

---

## 2. Arquitectura propuesta

```
/subvenciones/                              ← hub, enlaza y compara
├── /subvenciones/pyme-digital-granada/     ← NUEVA. Prioridad máxima
├── /subvenciones/kit-digital-granada/      ← existe, revisar indexación
├── /subvenciones/ayudas-andalucia/         ← funciona, mantener
├── /subvenciones/ayudas-aragon/            ← funciona, mantener
└── /subvenciones/leader-digitalizacion/    ← mantener
```

**Nota sobre `/subvenciones/kit-digital-granada`:** está enlazada dos veces desde el hub pero no aparece en el informe de páginas de Search Console. O tiene 0 impresiones, o no está indexada. Compruébalo con `site:rpidev.com/subvenciones/kit-digital-granada` y con la Inspección de URL. Si está creada y no indexada, es una fuga directa: es la página que debería estar capturando las 256 impresiones del cluster Kit Digital.

### 2.1 Canonicalización

Detectados en los datos dos pares de URLs duplicadas:

- `https://www.rpidev.com/subvenciones/` (1.561 impr.) vs `https://www.rpidev.com/subvenciones` (1 impr.)
- `.../leader-digitalizacion/` (11 impr.) vs `.../leader-digitalizacion` (2 impr.)

Además, el `<link rel="canonical">` de la página de subvenciones apunta a `https://www.rpidev.com/subvenciones` (sin barra), pero la URL que recibe el tráfico es la que lleva barra. **El canonical está señalando la versión equivocada.**

Corrección en Astro (`astro.config.mjs`):

```js
export default defineConfig({
  site: 'https://www.rpidev.com',
  trailingSlash: 'always',   // decide una y mantenla
  build: {
    format: 'directory'
  }
});
```

Y en el servidor, 301 de la versión sin barra a la versión con barra. Elige un formato y aplícalo en canonical, sitemap, enlaces internos y redirecciones. Da igual cuál, pero tiene que ser el mismo en los cuatro sitios.

Revisa también la canonicalización entre `rpidev.com` y `rpidev.es` — sigue pendiente y diluye autoridad.

---

## 3. Página nueva: `/subvenciones/pyme-digital-granada/`

### 3.1 Metadatos

```html
<title>Pyme Digital Granada 2026: hasta 6.366,50 € — abre el 27 de julio</title>

<meta name="description" content="Convocatoria 2026 de Cámara Granada: 75 ayudas de hasta 6.366,50 € para web, tienda online y marketing digital. Se concede por orden de registro desde el 27 de julio. Requisitos, plazos y qué gastos entran.">

<link rel="canonical" href="https://www.rpidev.com/subvenciones/pyme-digital-granada/">

<meta name="geo.placename" content="Granada">
<meta name="geo.region" content="ES-GR">
<meta name="geo.position" content="37.1773;-3.5986">
<meta name="ICBM" content="37.1773, -3.5986">

<meta property="og:title" content="Pyme Digital Granada 2026: hasta 6.366,50 € — abre el 27 de julio">
<meta property="og:description" content="75 ayudas para pymes y autónomos de la provincia de Granada. Por orden de registro hasta agotar los 624.009 € de presupuesto.">
<meta property="og:type" content="article">
<meta property="og:url" content="https://www.rpidev.com/subvenciones/pyme-digital-granada/">
<meta property="og:locale" content="es_ES">
<meta property="article:published_time" content="2026-07-21T09:00:00+02:00">
<meta property="article:modified_time" content="2026-07-21T09:00:00+02:00">
```

**Por qué este title:** la cifra exacta (6.366,50 €, no un redondeo) y una fecha inminente son los dos elementos que más CTR generan en búsquedas de subvenciones. Quien busca esto quiere saber cuánto y cuándo. El title tiene 62 caracteres, entra completo en resultados de escritorio.

**Nota sobre la fecha:** el `article:modified_time` debe actualizarse cada vez que toques la página. Google lo usa para mostrar la fecha en el snippet, y en contenido de convocatorias eso influye mucho en el clic.

### 3.2 Estructura de contenido

```
H1: Pyme Digital Granada 2026: ayudas de hasta 6.366,50 € para digitalizar tu negocio

[Caja de estado — arriba del todo, visible sin hacer scroll]
    Estado: ABIERTA a partir del 27 de julio de 2026, 09:00 h
    Cierre: 30 de octubre de 2026, 14:00 h
    Concesión: por estricto orden de registro
    Verificado el: [fecha]  ← actualizar semanalmente

H2: Qué es exactamente Pyme Digital
H2: Cuánto dinero es en realidad (y cuándo lo cobras)
    H3: La cifra que verás por ahí y la cifra real
    H3: Tienes que adelantar el dinero
H2: Quién puede pedirla
    H3: La reserva del 69% para la provincia
    H3: Si estás en Motril
H2: Qué puedes financiar con ella
    H3: Comercio electrónico
    H3: Marketing digital
    H3: Herramientas de gestión en la nube
H2: Las dos fases del programa
H2: Cómo solicitarla paso a paso
H2: Los otros tres programas de la misma convocatoria
H2: Pyme Digital y Kit Digital: en qué se diferencian
H2: En qué te puedo ayudar yo
H2: Preguntas frecuentes
H2: Fuentes oficiales
```

### 3.3 Contenido de las secciones clave

Escrito en tu voz. Ajusta lo que quieras, pero mantén el tono: nada de vender urgencia falsa, todo verificable.

---

**Caja de estado (componente destacado):**

> **Convocatoria abierta desde el 27 de julio de 2026**
> Cierra el 30 de octubre a las 14:00 h o antes, si se agota el presupuesto.
> Se concede por orden de registro: no hay sorteo ni concurso. El que llega antes, entra.
> *Última verificación en la sede de Cámara Granada: [fecha]*

---

**H2: Qué es exactamente Pyme Digital**

Es un programa de Cámara España, financiado con fondos FEDER y cofinanciado por Cámara Granada y la Diputación, para que pymes y autónomos de la provincia se digitalicen con dinero público.

Este año la convocatoria de Granada moviliza un millón de euros repartido en cuatro programas: Pyme Innova, Pyme Digital, Pyme Sostenible y Xpande Digital. En total 150 ayudas, de las cuales 75 son de Pyme Digital, con un presupuesto de 624.009,51 € para esa línea.

Lo importante de la edición de 2026: cambia el sistema. En 2025 había sorteo ante notario para ordenar a los admitidos. Este año se resuelve por estricto orden de registro hasta agotar los fondos.

---

**H2: Cuánto dinero es en realidad (y cuándo lo cobras)**

Vas a ver por ahí que son "7.000 €". Esa cifra es el coste directo máximo del proyecto, no la ayuda.

Los números reales, de la convocatoria oficial:

| Concepto | Importe |
|---|---|
| Coste directo máximo del proyecto | 7.000,00 € |
| Costes indirectos asociados (7%) | 490,00 € |
| Base máxima financiable | 7.490,00 € |
| Porcentaje subvencionado | 85% |
| **Ayuda máxima que recibes** | **6.366,50 €** |

**Y hay un detalle que casi nadie menciona:** la empresa prefinancia el 100%. Pagas tú el proyecto entero, lo justificas, y después cobras el 85%. No es un bono que se descuenta de la factura como en Kit Digital.

Con la ayuda máxima, un proyecto de 7.490 € te acaba costando 1.123,50 € de tu bolsillo. Pero necesitas tener los 7.490 € disponibles primero. Si eso no te encaja ahora mismo, mejor saberlo antes de empezar el trámite que después.

---

**H2: Quién puede pedirla**

Pymes y autónomos dados de alta en el censo del IAE dentro de la demarcación de Cámara Granada.

**La reserva del 69% para la provincia.** Cerca del 70% de las 150 ayudas está reservado para empresas de fuera de Granada capital. Si tu negocio está en un pueblo de la provincia, juegas con ventaja real: menos competencia por una bolsa mayor.

**Si estás en Motril.** El municipio de Motril no entra en la demarcación de Cámara Granada para estas ayudas. Compruébalo con la Cámara antes de preparar nada.

---

**H2: Qué puedes financiar con ella**

Las implantaciones se agrupan en tres líneas. Estas son las que tienen sentido para la mayoría de negocios pequeños:

**Comercio electrónico.** Tienda online, pasarela de pago, catálogo, integración con tu gestión de stock, sincronización con marketplaces.

**Marketing digital.** Web corporativa orientada a captar clientes, SEO, campañas de SEM, email marketing, presencia en buscadores locales.

**Herramientas de gestión en la nube.** CRM, facturación, gestión de proyectos, automatización de tareas repetitivas entre las herramientas que ya usas.

En la práctica, si lo que quieres es una web que traiga clientes, una tienda online o quitarte de encima trabajo administrativo repetitivo, encaja.

---

**H2: Las dos fases del programa**

**Fase I — Diagnóstico.** Un técnico de la Cámara analiza el nivel de digitalización de tu empresa y su cadena de valor, y te entrega un plan personalizado con las soluciones recomendadas. Es gratuito y no consume la ayuda.

**Fase II — Implantación.** Contratas a un proveedor externo que ejecuta lo que salió del diagnóstico y redacta la memoria del proyecto. Aquí es donde entra la ayuda del 85%.

El orden importa: no puedes ir directamente a la Fase II. El diagnóstico define qué es elegible en tu caso.

---

**H2: Pyme Digital y Kit Digital: en qué se diferencian**

*(Sección clave para captar la demanda de "kit digital granada")*

Mucha gente llega buscando el Kit Digital. No son lo mismo:

| | Pyme Digital (Cámara Granada) | Kit Digital (Red.es) |
|---|---|---|
| Ámbito | Provincia de Granada | Toda España |
| Estado hoy | Abierta 27 jul – 30 oct 2026 | Sin plazos publicados |
| Cuantía | Hasta 6.366,50 € | 2.000 – 12.000 € según tamaño |
| Cómo cobras | Adelantas tú y cobras después | Bono aplicado a la factura |
| Criterio | Orden de registro | Orden de solicitud |
| Diagnóstico previo | Obligatorio y gratuito | No |

Si estás en Granada y llevas meses esperando a que reabra el Kit Digital, esta convocatoria está abierta ahora. Y son compatibles con matices: consúltalo en la Cámara antes de asumir nada.

---

**H2: En qué te puedo ayudar yo**

Soy desarrollador. Hago la parte técnica: definimos el proyecto, lo ejecuto y preparo la documentación que necesitas para justificarlo. La tramitación administrativa la llevas tú con la Cámara, que tiene técnicos de apoyo gratuitos para eso.

Lo que te doy:

- Presupuesto desglosado y listo para la memoria del proyecto
- Ejecución: web, tienda online, automatización, CRM
- Toda la documentación técnica para la justificación
- Una respuesta honesta sobre si te compensa o no

Si el diagnóstico de la Cámara recomienda algo que yo no hago, te lo digo y te ayudo a buscar a quien lo haga.

---

### 3.4 FAQ (contenido + schema)

Las preguntas están redactadas tal como la gente las escribe en Google. Eso es lo que da opciones de aparecer en resultados destacados.

1. **¿Cuándo abre el plazo de Pyme Digital en Granada en 2026?**
   El 27 de julio de 2026 a las 09:00 h, en la sede electrónica de la Cámara. Cierra el 30 de octubre a las 14:00 h, salvo que se agote antes el presupuesto de 624.009,51 €.

2. **¿Cuánto dinero da realmente Pyme Digital?**
   La base máxima financiable es de 7.490 € (7.000 € de coste directo más 490 € de costes indirectos). Se subvenciona el 85%, así que la ayuda máxima es de 6.366,50 €. La cifra de "7.000 €" que circula es el coste del proyecto, no la ayuda.

3. **¿Tengo que adelantar el dinero?**
   Sí. La empresa prefinancia el 100% del proyecto y recibe la ayuda después de justificarlo. No funciona como el bono del Kit Digital.

4. **¿Hay sorteo como en 2025?**
   No. En la edición de 2026 se concede por estricto orden de registro de las solicitudes, hasta agotar la cuantía de cada programa.

5. **Mi empresa está en un pueblo de la provincia, ¿tengo menos opciones?**
   Al contrario. Cerca del 69% de las ayudas está reservado para empresas de fuera de Granada capital.

6. **¿Puedo pedirla si estoy en Motril?**
   El municipio de Motril no forma parte de la demarcación de Cámara Granada a efectos de esta convocatoria. Confírmalo directamente con la Cámara.

7. **¿Entra una página web en Pyme Digital?**
   Sí, dentro de las líneas de marketing digital y comercio electrónico, siempre que el diagnóstico previo de la Cámara lo recomiende para tu caso.

8. **¿Es compatible con el Kit Digital?**
   Son programas distintos con financiación distinta. Hay matices de compatibilidad según el gasto concreto. Pregúntalo en la Cámara antes de dar nada por hecho.

9. **¿Qué es el diagnóstico de la Fase I?**
   Un análisis gratuito de tu nivel de digitalización que hace un técnico de la Cámara y que termina en un plan personalizado. Es obligatorio antes de la fase de implantación.

10. **¿Cuántas ayudas hay disponibles?**
    75 para Pyme Digital. La convocatoria completa reparte 150 entre Pyme Innova (49), Pyme Digital (75), Pyme Sostenible (15) y Xpande Digital (10).

---

### 3.5 Schema JSON-LD

Pega esto en el `<head>` de la página. Son tres bloques: migas de pan, FAQ y artículo.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Inicio",
          "item": "https://www.rpidev.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Subvenciones",
          "item": "https://www.rpidev.com/subvenciones/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Pyme Digital Granada 2026",
          "item": "https://www.rpidev.com/subvenciones/pyme-digital-granada/"
        }
      ]
    },
    {
      "@type": "Article",
      "@id": "https://www.rpidev.com/subvenciones/pyme-digital-granada/#article",
      "headline": "Pyme Digital Granada 2026: ayudas de hasta 6.366,50 € para digitalizar tu negocio",
      "description": "Convocatoria 2026 de Cámara Granada y Diputación. 75 ayudas de hasta 6.366,50 € para web, comercio electrónico y marketing digital. Por orden de registro desde el 27 de julio.",
      "datePublished": "2026-07-21T09:00:00+02:00",
      "dateModified": "2026-07-21T09:00:00+02:00",
      "inLanguage": "es-ES",
      "author": {
        "@type": "Person",
        "name": "Rubén Pérez Izuel",
        "url": "https://www.rpidev.com/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "RPIdev",
        "url": "https://www.rpidev.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.rpidev.com/logo_blanco.webp"
        }
      },
      "about": {
        "@type": "Thing",
        "name": "Programa Pyme Digital, Cámara de Comercio de Granada"
      },
      "spatialCoverage": {
        "@type": "AdministrativeArea",
        "name": "Provincia de Granada",
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "Andalucía",
          "addressCountry": "ES"
        }
      },
      "mainEntityOfPage": "https://www.rpidev.com/subvenciones/pyme-digital-granada/"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.rpidev.com/subvenciones/pyme-digital-granada/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuándo abre el plazo de Pyme Digital en Granada en 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El 27 de julio de 2026 a las 09:00 h, en la sede electrónica de la Cámara de Comercio de Granada. El plazo cierra el 30 de octubre de 2026 a las 14:00 h, salvo que se agote antes el presupuesto de 624.009,51 euros."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto dinero da realmente Pyme Digital?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La base máxima financiable es de 7.490 euros: 7.000 euros de coste directo más 490 euros de costes indirectos. Se subvenciona el 85%, por lo que la ayuda máxima es de 6.366,50 euros. La cifra de 7.000 euros que suele circular corresponde al coste del proyecto, no a la ayuda."
          }
        },
        {
          "@type": "Question",
          "name": "¿Tengo que adelantar el dinero de la inversión?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. La empresa prefinancia el 100% del proyecto y recibe la ayuda del 85% después de justificarlo. No funciona como el bono del Kit Digital, que se descuenta directamente de la factura del proveedor."
          }
        },
        {
          "@type": "Question",
          "name": "¿Hay sorteo en la convocatoria de 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. A diferencia de 2025, en la edición de 2026 las ayudas se conceden por estricto orden de registro de las solicitudes, hasta agotar la cuantía de cada programa."
          }
        },
        {
          "@type": "Question",
          "name": "Mi empresa está en un pueblo de la provincia de Granada, ¿tengo menos opciones?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Al contrario. Cerca del 69% de las 150 ayudas de la convocatoria está reservado para empresas situadas fuera de Granada capital, gracias a la colaboración con la Diputación de Granada."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo pedir Pyme Digital si mi empresa está en Motril?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El municipio de Motril no forma parte de la demarcación de Cámara Granada a efectos de esta convocatoria. Conviene confirmarlo directamente con la Cámara antes de preparar la solicitud."
          }
        },
        {
          "@type": "Question",
          "name": "¿Se puede financiar una página web con Pyme Digital?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, dentro de las líneas de marketing digital y comercio electrónico, siempre que el diagnóstico previo de la Cámara lo recomiende para tu caso concreto."
          }
        },
        {
          "@type": "Question",
          "name": "¿En qué se diferencia Pyme Digital del Kit Digital?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pyme Digital lo gestiona Cámara Granada y solo aplica a la provincia, con una ayuda máxima de 6.366,50 euros que la empresa adelanta y cobra después. El Kit Digital es nacional, lo gestiona Red.es, va de 2.000 a 12.000 euros según el tamaño de la empresa y funciona como bono aplicado a la factura. A julio de 2026 el Kit Digital no tiene plazos publicados y Pyme Digital sí."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué es el diagnóstico de la Fase I?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Un análisis gratuito del nivel de digitalización de la empresa que realiza un técnico de la Cámara, y que concluye con un plan personalizado de implantación. Es obligatorio antes de acceder a la fase de ayudas."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuántas ayudas Pyme Digital hay disponibles en Granada?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "75 ayudas para el programa Pyme Digital. La convocatoria completa de 2026 reparte 150 ayudas entre Pyme Innova (49), Pyme Digital (75), Pyme Sostenible (15) y Xpande Digital (10), con un millón de euros de fondos FEDER."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## 4. Cambios en `/subvenciones/`

### 4.1 Actualizar la tabla de estado (urgente)

La fila de Pyme Digital dice "Próximamente — ~verano 2026". Sustituir por:

| PROGRAMA | ESTADO | PARA QUIÉN | |
|---|---|---|---|
| **Pyme Digital — Cámara Granada** | 🟢 **Abre 27/07/2026 — cierra 30/10/2026** | Pymes y autónomos de la provincia de Granada | [Ver guía →](/subvenciones/pyme-digital-granada/) |

Y mover esa fila **al principio de la tabla**. Es la única ayuda de la lista con convocatoria abierta, fecha concreta y competencia por orden de llegada.

Añadir también las tres hermanas, que amplían la cobertura de consultas sin esfuerzo:

| Pyme Innova — Cámara Granada | 🟢 Abre 27/07/2026 | Pymes de Granada con proyectos de innovación | |
| Pyme Sostenible — Cámara Granada | 🟢 Abre 27/07/2026 | Pymes de Granada, proyectos de sostenibilidad | |
| Xpande Digital — Cámara Granada | 🟢 Abre 27/07/2026 | Pymes de Granada que venden fuera de España | |

### 4.2 Corregir la fecha de verificación

"Última verificación: 2 julio 2026" → actualizar. Con una convocatoria abierta, esa fecha debería revisarse cada semana. Una fecha vieja en una página de subvenciones destruye la confianza del lector más que cualquier fallo técnico.

### 4.3 Aviso destacado arriba del todo

Antes de la tabla, un banner:

> **Nuevo (17 julio 2026):** Cámara Granada y la Diputación han publicado la convocatoria 2026 de ayudas para pymes de la provincia. Un millón de euros, 150 ayudas, solicitudes desde el 27 de julio y por orden de registro. [Ver qué es y si encajas →](/subvenciones/pyme-digital-granada/)

### 4.4 Revisar el bloque del Kit Digital

Dice "la apertura se considera inminente" y "a junio de 2026 Red.es aún no ha publicado los plazos" (la fecha en la FAQ dice junio, en el cuerpo julio: inconsistencia interna). Verifica el estado real hoy y unifica. Si sigue sin plazos, di eso mismo con la fecha de comprobación, y enlaza a Pyme Digital como la alternativa que sí está abierta.

---

## 5. Enlazado interno

La página nueva necesita enlaces desde el primer día. Prioridad:

| Desde | Ancla sugerida | Prioridad |
|---|---|---|
| `/subvenciones/` (banner + tabla) | Pyme Digital Granada 2026 | Alta |
| `/subvenciones/kit-digital-granada/` | alternativa abierta en Granada: Pyme Digital | Alta |
| `/subvenciones/ayudas-andalucia/` | ayudas de Cámara Granada para la provincia | Alta |
| `/` (home, bloque destacado) | Convocatoria abierta: ayudas para pymes de Granada | Media |
| `/subvenciones/leader-digitalizacion/` | si no estás en zona rural, mira Pyme Digital | Media |

Y desde la página nueva, enlaces salientes a `/portfolio` (prueba de trabajo real) y `/contact`.

**Sobre las anclas:** varía el texto. Cinco enlaces internos con el ancla exacta "pyme digital granada" es un patrón artificial. Usa formulaciones naturales distintas en cada sitio.

---

## 6. Mapa de consultas a cubrir

Basado en tus datos y en el patrón de búsqueda esperable para esta convocatoria:

**Núcleo (página nueva, prioridad máxima)**
- pyme digital granada
- pyme digital granada 2026
- ayudas cámara granada 2026
- ayudas cámara comercio granada pymes
- subvenciones digitalización granada 2026
- ayudas diputación granada empresas 2026
- convocatoria pyme digital 2026

**Intención de plazo (alta conversión, cero competencia)**
- pyme digital granada plazo
- cuándo abre pyme digital granada
- pyme digital granada cuánto dan
- pyme digital 27 de julio

**Puente desde Kit Digital (256 impresiones ya existentes)**
- kit digital granada → sección comparativa
- ayudas kit digital granada → sección comparativa
- alternativa kit digital granada
- kit digital granada 2026

**Cola larga transaccional**
- subvención página web granada
- ayudas tienda online granada
- subvención marketing digital granada
- ayudas digitalización pymes provincia granada
- proveedor pyme digital granada

**Cola larga por municipio (una línea cada uno en la sección territorial)**
Motril (caso especial), Baza, Guadix, Loja, Almuñécar, Armilla, Maracena, Santa Fe, Órgiva, Huéscar. La reserva del 69% para fuera de la capital hace que estas búsquedas tengan intención real, y no hay nadie cubriéndolas.

**Consulta que ya tienes ganada y estás desperdiciando:** `agente digitalizador granada` (4 impresiones, posición 27,75). Merece su propia sección o página en algún momento.

---

## 7. Calendario

### Antes del viernes 24 de julio (crítico)
- [ ] Publicar `/subvenciones/pyme-digital-granada/` con el contenido de la sección 3
- [ ] Actualizar la tabla y el banner de `/subvenciones/`
- [ ] Comprobar si `/subvenciones/kit-digital-granada/` está indexada
- [ ] Enviar ambas URLs a indexar desde la Inspección de URL de Search Console
- [ ] Actualizar `sitemap.xml` con `lastmod` de hoy
- [ ] Verificar que el JSON-LD valida en el Test de Resultados Enriquecidos

### Lunes 27 de julio (día de apertura)
- [ ] Cambiar el estado de la caja: de "abre el 27" a "abierta ahora mismo"
- [ ] Publicar en LinkedIn (tu voz, sin lenguaje de agencia)
- [ ] Enviar a tu lista de contactos y a los leads de Granada del CRM

### Semana del 27 de julio
- [ ] Sección territorial por municipios (la reserva del 69% da mucho juego)
- [ ] Perfil de Google Business con publicación sobre la convocatoria
- [ ] Ficha en directorios locales de Granada si aún no estás

### Agosto
- [ ] Página o sección específica para Pyme Innova (49 ayudas, otro público)
- [ ] Vídeo corto para YouTube (@rpidev) explicando la ayuda en 3 minutos
- [ ] Revisar posiciones y ajustar

### Todo el periodo
- [ ] Actualizar "última verificación" cada lunes
- [ ] Vigilar si la Cámara publica avisos de fondos agotados y reflejarlo el mismo día

---

## 8. Cómo medir si funciona

En Search Console, **filtrando siempre por España**:

| Métrica | Ahora | Objetivo a 30 días | Objetivo a 60 días |
|---|---|---|---|
| Impresiones cluster "pyme digital granada" | 0 | 150+ | 400+ |
| Posición media en ese cluster | — | <10 | <5 |
| Clics totales España | 33 / 3 meses | 40 / mes | 70 / mes |
| CTR de la página nueva | — | >6% | >8% |
| Consultas en top 10 | ~8 | 20 | 35 |

**Aviso realista:** una página nueva tarda entre 5 y 15 días en asentarse, y la convocatoria dura 95. Publicar el 24 de julio te da margen suficiente. Publicar en agosto te deja fuera del pico.

---

## 9. Cosas que no debes hacer

- **No prometas gestionar la subvención.** Tu posición actual (parte técnica sí, tramitación no) es la correcta y además es la honesta. Mantenla explícita en la página.
- **No redondees a "7.000 €".** Es la cifra que usa todo el mundo y es incorrecta. Usar la cifra exacta te diferencia y demuestra que has leído la convocatoria.
- **No inventes escasez.** No hace falta: 75 plazas por orden de registro ya es urgente de verdad. Cuenta el dato y ya está.
- **No copies texto de la Cámara.** Enlaza a la fuente y explícalo con tus palabras.
- **No dejes la fecha de verificación sin actualizar.** En páginas de convocatorias es la señal de confianza número uno.

---

## 10. Fuentes verificadas el 20 de julio de 2026

- Programa Pyme Digital, Cámara Granada — convocatoria 2026, plazos y cuantías:
  https://www.camaragranada.org/subservicio/subvenciones-y-programas/ayudas-a-empresas-pymes-y-autonomos/programa-pyme-digital
- Sede electrónica para la solicitud (trámite 2026):
  https://sede.camara.es/sede/granada/tramites/TR0000006706
- Convocatoria completa en PDF y publicación en BOP: enlazadas desde la página anterior
- Nota de prensa sobre la edición 2026 (reparto, orden de registro, reserva territorial):
  https://granadaeconomica.es/camara-granada-y-la-diputacion-lanzan-la-edicion-de-2026-de-las-ayudas-empresariales-para-impulsar-la-competitividad-de-las-pymes-de-la-provincia/
- Cobertura complementaria:
  https://www.ahoragranada.com/noticias/un-millon-de-euros-para-impulsar-la-competitividad-de-las-empresas-de-granada/

**Antes de publicar, descarga el PDF de la convocatoria y el Anexo II (tipología de gastos elegibles).** Ahí está el detalle de qué entra exactamente, y es lo que te permitirá escribir la sección de gastos con una precisión que ninguna gestoría se molesta en dar.
