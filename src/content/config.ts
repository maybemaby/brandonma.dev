import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    previewText: z.string().max(240),
    draft: z.boolean().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
