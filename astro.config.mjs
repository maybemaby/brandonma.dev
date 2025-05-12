import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://brandonma.dev",

  integrations: [svelte(), sitemap({})],

  vite: {
    plugins: [
      Icons({
        compiler: "astro",
        autoInstall: true,
      }),
      tailwindcss(),
    ],
  },

  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  markdown: {
    shikiConfig: {
      themes: {
        light: "rose-pine-dawn",
        dark: "github-dark",
      },
    },
  },
});
