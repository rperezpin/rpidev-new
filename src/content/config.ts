import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Rubén Pérez Izuel'),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const proyectos = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    type: z.string(),               // 'E-COMMERCE' | 'APP' | 'WEB' | 'SAAS' | 'CRM' | 'GESTIÓN'
    description: z.string(),
    shortDesc: z.string(),          // Used in portfolio grid (matches current ui.ts)
    client: z.string().optional(),
    url: z.string().optional(),
    tech: z.array(z.string()),
    status: z.enum(['production', 'dev']),
    date: z.coerce.date(),
    services: z.array(z.string()).default([]), // links to service slugs
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Case study fields
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.array(z.string()).default([]),
    testimonial: z.string().optional(),
    testimonialAuthor: z.string().optional(),
  }),
});

export const collections = { blog, proyectos };
