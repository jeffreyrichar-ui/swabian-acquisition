/**
 * One JSON-LD @graph per page with stable @id anchors, so an AI crawler landing
 * on any single URL gets the whole entity. Types are hand-written rather than
 * pulled from schema-dts to keep the dependency surface at zero.
 */
import { entity, isResolved } from "./entity";
import type { PageDef } from "@/data/pages";

const SITE = entity.url;
export const ID = {
  org: `${SITE}/#organization`,
  person: `${SITE}/#jeffrey-richardson`,
  website: `${SITE}/#website`,
  page: (path: string) => `${SITE}${path}#webpage`,
};

type Node = Record<string, unknown>;

export function organization(): Node {
  const node: Node = {
    "@type": "Organization",
    "@id": ID.org,
    name: entity.name,
    url: SITE,
    description: entity.descriptions.short,
    email: entity.contact.email,
    telephone: entity.contact.telephone,
    founder: { "@id": ID.person },
    knowsAbout: entity.knows_about,
    sameAs: entity.same_as,
    areaServed: entity.area_served.map((a) => ({
      "@type": "Place",
      name: a.name,
      sameAs: a.same_as,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: entity.address.locality,
      addressRegion: entity.address.region,
      postalCode: entity.address.postal_code,
      addressCountry: entity.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: entity.contact.email,
      telephone: entity.contact.telephone,
      areaServed: "US-ID",
      availableLanguage: "en",
    },
    logo: { "@type": "ImageObject", url: `${SITE}/images/shield-mark-512.png` },
  };
  // Never publish an unresolved fact. The Idaho filing is pending.
  if (isResolved(entity.legal_name)) node.legalName = entity.legal_name;
  if (isResolved(entity.founding_date)) node.foundingDate = entity.founding_date;
  return node;
}

export function person(): Node {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: entity.founder.name,
    alternateName: entity.founder.alternate_name,
    jobTitle: entity.founder.job_title,
    worksFor: { "@id": ID.org },
    alumniOf: { "@type": "EducationalOrganization", name: entity.founder.alumni_of },
    knowsAbout: entity.knows_about,
    image: entity.founder.image,
    url: `${SITE}/about/`,
    sameAs: entity.founder.same_as,
  };
}

export function website(): Node {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE,
    name: entity.name,
    publisher: { "@id": ID.org },
    inLanguage: "en-US",
  };
}

export function webPage(page: PageDef): Node {
  return {
    "@type": page.schemaType,
    "@id": ID.page(page.path),
    url: `${SITE}${page.path}`,
    name: page.title,
    description: page.description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.org },
    dateModified: page.updated,
    inLanguage: "en-US",
  };
}

export function breadcrumbs(page: PageDef): Node | null {
  if (page.path === "/") return null;
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: page.title, item: SITE + page.path },
    ],
  };
}

export function faqPage(items: { question: string; answer: string }[]): Node | null {
  if (!items?.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function article(post: {
  title: string; description: string; path: string;
  pubDate: Date; updatedDate?: Date; sources?: string[];
}): Node {
  return {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${SITE}${post.path}`,
    datePublished: post.pubDate.toISOString().slice(0, 10),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString().slice(0, 10),
    author: { "@id": ID.person },
    publisher: { "@id": ID.org },
    isPartOf: { "@id": ID.website },
    inLanguage: "en-US",
    ...(post.sources?.length ? { citation: post.sources } : {}),
  };
}

export const graph = (nodes: (Node | null)[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
});
