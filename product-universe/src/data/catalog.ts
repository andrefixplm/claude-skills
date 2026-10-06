import type { Catalog, Domain, Ecosystem } from "../types/catalog";
import { capabilities } from "./capabilities";
import { domains } from "./domains";
import { ecosystems } from "./ecosystems";
import { personas } from "./personas";
import { products } from "./products";

export interface CatalogSource {
  ecosystems: typeof ecosystems;
  domains: typeof domains;
  capabilities: typeof capabilities;
  products: typeof products;
  personas: typeof personas;
}

/**
 * Monta a árvore aninhada (DOC 11) a partir dos registros normalizados.
 * Este é o único ponto a trocar quando o conteúdo vier de um CMS headless.
 * Produtos com status "hidden" não são expostos.
 */
export function buildCatalog(source: CatalogSource): Catalog {
  const visibleProducts = source.products.filter((p) => p.status !== "hidden");
  const capabilityById = new Map(source.capabilities.map((c) => [c.id, c]));
  const domainById = new Map(source.domains.map((d) => [d.id, d]));

  const tree: Ecosystem[] = source.ecosystems.map(({ domainIds, ...eco }) => ({
    ...eco,
    domains: domainIds.map((domainId): Domain => {
      const record = domainById.get(domainId);
      if (!record) throw new Error(`Domínio inexistente: ${domainId} (ecossistema ${eco.id})`);
      const { capabilityIds, ...domain } = record;
      const domainProducts = visibleProducts.filter((p) => p.domain === domainId);
      return {
        ...domain,
        capabilities: capabilityIds.map((capId) => {
          const cap = capabilityById.get(capId);
          if (!cap) throw new Error(`Capacidade inexistente: ${capId} (domínio ${domainId})`);
          return {
            ...cap,
            products: domainProducts.filter((p) => p.capabilities.includes(capId)).map((p) => p.id),
          };
        }),
        products: domainProducts,
      };
    }),
  }));

  return { ecosystems: tree, products: visibleProducts, personas: source.personas };
}

export const catalog: Catalog = buildCatalog({
  ecosystems,
  domains,
  capabilities,
  products,
  personas,
});
