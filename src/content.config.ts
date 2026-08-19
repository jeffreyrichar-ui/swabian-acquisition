import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().min(10).max(80),
    description: z.string().min(70).max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cluster: z.enum(["seller", "advisor", "valuation", "local-proof", "city"]),
    tags: z.array(z.string()).max(5).default([]),
    sources: z.array(z.string().url()).default([]),
    targetQuery: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/faq" }),
  schema: z.object({
    items: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
  }),
});

export const collections = { posts, faq };
