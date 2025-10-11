import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
  const blog = await getCollection("blog", (e) => !e.data.draft);
  return rss({
    title: "Blog - Brandon Ma",
    description:
      "Blog about engineering, software, and other written thoughts.",
    site: "https://brandonma.dev",
    items: blog.map((post) => ({
      title: post.data.title,
      description: post.data.metaDescription,
      author: "Brandon Ma",
      pubDate: post.data.publishedAt,
      link: `/blog/${post.id}`,
    })),
  });
};
