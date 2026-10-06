import type { Catalog, Domain, Ecosystem, Product } from "../types/catalog";

export type NavigationLevel = "universe" | "ecosystem" | "domain" | "product";

export interface RouteParams {
  ecosystem?: string;
  domain?: string;
  product?: string;
}

export interface ResolvedRoute {
  level: NavigationLevel;
  ecosystem?: Ecosystem;
  domain?: Domain;
  product?: Product;
  /** Preenchido quando a URL contém um slug inválido: caminho do nível válido mais profundo. */
  redirectTo?: string;
}

export const paths = {
  universe: () => "/",
  ecosystem: (eco: string) => `/solutions/${eco}`,
  domain: (eco: string, domain: string) => `/solutions/${eco}/${domain}`,
  product: (eco: string, domain: string, product: string) =>
    `/solutions/${eco}/${domain}/${product}`,
};

/** Converte parâmetros de URL em entidades do catálogo (URL = fonte da verdade). */
export function resolveRoute(catalog: Catalog, params: RouteParams): ResolvedRoute {
  if (!params.ecosystem) return { level: "universe" };

  const ecosystem = catalog.ecosystems.find((e) => e.slug === params.ecosystem);
  if (!ecosystem) return { level: "universe", redirectTo: paths.universe() };
  if (!params.domain) return { level: "ecosystem", ecosystem };

  const domain = ecosystem.domains.find((d) => d.slug === params.domain);
  if (!domain) {
    return { level: "ecosystem", ecosystem, redirectTo: paths.ecosystem(ecosystem.slug) };
  }
  if (!params.product) return { level: "domain", ecosystem, domain };

  const product = domain.products.find((p) => p.slug === params.product);
  if (!product) {
    return {
      level: "domain",
      ecosystem,
      domain,
      redirectTo: paths.domain(ecosystem.slug, domain.slug),
    };
  }
  return { level: "product", ecosystem, domain, product };
}

export interface Crumb {
  label: string;
  to: string;
  current: boolean;
}

export function buildBreadcrumb(route: ResolvedRoute, universeLabel: string): Crumb[] {
  const crumbs: Omit<Crumb, "current">[] = [{ label: universeLabel, to: paths.universe() }];
  const { ecosystem, domain, product } = route;
  if (ecosystem) crumbs.push({ label: ecosystem.name, to: paths.ecosystem(ecosystem.slug) });
  if (ecosystem && domain) {
    crumbs.push({ label: domain.name, to: paths.domain(ecosystem.slug, domain.slug) });
  }
  if (ecosystem && domain && product) {
    crumbs.push({
      label: product.shortName,
      to: paths.product(ecosystem.slug, domain.slug, product.slug),
    });
  }
  return crumbs.map((c, i) => ({ ...c, current: i === crumbs.length - 1 }));
}

/** Caminho do nível imediatamente acima (animação reversa ao voltar). */
export function parentPath(route: ResolvedRoute): string {
  const { level, ecosystem, domain } = route;
  if (level === "product" && ecosystem && domain) return paths.domain(ecosystem.slug, domain.slug);
  if (level === "domain" && ecosystem) return paths.ecosystem(ecosystem.slug);
  return paths.universe();
}
