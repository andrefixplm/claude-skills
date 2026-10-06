import type { ReactNode } from "react";
import { Link } from "react-router";
import { site } from "../data/content/site";
import type { Ecosystem } from "../types/catalog";

interface SidePanelProps {
  ecosystem: Ecosystem;
  /** Chave de transição: muda a cada nível/entidade para reanimar o conteúdo. */
  contentKey: string;
  labelledBy: string;
  children: ReactNode;
}

/** Painel lateral (desktop/tablet) ou bottom sheet (mobile). A esfera segue animada atrás. */
export function SidePanel({ ecosystem, contentKey, labelledBy, children }: SidePanelProps) {
  return (
    <aside
      aria-labelledby={labelledBy}
      className="panel fixed inset-x-0 bottom-0 z-20 flex h-[56dvh] flex-col rounded-t-3xl md:inset-x-auto md:top-[88px] md:right-6 md:bottom-6 md:h-auto md:w-[min(440px,42vw)] md:rounded-3xl"
      style={{ "--eco": ecosystem.theme.primary, "--eco-glow": ecosystem.theme.glow } as React.CSSProperties}
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <Link to="/" className="back-link">
          ← {site.backToUniverse}
        </Link>
      </div>
      <div key={contentKey} className="panel-content min-h-0 flex-1 overflow-y-auto px-6 pt-4 pb-6">
        {children}
      </div>
    </aside>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{children}</h2>;
}
