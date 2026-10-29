export const SITE_NAME = "Bournemouth Dance";

export const SITE_URL = "https://bournemouthdance.co.uk";

export const SITE_DESCRIPTION =
  "Weekly salsa, bachata, kizomba and modern jive classes across Bournemouth, Poole and Christchurch — find a class, check if it's beginner-friendly, and see what's on tonight.";

// TODO: swap in whichever address you want studios to contact — using a
// dedicated inbox (e.g. hello@bournemouthdance.co.uk) is usually better
// than a personal address once this is public.
export const CONTACT_EMAIL = "hello@bournemouthdance.co.uk";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function googleMapsUrl(venue: string, town: string): string {
  const query = new URLSearchParams({ api: "1", query: `${venue}, ${town}` });
  return `https://www.google.com/maps/search/?${query.toString()}`;
}
