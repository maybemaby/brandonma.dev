import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    previewText: z.string().max(240),
    draft: z.boolean().optional(),
    metaDescription: z.string().optional(),
  }),
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
});

export const collections = {
  blog: blogCollection,
};
