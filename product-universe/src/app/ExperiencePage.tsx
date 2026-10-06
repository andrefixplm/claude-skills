import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { DomainPanel } from "../components/DomainPanel";
import { EcosystemPanel } from "../components/EcosystemPanel";
import { EcosystemSelector } from "../components/EcosystemSelector";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Fallback2D } from "../components/Fallback2D";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { LeadDialog } from "../components/LeadDialog";
import { ProductPanel } from "../components/ProductPanel";
import { SidePanel } from "../components/SidePanel";
import { catalog } from "../data/catalog";
import { site } from "../data/content/site";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { useDeviceProfile } from "../hooks/useDeviceProfile";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useRouteSync } from "../hooks/useRouteSync";
import { buildBreadcrumb, parentPath, resolveRoute } from "../services/navigation";
import { useUniverse } from "../store/universe";
import { isWebGLAvailable } from "../utils/device";

// O runtime 3D é carregado depois do HTML (LCP = hero em texto).
const ExperienceCanvas = lazy(() => import("../experience/ExperienceCanvas"));

export function ExperiencePage() {
  const params = useParams();
  const navigate = useNavigate();
  const route = useMemo(
    () => resolveRoute(catalog, { ecosystem: params.ecosystem, domain: params.domain, product: params.product }),
    [params.ecosystem, params.domain, params.product],
  );
  const crumbs = useMemo(() => buildBreadcrumb(route, site.universeLabel), [route]);
  const breakpoint = useBreakpoint();
  const [webgl, setWebgl] = useState(() => isWebGLAvailable());
  const disableWebgl = useCallback(() => setWebgl(false), []);
  const selectorRef = useRef<HTMLDivElement>(null);
  const leadOpen = useUniverse((s) => Boolean(s.lead));

  useDeviceProfile();
  useRouteSync(route);
  useDocumentMeta(route);

  // Esc sobe um nível (animação reversa), exceto com o formulário aberto.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !leadOpen && route.level !== "universe") navigate(parentPath(route));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [leadOpen, navigate, route]);

  if (route.redirectTo) return <Navigate to={route.redirectTo} replace />;

  const { ecosystem, domain, product } = route;
  const fallback = <Fallback2D focus={route.level === "universe" ? undefined : ecosystem} />;

  return (
    <>
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header crumbs={crumbs} />
      {webgl ? (
        <ErrorBoundary fallback={fallback} onError={disableWebgl}>
          <Suspense fallback={<div className="fixed inset-0 z-0 bg-bg" />}>
            <ExperienceCanvas ecosystems={catalog.ecosystems} onContextLost={disableWebgl} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        fallback
      )}

      <main id="main">
        {route.level === "universe" && (
          <>
            <Hero onExplore={() => selectorRef.current?.querySelector<HTMLElement>("a, button")?.focus()} />
            <EcosystemSelector ref={selectorRef} ecosystems={catalog.ecosystems} breakpoint={breakpoint} showCssSpheres={!webgl} />
            <Footer />
          </>
        )}

        {ecosystem && route.level !== "universe" && (
          <SidePanel ecosystem={ecosystem} contentKey={`${route.level}:${product?.id ?? domain?.id ?? ecosystem.id}`} labelledBy="panel-title">
            {route.level === "ecosystem" && (
              <EcosystemPanel ecosystem={ecosystem} others={catalog.ecosystems.filter((e) => e.id !== ecosystem.id)} />
            )}
            {route.level === "domain" && domain && <DomainPanel ecosystem={ecosystem} domain={domain} />}
            {route.level === "product" && domain && product && (
              <ProductPanel catalog={catalog} ecosystem={ecosystem} domain={domain} product={product} />
            )}
          </SidePanel>
        )}
      </main>
      <LeadDialog />
    </>
  );
}
