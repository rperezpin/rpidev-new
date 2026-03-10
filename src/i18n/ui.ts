export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    // Meta SEO
    'meta.title': 'Desarrollo Web y Automatización para Empresas en Granada | RPI Dev',
    'meta.description':
      'Consultoría digital, desarrollo web y automatización de procesos para autónomos y pymes en Granada. Webs rápidas, integraciones y ahorro de tiempo real. Diagnóstico gratuito.',

    // Nav
    'nav.sections': ['INICIO', 'PROBLEMA', 'SERVICIOS', 'PLAN', 'PORTFOLIO', 'CONTACTO'],
    'nav.logoAlt': 'RPI Dev - Desarrollo web y automatización en Granada',
    'nav.goHome': 'Ir al inicio',

    // Hero
    'hero.tagline': 'CONSULTOR DIGITAL & DEV',
    'hero.h1': 'Digitalización, Desarrollo Web y Automatización en Granada',
    'hero.heading.line1': 'Digitaliza tu negocio.',
    'hero.heading.line2': 'Gana tiempo.',
    'hero.heading.line3': 'Hazlo crecer.',
    'hero.subtitle':
      'Te ayudo a simplificar tareas y procesos para que te enfoques en lo realmente importante.',
    'hero.cta.primary': 'Diagnóstico gratuito',
    'hero.cta.secondary': 'VER CÓMO FUNCIONA',

    // Problem
    'problem.label': '/ SI ERES AUTÓNOMO O PYME',
    'problem.heading.line1': 'Deja de perder tiempo',
    'problem.heading.line2': 'con lo que se puede automatizar.',
    'problem.footer':
      'No debería ser tan complicado. La tecnología está para ayudarte.',
    'problem.painPoints': [
      { title: 'Horas perdidas en tareas manuales', desc: 'Facturas, seguimientos, recordatorios... todo lo que se podría automatizar.' },
      { title: 'Tu negocio invisible en Google', desc: 'Sin presencia digital optimizada, tus clientes potenciales llegan antes a tu competencia.' },
      { title: 'Hardware y software desconectados', desc: 'Tus herramientas no se hablan. Datos duplicados, errores y tiempo perdido.' },
      { title: 'Decisiones a ciegas', desc: 'Sin métricas ni datos en tiempo real, no sabes qué funciona ni qué está fallando.' },
    ],

    // Services
    'services.label': '/ SERVICIOS',
    'services.heading.line1': '¿Qué puedo hacer',
    'services.heading.line2': 'por ti?',
    'services.items': [
      { title: 'Visibilidad online', desc: 'Landings, webs corporativas, tiendas online y perfiles digitales con SEO local y orgánico para que te encuentren en Google antes que a tu competencia.' },
      { title: 'Automatización de procesos', desc: 'Flujos automáticos con n8n, Make y Zapier que eliminan tareas manuales, reducen errores y recuperan horas de trabajo cada semana.' },
      { title: 'Integraciones e IoT', desc: 'Conecto software, hardware e IoT en un solo sistema. Soluciones para agricultura, restauración, almacenes, industria y cualquier entorno que necesite automatización física.' },
      { title: 'Consultoría digital', desc: 'Diagnóstico de tu negocio y hoja de ruta personalizada. Te acompaño en cada fase de la transformación digital con soluciones concretas y medibles.' },
    ],

    // Plan
    'plan.label': '/ METODOLOGÍA',
    'plan.heading.line1': 'Plan sencillo',
    'plan.heading.line2': 'para empezar.',
    'plan.steps': [
      { title: 'Hablamos', desc: 'Me cuentas tu negocio y tu objetivo.' },
      { title: 'Diseñamos', desc: 'Propuesta con coste claro y plazos.' },
      { title: 'Implementamos', desc: 'Implemento, mido y mejoro.' },
    ],
    'plan.callout.title': 'Imagina tu negocio en automático',
    'plan.callout.desc':
      'Más tiempo para tus clientes. Procesos claros. Un sistema que crece contigo.',

    // Portfolio
    'portfolio.label': '/ PORTFOLIO',
    'portfolio.heading': 'Proyectos.',
    'portfolio.badge': 'RESULTADOS REALES',
    'portfolio.viewProject': 'VER PROYECTO',
    'portfolio.statusProduction': 'PRODUCCIÓN',
    'portfolio.statusDev': 'DESARROLLO',
    'portfolio.projects': [
      { name: 'Desguaces Valdeferrín', type: 'WEB', desc: 'Web con catálogo de piezas y bajas de vehículos.' },
      { name: 'Casvisol', type: 'WEB', desc: 'Web corporativa para empresa de energía solar.' },
      { name: 'Hebe Psicóloga', type: 'WEB', desc: 'Web profesional con SEO optimizado.' },
      { name: 'SEO Pilot', type: 'SAAS', desc: 'Auditoría SEO automatizada con IA.' },
      { name: 'Choose', type: 'APP', desc: 'Asistente IA para elegir tu dispositivo ideal.' },
      { name: 'RPI Dev (v1)', type: 'WEB', desc: 'Antigua web corporativa de rpidev.' },
      { name: 'CRM rpidev', type: 'CRM', desc: 'CRM con IA para gestión de leads.' },
      { name: 'BasicPlanner', type: 'GESTIÓN', desc: 'Agenda y facturación clínica.' },
      { name: 'VeriFax', type: 'SAAS', desc: 'Landing de facturación electrónica VeriFactu.' },
    ],

    // Contact
    'contact.heading': 'HABLAMOS.',
    'contact.line1': 'Cada día que no automatizas, pierdes horas.',
    'contact.line2': 'Hoy puedes empezar a recuperarlas.',
    'contact.note':
      'Cuéntame qué necesitas y qué impacto tendría en tu negocio. Respondo en 24–48h laborables.',
    'contact.channels': [
      { label: 'WhatsApp', desc: 'Respuesta rápida' },
      { label: 'Reservar cita', desc: '30 min gratis' },
      { label: 'Telegram', desc: '@rpidev' },
      { label: 'Email', desc: 'ruben@rpidev.com' },
    ],

    // Footer
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacidad',
    'footer.cookies': 'Cookies',

    // Language switcher
    'lang.switch': 'EN',
    'lang.switchLabel': 'Switch to English',
  },

  en: {
    // Meta SEO
    'meta.title': 'Web Development & Business Automation in Granada, Spain | RPI Dev',
    'meta.description':
      'Digital consulting, web development, and process automation for freelancers and SMBs in Granada, Spain. Fast websites, integrations, and real time savings. Free consultation.',

    // Nav
    'nav.sections': ['HOME', 'PROBLEM', 'SERVICES', 'PLAN', 'PORTFOLIO', 'CONTACT'],
    'nav.logoAlt': 'RPI Dev - Web development and automation in Granada',
    'nav.goHome': 'Go to home',

    // Hero
    'hero.tagline': 'DIGITAL CONSULTANT & DEV',
    'hero.h1': 'Web Development, Digitalization & Automation in Granada, Spain',
    'hero.heading.line1': 'Digitalize your business.',
    'hero.heading.line2': 'Save time.',
    'hero.heading.line3': 'Grow faster.',
    'hero.subtitle':
      'I help you simplify tasks and processes so you can focus on what really matters.',
    'hero.cta.primary': 'Free consultation',
    'hero.cta.secondary': 'SEE HOW IT WORKS',

    // Problem
    'problem.label': '/ IF YOU ARE A FREELANCER OR SMB',
    'problem.heading.line1': 'Stop wasting time',
    'problem.heading.line2': 'on what can be automated.',
    'problem.footer':
      "It shouldn't be this complicated. Technology is here to help you.",
    'problem.painPoints': [
      { title: 'Hours lost to manual work', desc: 'Invoicing, follow-ups, reminders... everything that could be automated.' },
      { title: 'Your business invisible on Google', desc: 'Without an optimized digital presence, potential clients find your competitors first.' },
      { title: 'Disconnected hardware and software', desc: 'Your tools don\'t talk to each other. Duplicated data, errors and wasted time.' },
      { title: 'Decisions made in the dark', desc: 'Without real-time metrics, you can\'t tell what\'s working and what\'s failing.' },
    ],

    // Services
    'services.label': '/ SERVICES',
    'services.heading.line1': 'What can I do',
    'services.heading.line2': 'for you?',
    'services.items': [
      { title: 'Online visibility', desc: 'Landing pages, corporate websites, online stores and digital profiles with local and organic SEO — so clients find you on Google before your competitors.' },
      { title: 'Process automation', desc: 'Automated workflows with n8n, Make and Zapier that eliminate manual tasks, reduce errors and save hours of work every week.' },
      { title: 'Integrations & IoT', desc: 'I connect software, hardware and IoT into one system. Solutions for hospitality, warehouses, industry and any environment needing physical automation.' },
      { title: 'Digital consulting', desc: 'Business diagnosis and a personalized digital roadmap. I guide you through every stage of digital transformation with concrete, measurable solutions.' },
    ],

    // Plan
    'plan.label': '/ METHODOLOGY',
    'plan.heading.line1': 'Simple plan',
    'plan.heading.line2': 'to get started.',
    'plan.steps': [
      { title: 'We talk', desc: 'Tell me about your business and your goal.' },
      { title: 'We design', desc: 'Clear proposal with costs and timelines.' },
      { title: 'We build', desc: 'I implement, measure, and improve.' },
    ],
    'plan.callout.title': 'Imagine your business on autopilot',
    'plan.callout.desc':
      'More time for your clients. Clear processes. A system that grows with you.',

    // Portfolio
    'portfolio.label': '/ PORTFOLIO',
    'portfolio.heading': 'Projects.',
    'portfolio.badge': 'REAL RESULTS',
    'portfolio.viewProject': 'VIEW PROJECT',
    'portfolio.statusProduction': 'PRODUCTION',
    'portfolio.statusDev': 'IN DEVELOPMENT',
    'portfolio.projects': [
      { name: 'Desguaces Valdeferrín', type: 'WEB', desc: 'Website with parts catalog and vehicle deregistration.' },
      { name: 'Casvisol', type: 'WEB', desc: 'Corporate website for a solar energy company.' },
      { name: 'Hebe Psicóloga', type: 'WEB', desc: 'Professional website with optimized SEO.' },
      { name: 'SEO Pilot', type: 'SAAS', desc: 'AI-powered automated SEO audit.' },
      { name: 'Choose', type: 'APP', desc: 'AI assistant to find your ideal device.' },
      { name: 'RPI Dev (v1)', type: 'WEB', desc: 'Previous version of the rpidev corporate website.' },
      { name: 'CRM rpidev', type: 'CRM', desc: 'AI-powered CRM for lead management.' },
      { name: 'BasicPlanner', type: 'MGMT', desc: 'Clinical scheduling and invoicing.' },
      { name: 'VeriFax', type: 'SAAS', desc: 'Electronic invoicing landing for VeriFactu compliance.' },
    ],

    // Contact
    'contact.heading': "LET'S TALK.",
    'contact.line1': 'Every day without automation, you lose hours.',
    'contact.line2': 'Today you can start getting them back.',
    'contact.note':
      'Tell me what you need and what impact it would have on your business. I reply within 24–48 business hours.',
    'contact.channels': [
      { label: 'WhatsApp', desc: 'Quick response' },
      { label: 'Book a call', desc: '30 min free' },
      { label: 'Telegram', desc: '@rpidev' },
      { label: 'Email', desc: 'ruben@rpidev.com' },
    ],

    // Footer
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.cookies': 'Cookies',

    // Language switcher
    'lang.switch': 'ES',
    'lang.switchLabel': 'Cambiar a Español',
  },
} as const;

export function t(lang: Lang, key: string): any {
  return (ui[lang] as Record<string, any>)[key] ?? (ui[defaultLang] as Record<string, any>)[key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function getLocalizedPath(lang: Lang, path: string = '/'): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path}`;
}
