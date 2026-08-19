#!/usr/bin/env node
/** Scaffold a post. Publishing is still a deliberate act: this writes a draft. */
import { writeFileSync, existsSync } from "node:fs";

const title = process.argv.slice(2).join(" ");
if (!title) { console.error('usage: npm run new:post -- "Title of the post"'); process.exit(1); }
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const path = `src/content/posts/${slug}.md`;
if (existsSync(path)) { console.error(`${path} already exists`); process.exit(1); }

writeFileSync(path, `---
title: "${title}"
description: ""
pubDate: ${new Date().toISOString().slice(0, 10)}
cluster: seller
tags: []
sources: []
targetQuery: ""
draft: true
---

Open with a direct answer of 40 to 60 words. State the thing the reader came for
before any preamble, because that is the block a retrieval system lifts.

## A question the way someone actually asks it

Body. At least one table or list, and at least one original number with its
source next to it.
`);
console.log(`wrote ${path}`);
