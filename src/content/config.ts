import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default('Jaime Gómez'),
    keywords: z.array(z.string()).default([]),
    cluster: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
