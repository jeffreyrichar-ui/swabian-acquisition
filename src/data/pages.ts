/**
 * Route registry. Every routable page is declared once, here.
 * scripts/check-registry.mjs asserts this list and src/pages/*.astro match 1:1,
 * so a page can never disagree with the sitemap, llms.txt or the nav.
 */
export type SchemaType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export interface PageDef {
  path: string;            // canonical path, always with a trailing slash
  title: string;           // <title> without the brand suffix (home is special)
  h1Accent?: string;       // the word or phrase set in italic copper inside the h1
  navLabel?: string;       // header link text; falls back to title. Titles carry
                           // the search terms, the nav carries the short word.
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
    title: "Buying your Boise business",
    description:
      "Jeff Richardson buys an established Boise business with at least $1 million in revenue. Boise based, direct, no brokers.",
    h1: "What happens to your company after you sell?",
    h1Accent: "your company",
    schemaType: "WebPage",
    nav: false,
    footer: false,
    updated: "2026-08-18",
  },
  about: {
    path: "/about/",
    title: "About Jeff Richardson",
    navLabel: "About",
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
    title: "What we buy in Boise",
    navLabel: "What we buy",
    description:
      "What we buy in Boise and the Treasure Valley: $1 million or more in revenue, B2B and commercial services, five or more years operating.",
    h1: "What we buy in Boise, and what we do not",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
    faq: "what-we-buy",
  },
  "for-owners": {
    path: "/for-owners/",
    title: "For Boise business owners",
    navLabel: "For owners",
    description:
      "Selling your Boise business: confidentiality, timeline, your employees, the company name, and your own role after close.",
    h1: "If you are thinking about selling your Boise business",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
    faq: "for-owners",
  },
  "for-advisors/one-page": {
    path: "/for-advisors/one-page/",
    title: "A buyer summary you can forward",
    navLabel: "One page summary",
    description:
      "One page an advisor can forward to a client unchanged: who Jeff Richardson is, what he buys in Boise, and what he can and cannot promise before seeing the business.",
    h1: "Jeff Richardson, Swabian Acquisition",
    schemaType: "WebPage",
    nav: false,
    footer: false,
    updated: "2026-08-19",
  },
  "for-advisors": {
    path: "/for-advisors/",
    title: "For advisors in Boise",
    navLabel: "For advisors",
    description:
      "For CPAs, attorneys, bankers and wealth advisors in Boise: what we buy and how to make an introduction cleanly.",
    h1: "For Boise CPAs, attorneys, bankers and wealth advisors",
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
      "Selling your Boise business, from the first call to closing: what happens at each step, how long it takes, and what you are asked for.",
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
      "Reach Jeff Richardson directly by phone or email about selling your Boise business. Confidential, no obligation.",
    h1: "Get in touch",
    schemaType: "ContactPage",
    nav: true,
    footer: true,
    updated: "2026-08-18",
  },
  "succession-index": {
    path: "/succession-index/",
    title: "Succession Index",
    description:
      "How old Boise metro businesses are, how many stop having employees each year, and how many establishments there are by trade.",
    h1: "Treasure Valley Business Succession Index",
    schemaType: "WebPage",
    nav: true,
    footer: true,
    updated: "2026-08-19",
  },
  insights: {
    path: "/insights/",
    title: "Insights",
    description:
      "Plain writing on selling a business in Boise and the Treasure Valley: what companies sell for, how deals work, and who is buying here.",
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
export const navPages = (): PageDef[] => PAGE_KEYS.filter((k) => PAGES[k].nav).map((k) => PAGES[k]);
export const footerPages = () => PAGE_KEYS.filter((k) => PAGES[k].footer).map((k) => PAGES[k]);
