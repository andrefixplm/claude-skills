import { Link } from "react-router";
import { site } from "../data/content/site";
import type { Crumb } from "../services/navigation";
import { Breadcrumb } from "./Breadcrumb";
import { CTA } from "./CTA";

export function Header({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center gap-4 border-b border-line/60 bg-bg/70 px-4 backdrop-blur-md sm:px-8">
      <Link to="/" className="flex shrink-0 items-center gap-2 rounded-sm font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="brand-mark" />
        <span className="hidden sm:inline">{site.brand}</span>
      </Link>
      {crumbs.length > 1 && (
        <div className="min-w-0 flex-1 border-l border-line pl-4">
          <Breadcrumb crumbs={crumbs} />
        </div>
      )}
      <div className={`ml-auto shrink-0 ${crumbs.length > 1 ? "hidden md:block" : ""}`}>
        <CTA kind="demo" className="btn-sm" />
      </div>
    </header>
  );
}
