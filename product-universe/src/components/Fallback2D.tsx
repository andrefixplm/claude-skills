import { site } from "../data/content/site";
import type { Ecosystem } from "../types/catalog";
import { CssSphere } from "./CssSphere";

/**
 * Mapa 2D quando não há WebGL. A navegação já é HTML; aqui entra apenas
 * o equivalente visual da esfera em foco e o aviso ao usuário.
 */
export function Fallback2D({ focus }: { focus?: Ecosystem }) {
  return (
    <div className="fixed inset-0 z-0 bg-bg" data-testid="fallback-2d">
      <div className="star-field absolute inset-0" aria-hidden="true" />
      {focus && (
        <div className="absolute top-16 left-0 flex h-[calc(44dvh-4rem)] w-full items-center justify-center md:h-[calc(100dvh-4rem)] md:w-[calc(100%-min(440px,42vw)-48px)]">
          <CssSphere ecosystem={focus} className="size-40 md:size-80" />
        </div>
      )}
      <p role="status" className="absolute inset-x-0 top-16 border-b border-line bg-surface/80 px-4 truncate py-1 text-center text-[11px] text-muted">
        {site.fallbackNotice}
      </p>
    </div>
  );
}
