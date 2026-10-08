import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getSeoPath,
  getStructuredData,
  seoPages,
  siteUrl,
} from "@/lib/seo";

const setMeta = (
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export const RouteSeo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, "") || "/";
    const isKnownPath = normalizedPath in seoPages;
    const pagePath = getSeoPath(normalizedPath);
    const page = seoPages[pagePath];
    const canonicalUrl = `${siteUrl}${pagePath === "/" ? "/" : pagePath}`;

    document.title = isKnownPath ? page.title : "Page not found | Gilevo & Co.";

    setMeta('meta[name="description"]', "name", "description", page.description);
    setMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      isKnownPath ? "index, follow, max-image-preview:large" : "noindex, follow",
    );
    setMeta('meta[property="og:title"]', "property", "og:title", page.title);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      page.description,
    );
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta(
      'meta[name="twitter:title"]',
      "name",
      "twitter:title",
      page.title,
    );
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      page.description,
    );

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (isKnownPath) {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      canonical?.remove();
    }

    const structuredData = document.getElementById("site-structured-data");
    if (structuredData) {
      structuredData.textContent = JSON.stringify(getStructuredData(pagePath));
    }
  }, [pathname]);

  return null;
};
