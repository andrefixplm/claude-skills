import { Link } from "react-router";
import { site } from "../data/content/site";
import { useExperienceActions } from "../hooks/useExperienceActions";
import { paths } from "../services/navigation";
import type { Ecosystem } from "../types/catalog";
import { CTA } from "./CTA";
import { SectionTitle } from "./SidePanel";

export function EcosystemPanel({ ecosystem, others }: { ecosystem: Ecosystem; others: Ecosystem[] }) {
  const { hoverDomain } = useExperienceActions();
  return (
    <>
      <p className="eyebrow">{ecosystem.tagline}</p>
      <h1 id="panel-title" className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        {ecosystem.name}
      </h1>
      <p className="mt-2 text-xl text-ink/90">{ecosystem.headline}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{ecosystem.description}</p>

      <section className="mt-7" aria-labelledby="domains-title">
        <SectionTitle>
          <span id="domains-title">{site.labels.domains}</span>
        </SectionTitle>
        <ul className="grid gap-2">
          {ecosystem.domains.map((d) => (
            <li key={d.id}>
              <Link
                to={paths.domain(ecosystem.slug, d.slug)}
                className="list-item-link"
                onMouseEnter={() => hoverDomain(d.id)}
                onMouseLeave={() => hoverDomain(undefined)}
                onFocus={() => hoverDomain(d.id)}
                onBlur={() => hoverDomain(undefined)}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium text-ink">{d.name}</span>
                  <span aria-hidden="true" className="text-muted">→</span>
                </span>
                <span className="mt-0.5 block text-sm text-muted">{d.shortDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 flex flex-wrap gap-3">
        <CTA kind="demo" />
        <CTA kind="contact" />
      </div>

      <section className="mt-8" aria-labelledby="others-title">
        <SectionTitle>
          <span id="others-title">{site.labels.otherEcosystems}</span>
        </SectionTitle>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link key={o.id} to={paths.ecosystem(o.slug)} className="chip" style={{ "--eco": o.theme.primary } as React.CSSProperties}>
              {o.name}
            </Link>
          ))}
        </div>
      </section>

      {ecosystem.officialUrl && (
        <a href={ecosystem.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-xs text-muted underline-offset-4 hover:text-ink hover:underline">
          {site.labels.officialSite} ↗
        </a>
      )}
    </>
  );
}
