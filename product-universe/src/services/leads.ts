export interface LeadForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  interest: string;
}

/** Contexto automático enviado com o lead (DOC 25). */
export interface LeadContext {
  kind: "demo" | "contact";
  ecosystem?: string;
  domain?: string;
  product?: string;
  source_url: string;
  utm: Record<string, string>;
}

export type LeadErrors = Partial<Record<keyof LeadForm, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+()\d\s-]{8,20}$/;

/** Validação de cliente. A validação definitiva DEVE ser repetida no servidor (DOC 26). */
export function validateLead(form: LeadForm): LeadErrors {
  const errors: LeadErrors = {};
  if (form.name.trim().length < 2) errors.name = "Informe seu nome.";
  if (form.company.trim().length < 2) errors.company = "Informe a empresa.";
  if (!EMAIL.test(form.email.trim())) errors.email = "Informe um e-mail válido.";
  if (form.phone.trim() && !PHONE.test(form.phone.trim())) errors.phone = "Telefone inválido.";
  if (!form.interest) errors.interest = "Selecione uma área.";
  return errors;
}

export function readUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.startsWith("utm_")) utm[key] = value.slice(0, 200);
  });
  return utm;
}

/**
 * Envia o lead para `VITE_LEAD_ENDPOINT` (backend próprio / CRM).
 * Sem endpoint configurado, apenas o modo de desenvolvimento simula sucesso.
 */
export async function submitLead(form: LeadForm, context: LeadContext): Promise<void> {
  const endpoint = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined;
  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.info("[lead] VITE_LEAD_ENDPOINT ausente — envio simulado", { form, context });
      return;
    }
    throw new Error("Lead endpoint não configurado");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form, context }),
  });
  if (!response.ok) throw new Error(`Lead endpoint respondeu ${response.status}`);
}
