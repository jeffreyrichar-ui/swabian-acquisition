# swabian.co

Static site for Swabian Acquisition, Inc. (Boise, Idaho). Astro, no client
framework, deployed to GitHub Pages by `.github/workflows/deploy.yml`.

```bash
npm install
npm run dev      # local
npm run ci       # gates + build + output validation, same as CI
```

## Rules

- Entity facts (name, phone, email, address, criteria, profiles) live in the
  private ops repo at `data/entity.yaml` and arrive here as
  `src/data/entity.json` via `make sync-entity`. Never edit that file, and never
  type a phone number or email into a component.
- Every routable page is declared in `src/data/pages.ts`. `check-registry`
  fails the build if the registry and `src/pages` disagree.
- No em dashes, no en dashes, no search fund vocabulary. `lint-copy` fails the
  build.
- `validate-dist` checks the built HTML: one h1 per page, title and description
  lengths, canonical present, JSON-LD parses, redirect stubs point where the map
  says, no Google Fonts request, and no entity drift.
- Adding a post is one file in `src/content/posts/` and one commit. The index,
  sitemap, RSS, llms.txt and Article schema all follow from it.
