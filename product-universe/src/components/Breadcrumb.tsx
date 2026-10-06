import { Link } from "react-router";
import type { Crumb } from "../services/navigation";

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Navegação estrutural" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted">
        {crumbs.map((c, i) => (
          <li key={c.to} className="flex min-w-0 items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-faint">/</span>}
            {c.current ? (
              <span aria-current="page" className="truncate text-ink">
                {c.label}
              </span>
            ) : (
              <Link to={c.to} className="truncate rounded-sm hover:text-ink focus-visible:text-ink">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
