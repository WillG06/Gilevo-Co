import pages from "./seo-pages.json";
import identity from "./site-identity.json";

export const siteUrl = identity.url;
export const seoPages = pages;

export type SeoPath = keyof typeof pages;

export const getSeoPath = (pathname: string): SeoPath =>
  (pathname.replace(/\/+$/, "") || "/") in pages
    ? (pathname.replace(/\/+$/, "") || "/") as SeoPath
    : "/";

export const getStructuredData = (path: SeoPath) => {
  const page = pages[path];
  const pageUrl = `${siteUrl}${path === "/" ? "/" : path}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": organizationId,
      ...identity.organization,
      name: identity.name,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/${identity.logo}`,
      image: `${siteUrl}/${identity.image}`,
      founder: {
        "@type": "Person",
        ...identity.organization.founder,
        url: `${siteUrl}${identity.organization.founder.path}`,
      },
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: identity.name,
      url: `${siteUrl}/`,
      inLanguage: "en-GB",
      publisher: { "@id": organizationId },
    },
    {
      "@type": page.type,
      "@id": `${pageUrl}#webpage`,
      name: page.title,
      description: page.description,
      url: pageUrl,
      inLanguage: "en-GB",
      isPartOf: { "@id": websiteId },
      publisher: { "@id": organizationId },
    },
  ];

  if (path === "/services") {
    graph.push({
      "@type": "Service",
      "@id": `${siteUrl}/services#services`,
      ...identity.service,
      provider: { "@id": organizationId },
      url: `${siteUrl}/services`,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
};
