import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "../data/content/site";
import { track } from "../services/analytics";
import { readUtm, submitLead, validateLead, type LeadErrors, type LeadForm } from "../services/leads";
import { useUniverse } from "../store/universe";

const EMPTY: LeadForm = { name: "", company: "", email: "", phone: "", interest: "" };

type Status = "idle" | "sending" | "success" | "error";

/** Formulário mínimo de lead (DOC 25). O contexto de navegação é anexado automaticamente. */
export function LeadDialog() {
  const lead = useUniverse((s) => s.lead);
  const closeLead = useUniverse((s) => s.closeLead);
  const [form, setForm] = useState<LeadForm>(EMPTY);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const dialog = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const id = useId();

  useEffect(() => {
    if (!lead) return;
    returnFocus.current = document.activeElement;
    setStatus("idle");
    setErrors({});
    dialog.current?.querySelector<HTMLElement>("input, button")?.focus();
    return () => (returnFocus.current as HTMLElement | null)?.focus?.();
  }, [lead]);

  if (!lead) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeLead();
    if (e.key !== "Tab" || !dialog.current) return;
    const focusables = dialog.current.querySelectorAll<HTMLElement>("input, select, button, a[href]");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateLead(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const { activeEcosystem, activeDomain, activeProduct } = useUniverse.getState();
    setStatus("sending");
    try {
      await submitLead(form, {
        kind: lead.kind,
        ecosystem: activeEcosystem,
        domain: activeDomain,
        product: activeProduct,
        source_url: window.location.href,
        utm: readUtm(window.location.search),
      });
      track("lead_submitted", { ecosystem: activeEcosystem, domain: activeDomain, product: activeProduct, kind: lead.kind });
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof LeadForm, type = "text", autoComplete?: string) => (
    <div>
      <label htmlFor={`${id}-${key}`} className="mb-1 block text-xs text-muted">
        {site.lead.fields[key]}
      </label>
      <input
        id={`${id}-${key}`}
        type={type}
        autoComplete={autoComplete}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${id}-${key}-error` : undefined}
        className="input"
        maxLength={160}
      />
      {errors[key] && (
        <p id={`${id}-${key}-error`} className="mt-1 text-xs text-red-300">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const title = lead.kind === "demo" ? site.lead.title : site.lead.contactTitle;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center" onClick={closeLead}>
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="panel max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6 sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={`${id}-title`} className="text-xl font-semibold text-ink">
            {title}
          </h2>
          <button type="button" onClick={closeLead} className="rounded-full px-2 text-muted hover:text-ink" aria-label={site.lead.close}>
            ✕
          </button>
        </div>
        <p id={`${id}-desc`} className="mt-1 text-sm text-muted">
          {site.lead.description}
        </p>

        {status === "success" ? (
          <div className="mt-6">
            <p role="status" className="text-sm text-ink">
              {site.lead.success}
            </p>
            <button type="button" className="btn btn-secondary mt-6" onClick={closeLead}>
              {site.lead.close}
            </button>
          </div>
        ) : (
          <form className="mt-5 grid gap-3" onSubmit={onSubmit} noValidate>
            {field("name", "text", "name")}
            {field("company", "text", "organization")}
            {field("email", "email", "email")}
            {field("phone", "tel", "tel")}
            <div>
              <label htmlFor={`${id}-interest`} className="mb-1 block text-xs text-muted">
                {site.lead.fields.interest}
              </label>
              <select
                id={`${id}-interest`}
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                aria-invalid={Boolean(errors.interest)}
                aria-describedby={errors.interest ? `${id}-interest-error` : undefined}
                className="input"
              >
                <option value="" />
                {site.lead.interests.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              {errors.interest && (
                <p id={`${id}-interest-error`} className="mt-1 text-xs text-red-300">
                  {errors.interest}
                </p>
              )}
            </div>
            {status === "error" && (
              <p role="alert" className="text-sm text-red-300">
                {site.lead.error}
              </p>
            )}
            <button type="submit" className="btn btn-primary mt-2 justify-center" disabled={status === "sending"}>
              {status === "sending" ? site.lead.sending : site.lead.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
