import { Link } from "react-router";
import { site } from "../data/content/site";
import { useExperienceActions } from "../hooks/useExperienceActions";
import { paths } from "../services/navigation";
import type { Domain, Ecosystem } from "../types/catalog";
import { CTA } from "./CTA";
import { SectionTitle } from "./SidePanel";

export function DomainPanel({ ecosystem, domain }: { ecosystem: Ecosystem; domain: Domain }) {
  const { hoverProduct } = useExperienceActions();
  return (
    <>
      <p className="eyebrow">{ecosystem.name}</p>
      <h1 id="panel-title" className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        {domain.name}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{domain.description}</p>

      <section className="mt-7" aria-labelledby="solutions-title">
        <SectionTitle>
          <span id="solutions-title">{site.labels.solutions}</span>
        </SectionTitle>
        {domain.products.length > 0 ? (
          <ul className="grid gap-2">
            {domain.products.map((p) => (
              <li key={p.id}>
                <Link
                  to={paths.product(ecosystem.slug, domain.slug, p.slug)}
                  className="list-item-link"
                  onMouseEnter={() => hoverProduct(p.id)}
                  onMouseLeave={() => hoverProduct(undefined)}
                  onFocus={() => hoverProduct(p.id)}
                  onBlur={() => hoverProduct(undefined)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-medium text-ink">{p.name}</span>
                    <span aria-hidden="true" className="text-muted">→</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{p.shortDescription}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">{site.labels.catalogPending}</p>
        )}
      </section>

      {domain.capabilities.length > 0 && (
        <section className="mt-7" aria-labelledby="caps-title">
          <SectionTitle>
            <span id="caps-title">{site.labels.capabilities}</span>
          </SectionTitle>
          <ul className="flex flex-wrap gap-2">
            {domain.capabilities.map((c) => (
              <li key={c.id} className="tag" title={c.description}>
                {c.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <CTA kind="demo" />
        <CTA kind="contact" />
      </div>
    </>
  );
}
