import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    category: reference('categories'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    legacyUrl: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }).refine((data) => !data.cover || Boolean(data.coverAlt), {
    message: 'coverAlt is required when cover is defined',
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    portrait: z.string().optional(),
    portraitAlt: z.string().optional(),
    socials: z.object({
      website: z.url().optional(),
      instagram: z.url().optional(),
      youtube: z.url().optional(),
      bluesky: z.url().optional(),
    }).optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    order: z.number().int().nonnegative().default(100),
  }),
});

export const collections = { articles, authors, categories };
