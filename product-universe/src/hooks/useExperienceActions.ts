import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { catalog } from "../data/catalog";
import { track } from "../services/analytics";
import { paths } from "../services/navigation";
import { useUniverse } from "../store/universe";

const hoverTracked = new Set<string>();

/**
 * Ações compartilhadas por HTML e canvas. Recebem IDs (estrutura),
 * traduzem para rotas — a regra de navegação fica fora do Three.js.
 */
export function useExperienceActions() {
  const navigate = useNavigate();
  const setHovered = useUniverse((s) => s.setHovered);

  const selectEcosystem = useCallback(
    (ecosystemId: string) => {
      const eco = catalog.ecosystems.find((e) => e.id === ecosystemId);
      if (eco) navigate(paths.ecosystem(eco.slug));
    },
    [navigate],
  );

  const selectDomain = useCallback(
    (domainId: string) => {
      for (const eco of catalog.ecosystems) {
        const domain = eco.domains.find((d) => d.id === domainId);
        if (domain) return navigate(paths.domain(eco.slug, domain.slug));
      }
    },
    [navigate],
  );

  const selectProduct = useCallback(
    (productId: string) => {
      const product = catalog.products.find((p) => p.id === productId);
      const eco = catalog.ecosystems.find((e) => e.id === product?.ecosystem);
      const domain = eco?.domains.find((d) => d.id === product?.domain);
      if (product && eco && domain) navigate(paths.product(eco.slug, domain.slug, product.slug));
    },
    [navigate],
  );

  const hoverEcosystem = useCallback(
    (ecosystemId: string | undefined) => {
      setHovered({ hoveredEcosystem: ecosystemId });
      if (ecosystemId && !hoverTracked.has(ecosystemId)) {
        hoverTracked.add(ecosystemId);
        track("ecosystem_hover", { ecosystem: ecosystemId });
      }
    },
    [setHovered],
  );

  const hoverDomain = useCallback((domainId: string | undefined) => setHovered({ hoveredDomain: domainId }), [setHovered]);
  const hoverProduct = useCallback(
    (productId: string | undefined) => setHovered({ hoveredProduct: productId }),
    [setHovered],
  );

  return useMemo(
    () => ({ selectEcosystem, selectDomain, selectProduct, hoverEcosystem, hoverDomain, hoverProduct }),
    [selectEcosystem, selectDomain, selectProduct, hoverEcosystem, hoverDomain, hoverProduct],
  );
}
