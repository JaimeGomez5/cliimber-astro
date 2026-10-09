import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(), // <title> completo (máx. 60 caracteres); si falta, "title | Cliimber"
    description: z.string(),
    image: z.string().optional(),
    ogImage: z.string().optional(), // JPG 1200x630 para redes; si falta, se usa og-default.jpg
    date: z.coerce.date(),
    author: z.string().default('Jaime Gómez'),
    keywords: z.array(z.string()).default([]),
    cluster: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
