// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import redirects from "./src/data/redirects.json" with { type: "json" };

// GitHub Pages serves /x/ with a 200 and 301s /x, but 404s /x/ when only x.html
// exists. Directory format plus an always-on trailing slash means every variant
// resolves and there is exactly one canonical form.
export default defineConfig({
  site: "https://swabian.co",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "always" },
  prefetch: false,
  redirects,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/contact/thanks/") &&
        !page.includes("/404") &&
        !Object.keys(redirects).some((old) => page.endsWith(old.slice(1) + "/")),
    }),
  ],
});
