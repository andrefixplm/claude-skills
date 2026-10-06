import { forwardRef } from "react";
import { Link } from "react-router";
import { site } from "../data/content/site";
import { useExperienceActions } from "../hooks/useExperienceActions";
import { paths } from "../services/navigation";
import { useUniverse } from "../store/universe";
import type { Ecosystem } from "../types/catalog";
import type { Breakpoint } from "../utils/device";
import { CssSphere } from "./CssSphere";

interface EcosystemSelectorProps {
  ecosystems: Ecosystem[];
  breakpoint: Breakpoint;
  /** Fallback 2D: desenha as esferas em CSS quando o WebGL não está disponível. */
  showCssSpheres: boolean;
}

const themeVars = (eco: Ecosystem) => ({ "--eco": eco.theme.primary, "--eco-glow": eco.theme.glow }) as React.CSSProperties;

/**
 * Equivalente HTML das esferas do universo (DOC 22).
 * Desktop/tablet: cards alinhados às esferas. Mobile: seletor horizontal (DOC 19).
 */
export const EcosystemSelector = forwardRef<HTMLDivElement, EcosystemSelectorProps>(function EcosystemSelector(
  { ecosystems, breakpoint, showCssSpheres },
  ref,
) {
  const { hoverEcosystem } = useExperienceActions();
  const hovered = useUniverse((s) => s.hoveredEcosystem);

  if (breakpoint === "mobile") {
    const current = ecosystems.find((e) => e.id === hovered) ?? ecosystems[0]!;
    return (
      <div ref={ref} className="fixed inset-x-0 bottom-0 z-10 px-4 pb-6" style={themeVars(current)}>
        {showCssSpheres && <CssSphere ecosystem={current} className="mx-auto mb-6 size-48" />}
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--eco-glow)]">{current.focus}</p>
          <p className="mt-1 text-sm text-muted">{current.tagline}</p>
        </div>
        <div role="tablist" aria-label="Ecossistemas" className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {ecosystems.map((eco) => (
            <button
              key={eco.id}
              role="tab"
              type="button"
              aria-selected={eco.id === current.id}
              onClick={() => hoverEcosystem(eco.id)}
              className="chip shrink-0 aria-selected:border-[var(--eco)] aria-selected:text-ink"
              style={themeVars(eco)}
            >
              {eco.name}
            </button>
          ))}
        </div>
        <Link to={paths.ecosystem(current.slug)} className="btn btn-primary mt-4 w-full justify-center">
          {site.explore} {current.name} →
        </Link>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-10 mx-auto grid w-[calc(100%-64px)] max-w-[1200px] grid-cols-3 pb-8"
      role="list"
      aria-label="Ecossistemas"
    >
      {ecosystems.map((eco) => (
        <div role="listitem" key={eco.id} className="px-3" style={themeVars(eco)}>
          {showCssSpheres && <CssSphere ecosystem={eco} className="mx-auto mb-10 size-40 lg:size-56" />}
          <Link
            to={paths.ecosystem(eco.slug)}
            onMouseEnter={() => hoverEcosystem(eco.id)}
            onMouseLeave={() => hoverEcosystem(undefined)}
            onFocus={() => hoverEcosystem(eco.id)}
            onBlur={() => hoverEcosystem(undefined)}
            data-hovered={hovered === eco.id}
            className="eco-card group block rounded-2xl p-4 text-center"
            aria-describedby={`eco-${eco.id}-tagline`}
          >
            <span className="block text-lg font-semibold tracking-wide text-ink lg:text-xl">{eco.name}</span>
            <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--eco-glow)]">
              {eco.focus}
            </span>
            <span id={`eco-${eco.id}-tagline`} className="mt-2 block text-sm text-muted">
              {eco.tagline}
            </span>
            <span className="mt-3 inline-block text-sm text-ink opacity-70 transition group-hover:opacity-100 group-data-[hovered=true]:opacity-100">
              {site.explore} →
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
});
