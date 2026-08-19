#!/usr/bin/env node
/** src/pages and src/data/pages.ts must agree exactly, and every declared FAQ
 *  must exist. A page that is not in the registry has no sitemap entry, no
 *  llms.txt line and no canonical, so this mismatch has to be fatal. */
import { readFileSync, existsSync, readdirSync } from "node:fs";

const src = readFileSync("src/data/pages.ts", "utf8");
const declared = new Set([...src.matchAll(/^\s{2}"?([a-z-]+)"?:\s*\{/gm)].map((m) => m[1]));

const files = readdirSync("src/pages", { recursive: true })
  .filter((f) => String(f).endsWith(".astro"));

const routed = new Set();
for (const f of files.map(String)) {
  if (f.startsWith("contact/") || f.includes("[") || f === "404.astro") continue;
  if (f === "index.astro") routed.add("home");
  else if (f.endsWith("/index.astro")) routed.add(f.replace("/index.astro", ""));
  else routed.add(f.replace(".astro", ""));
}

let bad = 0;
for (const key of declared) if (!routed.has(key)) { console.error(`registry declares "${key}" with no page file`); bad++; }
for (const key of routed) if (!declared.has(key)) { console.error(`page "${key}" is missing from src/data/pages.ts`); bad++; }

for (const m of src.matchAll(/faq:\s*"([a-z-]+)"/g)) {
  if (!existsSync(`src/content/faq/${m[1]}.yaml`)) {
    console.error(`registry references faq "${m[1]}" with no src/content/faq/${m[1]}.yaml`); bad++;
  }
}
if (bad) { console.error(`\ncheck-registry failed with ${bad} problem(s)`); process.exit(1); }
console.log(`check-registry ok (${declared.size} pages)`);
