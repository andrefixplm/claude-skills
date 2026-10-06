/** Eventos do funil (DOC 24). */
export type AnalyticsEvent =
  | "universe_view"
  | "ecosystem_hover"
  | "ecosystem_selected"
  | "domain_selected"
  | "capability_selected"
  | "product_opened"
  | "cta_demo_clicked"
  | "cta_contact_clicked"
  | "lead_submitted";

export interface AnalyticsPayload {
  ecosystem?: string;
  domain?: string;
  product?: string;
  [key: string]: string | undefined;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Adaptador neutro: publica no `dataLayer` (GTM/Matomo/etc.) se existir.
 * Nenhum provedor é acoplado ao código.
 */
export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  const entry = { event, ...payload };
  window.dataLayer?.push(entry);
  if (import.meta.env.DEV) console.debug("[analytics]", entry);
}
