import type { APIRoute } from "astro";
import { entity } from "@/lib/entity";

// Search and answer engines are explicitly welcome. The point of this site is to
// be found and quoted, so nothing is disallowed.
const AGENTS = [
  "Googlebot", "Bingbot", "Applebot", "DuckDuckBot",
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User", "Google-Extended",
];

export const GET: APIRoute = () => {
  const body = [
    ...AGENTS.map((a) => `User-agent: ${a}\nAllow: /\n`),
    "User-agent: *\nAllow: /\n",
    `Sitemap: ${entity.url}/sitemap-index.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
