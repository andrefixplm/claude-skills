import { useEffect } from "react";
import { site } from "../data/content/site";
import { buildBreadcrumb, type ResolvedRoute } from "../services/navigation";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/** Metadados por rota (DOC 23): title, description, canonical, OpenGraph, Twitter e BreadcrumbList. */
export function useDocumentMeta(route: ResolvedRoute) {
  useEffect(() => {
    if (route.redirectTo) return;
    const { ecosystem, domain, product } = route;
    const parts = [product?.name, domain && !product ? domain.name : undefined, ecosystem && !domain ? ecosystem.name : undefined];
    const name = parts.find(Boolean);
    const title = name ? `${name}${ecosystem && name !== ecosystem.name ? ` · ${ecosystem.name}` : ""} | ${site.brand}` : `${site.brand} — ${site.hero.headline}`;
    const description = product?.shortDescription ?? domain?.description ?? ecosystem?.description ?? site.hero.subheadline;
    const url = `${window.location.origin}${window.location.pathname}`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const crumbs = buildBreadcrumb(route, site.universeLabel);
    let ld = document.getElementById("ld-breadcrumb");
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "ld-breadcrumb";
      ld.setAttribute("type", "application/ld+json");
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: `${window.location.origin}${c.to}`,
      })),
    });
  }, [route]);
}
