import type { Ecosystem } from "../types/catalog";

/** Esfera em CSS para o mapa 2D de fallback (sem WebGL). */
export function CssSphere({ ecosystem, className = "" }: { ecosystem: Ecosystem; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`css-sphere rounded-full ${className}`}
      style={{ "--eco": ecosystem.theme.primary, "--eco-dark": ecosystem.theme.secondary, "--eco-glow": ecosystem.theme.glow } as React.CSSProperties}
    />
  );
}
