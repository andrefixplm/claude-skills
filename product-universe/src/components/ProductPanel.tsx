import { Link } from "react-router";
import { site } from "../data/content/site";
import { paths } from "../services/navigation";
import type { Catalog, Domain, Ecosystem, Product } from "../types/catalog";
import { CTA } from "./CTA";
import { SectionTitle } from "./SidePanel";

interface ProductPanelProps {
  catalog: Catalog;
  ecosystem: Ecosystem;
  domain: Domain;
  product: Product;
}

/** Detalhe do produto (Nível 4). Renderiza somente o que existe nos dados. */
export function ProductPanel({ catalog, ecosystem, domain, product }: ProductPanelProps) {
  const capabilityNames = product.capabilities
    .map((id) => domain.capabilities.find((c) => c.id === id)?.name)
    .filter((n): n is string => Boolean(n));
  const personaNames = product.personas
    .map((id) => catalog.personas.find((p) => p.id === id)?.name)
    .filter((n): n is string => Boolean(n));
  const linkTo = (id: string) => {
    const p = catalog.products.find((x) => x.id === id);
    const eco = catalog.ecosystems.find((e) => e.id === p?.ecosystem);
    const d = eco?.domains.find((x) => x.id === p?.domain);
    return p && eco && d ? { product: p, to: paths.product(eco.slug, d.slug, p.slug) } : undefined;
  };
  const next = product.upgradesTo ? linkTo(product.upgradesTo) : undefined;
  const related = (product.relatedProducts ?? []).map(linkTo).filter((x) => x !== undefined);
  const pending = !product.verification.verifiedAt;

  return (
    <article aria-describedby="product-summary">
      <p className="eyebrow">
        {ecosystem.name} · {domain.name}
      </p>
      <h1 id="panel-title" className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        {product.name}
      </h1>
      <p id="product-summary" className="mt-2 text-base text-ink/90">
        {product.shortDescription}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>

      {pending && (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-white/[0.03] p-3 text-xs text-muted" role="note">
          <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
          <span>
            {site.labels.contentPending} ·{" "}
            <a href={product.verification.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
              {site.labels.source}: {product.verification.contentSource}
            </a>
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <CTA kind="demo" />
        <CTA kind="contact" />
      </div>

      {capabilityNames.length > 0 && (
        <section className="mt-7">
          <SectionTitle>{site.labels.capabilities}</SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {capabilityNames.map((n) => (
              <li key={n} className="tag">
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      {product.benefits.length > 0 && (
        <section className="mt-7">
          <SectionTitle>{site.labels.benefits}</SectionTitle>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted">
            {product.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      {personaNames.length > 0 && (
        <section className="mt-7">
          <SectionTitle>{site.labels.personas}</SectionTitle>
          <p className="text-sm text-muted">{personaNames.join(" · ")}</p>
        </section>
      )}

      {next && (
        <section className="mt-7">
          <SectionTitle>{site.labels.nextLevel}</SectionTitle>
          <Link to={next.to} className="list-item-link">
            <span className="flex items-center justify-between">
              <span className="font-medium text-ink">{next.product.name}</span>
              <span aria-hidden="true" className="text-muted">→</span>
            </span>
          </Link>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-7">
          <SectionTitle>{site.labels.related}</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.product.id} to={r.to} className="chip">
                {r.product.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
