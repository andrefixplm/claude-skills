import type { ReactNode } from "react";
import { site } from "../data/content/site";
import { track } from "../services/analytics";
import { useUniverse } from "../store/universe";

interface CTAProps {
  kind: "demo" | "contact";
  variant?: "primary" | "secondary";
  className?: string;
  children?: ReactNode;
}

/** Botão comercial: abre o formulário de lead com o contexto de navegação atual. */
export function CTA({ kind, variant = kind === "demo" ? "primary" : "secondary", className = "", children }: CTAProps) {
  const openLead = useUniverse((s) => s.openLead);
  const onClick = () => {
    const { activeEcosystem, activeDomain, activeProduct } = useUniverse.getState();
    track(kind === "demo" ? "cta_demo_clicked" : "cta_contact_clicked", {
      ecosystem: activeEcosystem,
      domain: activeDomain,
      product: activeProduct,
    });
    openLead({ kind });
  };
  return (
    <button type="button" onClick={onClick} className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}>
      {children ?? (kind === "demo" ? site.ctas.demo : site.ctas.specialist)}
    </button>
  );
}
