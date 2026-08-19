/**
 * Route registry. Every routable page is declared once, here.
 * scripts/check-registry.mjs asserts this list and src/pages/*.astro match 1:1,
 * so a page can never disagree with the sitemap, llms.txt or the nav.
 */
export type SchemaType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export interface PageDef {
  path: string;            // canonical path, always with a trailing slash
  title: string;           // <title> without the brand suffix (home is special)
  description: string;     // 70 to 160 characters
  h1: string;
  schemaType: SchemaType;
  nav: boolean;            // appears in the header
  footer: boolean;
  updated: string;         // ISO date, used for sitemap lastmod
  faq?: string;            // id of a src/content/faq entry
}

export const PAGES = {
  home: {
    path: "/",
    title: "Buying one Treasure Valley business",
    description:
      "Jeff Richardson buys one established Treasure Valley business with at least $1 million in revenue. Boise based, direct, no brokers.",
    h1: "I want to buy one good business in the Treasure Valley.",
    schemaType: "WebPage",
    nav: false,
    footer: false,
    updated: "2026-08-18",
  },
  about: {
    path: "/about/",
    title: "About Jeff Richardson",
    description:
      "Jeff Richardson, Owner of Swabian Acquisition in Boise, Idaho. Kellogg MBA, analytics at ServiceLink, strategy consulting at EY.",
    h1: "About Jeff Richardson and Swabian Acquisition",
    schemaType: "AboutPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
  },
  "what-we-buy": {
    path: "/what-we-buy/",
    title: "What we buy",
    description:
      "The buy box: Ada and Canyon counties, $1 million or more in revenue, B2B and commercial services, five or more years operating.",
    h1: "What we buy, and what we do not",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
    faq: "what-we-buy",
  },
  "for-owners": {
    path: "/for-owners/",
    title: "For owners",
    description:
      "Selling your Treasure Valley business: confidentiality, timeline, your employees, the company name, and your own role after close.",
    h1: "If you are thinking about selling",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
    faq: "for-owners",
  },
  "for-advisors": {
    path: "/for-advisors/",
    title: "For advisors",
    description:
      "For CPAs, attorneys, bankers and wealth advisors in the Treasure Valley: what we buy and how to make an introduction cleanly.",
    h1: "For CPAs, attorneys, bankers and wealth advisors",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
    faq: "for-advisors",
  },
  process: {
    path: "/process/",
    title: "Process",
    description:
      "From the first call to closing: what happens at each step, how long it takes, and what you are asked for and when.",
    h1: "From the first call to closing",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
  },
  contact: {
    path: "/contact/",
    title: "Contact",
    description:
      "Reach Jeff Richardson directly by phone or email about selling your Treasure Valley business. Confidential, no obligation.",
    h1: "Get in touch",
    schemaType: "ContactPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
  },
  insights: {
    path: "/insights/",
    title: "Insights",
    description:
      "Plain writing on selling a business in the Treasure Valley: what companies sell for, how deals work, and who is buying here.",
    h1: "Insights",
    schemaType: "CollectionPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
  },
} as const satisfies Record<string, PageDef>;

export type PageKey = keyof typeof PAGES;
export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];
export const getPage = (key: PageKey): PageDef => PAGES[key];
export const navPages = () => PAGE_KEYS.filter((k) => PAGES[k].nav).map((k) => PAGES[k]);
export const footerPages = () => PAGE_KEYS.filter((k) => PAGES[k].footer).map((k) => PAGES[k]);
