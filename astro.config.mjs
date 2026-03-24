import { defineConfig, envField } from "astro/config";
import svelte from "@astrojs/svelte";
import Icons from "unplugin-icons/vite";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://brandonma.dev",

  integrations: [svelte(), sitemap({}), mdx()],

  vite: {
    plugins: [
      Icons({
        compiler: "astro",
        autoInstall: true,
      }),
      tailwindcss(),
    ],
  },
	env: {
		schema: {
			CONTACT_API: envField.string({context: "server", access: "secret"}),
			CONTACT_API_KEY: envField.string({context: "server", access: "secret"}) 
		}},
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
