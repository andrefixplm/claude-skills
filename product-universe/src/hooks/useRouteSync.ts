import { useEffect } from "react";
import { track } from "../services/analytics";
import type { ResolvedRoute } from "../services/navigation";
import { useUniverse } from "../store/universe";

/** Projeta a rota (fonte da verdade) no store e registra os eventos do funil. */
export function useRouteSync(route: ResolvedRoute) {
  const ecosystem = route.ecosystem?.id;
  const domain = route.domain?.id;
  const product = route.product?.id;
  const { level } = route;

  useEffect(() => {
    if (route.redirectTo) return;
    useUniverse.setState({
      activeEcosystem: ecosystem,
      activeDomain: domain,
      activeProduct: product,
      cameraMode: level,
      hoveredDomain: undefined,
      hoveredProduct: undefined,
    });
    const payload = { ecosystem, domain, product };
    if (level === "universe") track("universe_view");
    if (level === "ecosystem") track("ecosystem_selected", payload);
    if (level === "domain") track("domain_selected", payload);
    if (level === "product") track("product_opened", payload);
  }, [level, ecosystem, domain, product, route.redirectTo]);
}
