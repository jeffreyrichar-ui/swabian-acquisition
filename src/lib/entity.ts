/**
 * The only module that reads entity.json. Everything downstream imports from
 * here, so no component ever hardcodes a phone number, email or legal name.
 */
import raw from "@/data/entity.json";

export interface AreaServed { name: string; same_as: string }

export const entity = raw as typeof raw & {
  area_served: AreaServed[];
};

export const TBD = "[[TBD]]";
export const isResolved = (value: unknown): boolean =>
  typeof value === "string" ? !value.includes(TBD) : value != null;

/** Facts that are still unresolved. A page that would state one must not ship. */
export const unresolved = (entity as any)._generated?.unresolved ?? [];

export const phoneHref = `tel:${entity.contact.telephone.replace(/[^\d+]/g, "")}`;
export const mailHref = `mailto:${entity.contact.email}`;
export const formLive = !String(entity.contact.form.endpoint).includes("REPLACE_ME");
