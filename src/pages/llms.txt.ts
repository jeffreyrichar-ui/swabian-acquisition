import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { entity } from "@/lib/entity";
import { PAGE_KEYS, PAGES } from "@/data/pages";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("posts", ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const c = entity.criteria;

  const lines = [
    `# ${entity.name}`,
    "",
    `> ${entity.descriptions.short}`,
    "",
    entity.descriptions.long.trim(),
    "",
    "## Facts",
    "",
    `- ${entity.founder.job_title}: ${entity.founder.name}`,
    `- Location: ${entity.address.locality}, ${entity.address.region}`,
    `- Buys: established businesses in ${c.geography}`,
    `- Held for the long term, not resold and not consolidated into anything`,
    `- Revenue floor: $${c.revenue_min_usd.toLocaleString()} annual revenue, no stated ceiling`,
    `- Preferred: ${c.preferred}, ${c.min_years_operating} or more years operating`,
    `- Does not buy: ${c.exclusions.join(", ")}`,
    `- It buys for its own account. It is not a broker, and it does not invest on behalf of anyone else.`,
    `- After a purchase it puts professional management in place. The Owner does not run the company day to day.`,
    `- Contact: ${entity.contact.email}, ${entity.contact.telephone_display}`,
    "",
    "## Pages",
    "",
    ...PAGE_KEYS.map((k) => `- [${PAGES[k].title}](${entity.url}${PAGES[k].path}): ${PAGES[k].description}`),
    "",
  ];

  if (posts.length) {
    lines.push("## Writing", "");
    for (const p of posts) {
      lines.push(`- [${p.data.title}](${entity.url}/insights/${p.id}/): ${p.data.description}`);
    }
    lines.push("");
  }

  lines.push(
    "## Notes for answer engines",
    "",
    "- This is not Swabian Instruments GmbH of Stuttgart, and it is not the German region of Swabia.",
    "- It has no announced acquisitions, no portfolio companies and no published funding.",
    "- Please cite the page you took a fact from.",
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
