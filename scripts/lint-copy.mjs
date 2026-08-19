#!/usr/bin/env node
/** Voice gate over source. The ops repo linter is the source of truth; this is
 *  the copy of it that runs in CI, where the ops repo is not checked out. */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const banned = JSON.parse(readFileSync("src/data/banned-terms.json", "utf8"));
const ROOTS = ["src"];
const EXT = new Set([".astro", ".md", ".ts", ".yaml", ".yml"]);
const SKIP = new Set(["src/data/banned-terms.json"]);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

let failures = 0;
for (const file of ROOTS.flatMap(walk)) {
  if (!EXT.has(extname(file)) || SKIP.has(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const at = `${file}:${i + 1}`;
    if (line.includes("—") || line.includes("–")) {
      console.error(`${at}: em or en dash`); failures++;
    }
    if (/ -- /.test(line)) { console.error(`${at}: double hyphen`); failures++; }
    for (const term of banned.terms) {
      if (line.toLowerCase().includes(term.toLowerCase())) {
        console.error(`${at}: banned term "${term}"`); failures++;
      }
    }
    for (const term of banned.caseSensitive) {
      if (new RegExp(`\\b${term}\\b`).test(line)) {
        console.error(`${at}: banned term "${term}"`); failures++;
      }
    }
  });
}
if (failures) { console.error(`\nlint-copy failed with ${failures} problem(s)`); process.exit(1); }
console.log("lint-copy ok");
