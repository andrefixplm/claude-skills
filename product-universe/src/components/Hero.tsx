import { site } from "../data/content/site";
import { CTA } from "./CTA";

export function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section aria-labelledby="hero-title" className="pointer-events-none fixed inset-x-0 top-16 z-10 px-4 pt-6 text-center sm:pt-10">
      <div className="pointer-events-auto mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">{site.hero.eyebrow}</p>
        <h1 id="hero-title" className="mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          {site.hero.headline}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-muted sm:text-base">{site.hero.subheadline}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" className="btn btn-primary" onClick={onExplore}>
            {site.hero.primaryCta}
          </button>
          <CTA kind="contact">{site.hero.secondaryCta}</CTA>
        </div>
      </div>
    </section>
  );
}
