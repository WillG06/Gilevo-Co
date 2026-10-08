import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = path.join(projectRoot, "dist");
const pages = JSON.parse(
  await readFile(
    path.join(projectRoot, "src", "lib", "seo-pages.json"),
    "utf8",
  ),
);
const identity = JSON.parse(
  await readFile(
    path.join(projectRoot, "src", "lib", "site-identity.json"),
    "utf8",
  ),
);
const siteUrl = identity.url;

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const getStructuredData = (route, page) => {
  const pageUrl = `${siteUrl}${route === "/" ? "/" : route}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const graph = [
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

  if (route === "/services") {
    graph.push({
      "@type": "Service",
      "@id": `${siteUrl}/services#services`,
      ...identity.service,
      provider: { "@id": organizationId },
      url: `${siteUrl}/services`,
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
};

const setMeta = (html, attribute, key, content) => {
  const escapedContent = escapeHtml(content);
  const existing = new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/?>`,
    "i",
  );
  const element = `<meta ${attribute}="${key}" content="${escapedContent}" />`;
  return existing.test(html)
    ? html.replace(existing, element)
    : html.replace("</head>", `  ${element}\n</head>`);
};

const createFallbackContent = (route, page) => {
  const highlights = page.highlights
    .map((highlight) => `        <li>${escapeHtml(highlight)}</li>`)
    .join("\n");

  return `  <div id="root">
    <main class="seo-fallback">
      <p class="seo-fallback__eyebrow">Gilevo &amp; Co. · Birmingham web design &amp; development</p>
      <h1>${escapeHtml(page.heading)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      <ul>
${highlights}
      </ul>
      <p><a href="/contact">Discuss your website project</a></p>
      <nav aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/services">Web design services</a>
        <a href="/work">Website portfolio</a>
        <a href="/about">About the studio</a>
        <a href="/pricing">Website pricing</a>
        <a href="/contact">Contact</a>
      </nav>
    </main>
  </div>`;
};

let template = await readFile(path.join(outputDirectory, "index.html"), "utf8");

for (const [route, page] of Object.entries(pages)) {
  const canonicalUrl = `${siteUrl}${route === "/" ? "/" : route}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(
    html,
    "name",
    "robots",
    "index, follow, max-image-preview:large",
  );
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", canonicalUrl);
  html = setMeta(html, "property", "og:type", "website");
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = html.replace(
    /<script id="site-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="site-structured-data" type="application/ld+json">${getStructuredData(route, page)}</script>`,
  );
  html = html.replace(
    /<div id="root"><\/div>/,
    createFallbackContent(route, page),
  );

  const routeDirectory =
    route === "/" ? outputDirectory : path.join(outputDirectory, route.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), html);
}

const sitemapUrls = Object.keys(pages)
  .map((route) => {
    const url = `${siteUrl}${route === "/" ? "/" : route}`;
    return `  <url><loc>${url}</loc></url>`;
  })
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
await writeFile(path.join(outputDirectory, "sitemap.xml"), sitemap);
await copyFile(
  path.join(projectRoot, "src", "assets", "gc-logo.png"),
  path.join(outputDirectory, identity.logo),
);

console.log(`Generated ${Object.keys(pages).length} route-specific SEO pages and sitemap.xml`);
