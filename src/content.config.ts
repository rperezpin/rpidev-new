import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/proyectos' }),
  schema: z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
    shortDesc: z.string(),
    client: z.string().optional(),
    url: z.string().optional(),
    tech: z.array(z.string()),
    status: z.enum(['production', 'dev']),
    date: z.coerce.date(),
    services: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.array(z.string()).default([]),
    testimonial: z.string().optional(),
    testimonialAuthor: z.string().optional(),
  }),
});

export const collections = { proyectos };
