import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['kitchen', 'outdoor', 'home', 'beauty']),
    date: z.coerce.date(),
    heroImage: z.string(),
    excerpt: z.string(),
    author: z.string().optional(),
    products: z.array(
      z.object({
        name: z.string(),
        rating: z.number().min(1).max(5),
        description: z.string(),
        affiliateUrl: z.string().optional(),
      })
    ),
  }),
});

export const collections = { reviews };
