#!/usr/bin/env node
/** Post-build invariants, checked against the built HTML rather than the source,
 *  so drift cannot ship even if a component is edited by hand. */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const entity = JSON.parse(readFileSync("src/data/entity.json", "utf8"));
const redirects = JSON.parse(readFileSync("src/data/redirects.json", "utf8"));
const DIST = "dist";
let bad = 0;
const fail = (m) => { console.error("  " + m); bad++; };

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });

console.log("validate-dist:");

// 1. the domain marker survives every build
if (!existsSync(join(DIST, "CNAME")) || readFileSync(join(DIST, "CNAME"), "utf8").trim() !== "swabian.co")
  fail("dist/CNAME missing or not swabian.co");

// 2. required files exist
for (const f of ["robots.txt", "llms.txt", "sitemap-index.xml", "rss.xml", "404.html"])
  if (!existsSync(join(DIST, f))) fail(`dist/${f} missing`);

// 3. redirect stubs point where the map says
for (const [from, to] of Object.entries(redirects)) {
  const stub = join(DIST, from.slice(1), "index.html");
  if (!existsSync(stub)) { fail(`redirect stub for ${from} missing`); continue; }
  const html = readFileSync(stub, "utf8");
  if (!html.includes(to)) fail(`redirect stub ${from} does not point at ${to}`);
}

// 4. per page invariants
const phoneVariants = [/\(\d{3}\)\s?\d{3}[.-]?\d{4}/g, /\d{3}[.-]\d{3}[.-]\d{4}/g];
// Ownership verification files are not pages: search engines require their exact
// bytes, so they carry no title, h1, description or canonical by design.
const isVerificationFile = (f) => /\/(google[a-f0-9]{16}|BingSiteAuth)\.html$/.test(f);

for (const file of htmlFiles(DIST)) {
  if (isVerificationFile(file)) continue;
  const html = readFileSync(file, "utf8");
  const rel = file.replace(DIST, "");
  const isRedirectStub = html.includes("http-equiv=\"refresh\"");
  if (isRedirectStub) continue;

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(`${rel}: ${h1s.length} h1 elements`);

  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1] || "";
  if (title.length < 10 || title.length > 65) fail(`${rel}: title is ${title.length} chars`);

  const desc = (html.match(/<meta name="description" content="(.*?)"/s) || [])[1] || "";
  if (desc.length < 70 || desc.length > 160) fail(`${rel}: description is ${desc.length} chars`);

  if (!/rel="canonical"/.test(html)) fail(`${rel}: no canonical`);

  // entity drift: any phone shape in the built page must be the one true number.
  // Compare the last ten digits so +1 country code prefixes do not read as a mismatch.
  const last10 = (s) => s.replace(/\D/g, "").slice(-10);
  for (const re of phoneVariants) {
    for (const found of html.match(re) || []) {
      if (last10(found) !== last10(entity.contact.telephone))
        fail(`${rel}: phone ${found} does not match entity.yaml`);
    }
  }
  for (const found of html.match(/[\w.+-]+@swabian\.co/g) || []) {
    if (found !== entity.contact.email) fail(`${rel}: email ${found} does not match entity.yaml`);
  }

  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html))
    fail(`${rel}: loads Google Fonts; fonts must be self hosted`);

  if (html.includes("—") || html.includes("–")) fail(`${rel}: em or en dash in output`);

  // A legal suffix is a claim that a registered entity exists. Until
  // entity.legal_name is set from a real filing, no page may carry one.
  if (!entity.legal_name) {
    for (const suffix of ["Swabian Acquisition, Inc", "Swabian Acquisition Inc",
                          "Swabian Acquisition, LLC", "Swabian Acquisition LLC"]) {
      if (html.includes(suffix))
        fail(`${rel}: says "${suffix}" but no entity is registered (data/entity.yaml legal_name is null)`);
    }
  }
  if (html.includes("REPLACE_ME")) console.warn(`  note: ${rel} still has a REPLACE_ME placeholder`);

  // JSON-LD must parse and carry the entity
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  for (const [, raw] of blocks) {
    try {
      const parsed = JSON.parse(raw);
      const nodes = parsed["@graph"] || [parsed];
      const org = nodes.find((n) => n["@type"] === "Organization");
      if (org && org.telephone && org.telephone !== entity.contact.telephone)
        fail(`${rel}: schema telephone does not match entity.yaml`);
    } catch {
      fail(`${rel}: JSON-LD does not parse`);
    }
  }
}

// 5. the home page must carry the full entity graph
const home = readFileSync(join(DIST, "index.html"), "utf8");
for (const t of ['"@type":"Organization"', '"@type":"Person"', '"@type":"WebSite"'])
  if (!home.includes(t)) fail(`home page schema missing ${t}`);

if (bad) { console.error(`\nvalidate-dist failed with ${bad} problem(s)`); process.exit(1); }
console.log("  all invariants pass");
