# ARCHITECTURE — Product Universe

## 1. Princípio central

```
                ┌──────────────┐
                │   CONTENT    │  src/data/*.ts  (CMS no futuro)
                └──────┬───────┘
                ┌──────▼───────┐
                │ PRODUCT DATA │  src/data/catalog.ts → buildCatalog()
                └──────┬───────┘
                ┌──────▼───────┐
                │    DOMAIN    │  services/navigation.ts · store/universe.ts (URL = verdade)
                └──────┬───────┘
          ┌────────────┴────────────┐
          ▼                         ▼
     HTML / UI                  THREE.JS
   src/components             src/experience
          └────────────┬────────────┘
                       ▼
                     USER
```

Three.js não contém regra comercial: recebe a **estrutura** (ecossistemas → domínios → produtos) e o **estado**
(nível/IDs ativos) e apenas os representa.

## 2. Stack e decisões

| Camada     | Escolha                          | Observação |
| ---------- | -------------------------------- | ---------- |
| Build      | Vite                             | Next.js se SEO/SSR virar prioridade alta (ver §9) |
| UI         | React 19 + TypeScript strict     | `noUncheckedIndexedAccess`, `verbatimModuleSyntax` |
| 3D         | three + @react-three/fiber       | — |
| Estado     | Zustand                          | mínimo; ver §4 |
| Rotas      | React Router                     | deep linking |
| Estilo     | Tailwind CSS v4                  | tokens em `@theme` (styles.css) |
| Testes     | Vitest, Testing Library, Playwright | — |

### Desvios justificados em relação ao dossiê

| Dossiê                    | Implementado                               | Motivo |
| ------------------------- | ------------------------------------------ | ------ |
| GSAP para animação        | `experience/tween.ts` (≈40 linhas, easeInOutCubic) | Só precisamos interpolar vetores no loop do R3F; evita ~70 kB e uma dependência (regra 13). Retargeting a partir do valor atual garante a animação reversa. |
| @react-three/drei         | removido                                   | O único uso (`<Html>`) falhou ao renderizar o 1º rótulo da órbita no React 19; a projeção própria (`OrbitLabels`) é simples e reduz o bundle. |
| Post-processing (bloom)   | brilho Fresnel em shader (`materials.ts`)  | Custo baixo em GPUs integradas; mesmo efeito visual percebido. |
| `active*` só no store     | URL é a fonte; `useRouteSync` projeta no store | Evita duas fontes da verdade e garante deep link. |
| `activeCapability`, `comparingProducts` | não implementados              | Capacidade não é nível de rota no MVP; comparador é Fase 8. |
| Distância de câmera 6 → 3.5 | calculada por enquadramento (≈5.9 → ≈5.0 em 1440×900) | A câmera enquadra a região livre do painel; a proporção "aproxima" é mantida e testada. |

## 3. Estrutura de pastas

```
src/
├── app/            App (rotas) e ExperiencePage (composição da página)
├── components/     Header, Hero, Breadcrumb, CTA, EcosystemSelector, SidePanel,
│                   EcosystemPanel, DomainPanel, ProductPanel, LeadDialog, Fallback2D, Footer…
├── experience/     ExperienceCanvas, UniverseScene, EcosystemSphere, SphereVisuals (cad/network/industrial),
│                   Hotspot, Orbit, OrbitLabels, Particles, Connections, CameraController,
│                   layout.ts (enquadramento puro), tween.ts, config.ts, materials.ts, geometry.ts
├── data/           ecosystems, domains, capabilities, products, personas, content/site, catalog
├── hooks/          useRouteSync, useDocumentMeta, useDeviceProfile, useBreakpoint, useExperienceActions
├── services/       navigation, analytics, leads
├── store/          universe (Zustand)
├── types/          catalog
└── utils/          device (qualidade, WebGL, breakpoints)
```

> O dossiê previa `scenes/SolidworksScene` etc. Uma **cena única** (`UniverseScene`) atende todos os níveis:
> as esferas nunca são desmontadas, apenas reposicionadas — requisito de continuidade espacial do Back.

## 4. Estado

```ts
type NavigationLevel = "universe" | "ecosystem" | "domain" | "product";

interface UniverseState {
  activeEcosystem?: string; activeDomain?: string; activeProduct?: string; // escritos por useRouteSync
  cameraMode: NavigationLevel;
  hoveredEcosystem?: string; hoveredDomain?: string; hoveredProduct?: string; // destaque HTML ↔ canvas
  reducedMotion: boolean;
  deviceQuality: "low" | "medium" | "high";
  lead: { kind: "demo" | "contact" } | null;
}
```

Fluxo: `URL → resolveRoute(catalog) → useRouteSync → store → (UI + 3D)`. Slugs inválidos redirecionam para o nível
válido mais profundo.

## 5. Experiência 3D

- **Layout puro** (`layout.ts`): dado `level`, índice ativo e viewport, retorna posição/escala/destaque de cada
  esfera e a posição da câmera. A câmera nunca rotaciona; o enquadramento é por translação, reservando a área do
  painel HTML (desktop: direita; mobile: bottom sheet).
- **Motion** (`config.ts`): idle 0.03 rad/s; hover 300 ms (escala +5%, brilho +30%, rotação −40%); seleção 1.2 s
  e foco 1.0 s com easeInOutCubic; foco de domínio gira a esfera até o hotspot do domínio encarar a câmera.
- **Visual por dado**: `theme.visual` ∈ `cad | network | industrial` escolhe o componente da esfera.
- **Órbita**: produtos do domínio em anel, entrada escalonada e saída reversa; rótulos em DOM projetados por frame.
- **Acessibilidade**: canvas `aria-hidden`; toda ação tem equivalente HTML.

## 6. Performance (DOC 20)

| Meta                     | Estratégia |
| ------------------------ | ---------- |
| LCP < 2.5 s              | hero em HTML; runtime 3D em chunk lazy (`React.lazy`) — bundle inicial ≈ 94 kB gzip, 3D ≈ 249 kB gzip |
| INP < 200 ms             | interações HTML; animação fora do React (`useFrame` + refs, sem re-render) |
| CLS < 0.1                | layout fixo, canvas em `position: fixed` |
| Draw calls               | ~8 por esfera; partículas em `Points` únicos; células industriais em `InstancedMesh` |
| Qualidade adaptativa     | `QUALITY_BUDGET` low/medium/high (partículas, nós, DPR); `?quality=` para QA |

**Pendente:** medir Lighthouse ≥ 85 e Web Vitals em hardware real (ver TEST_PLAN §5).

## 7. Fallback (DOC 21)

`isWebGLAvailable()` falso, erro no canvas (ErrorBoundary) ou `webglcontextlost` ⇒ `Fallback2D` (esferas CSS).
A navegação continua idêntica porque é HTML.

## 8. Analytics

`services/analytics.ts` publica em `window.dataLayer` (GTM/Matomo/etc.), sem acoplar provedor.

| Evento               | Quando |
| -------------------- | ------ |
| `universe_view`      | rota `/` |
| `ecosystem_hover`    | 1ª vez por ecossistema na sessão |
| `ecosystem_selected` | rota de ecossistema (inclusive deep link) |
| `domain_selected`    | rota de domínio |
| `product_opened`     | rota de produto |
| `cta_demo_clicked` / `cta_contact_clicked` | clique nos CTAs |
| `lead_submitted`     | envio com sucesso |

Payload: `{ event, ecosystem, domain, product }` (IDs). `capability_selected`, `product_compared`,
`journey_*` entram com as fases correspondentes.

## 9. SEO

Por rota: `title`, `description`, `canonical`, OpenGraph, Twitter Card e JSON-LD `BreadcrumbList`
(`useDocumentMeta`). Limitação: SPA renderiza no cliente. Próximo passo recomendado: **pré-renderização estática das
rotas do catálogo** (ou migração para Next.js) para indexação plena. `SoftwareApplication`/`Product` só com dados
oficiais verificados.

## 10. Segurança

HTTPS e CSP via NGINX (`nginx.conf`); nenhum segredo no front (`VITE_*` é público); validação de cliente em
`validateLead` **e obrigatoriamente no servidor**; rate limiting, CSRF e bot protection pertencem ao backend de
leads; `npm audit` no CI.

## 11. Deploy

`GitHub → CI (install → lint → typecheck → unit → build → e2e smoke) → build estática → NGINX/CDN`. `Dockerfile`
multi-stage incluso. Branches: `main`, `develop`, `feature/*`.

## 12. Arquitetura futura

`Headless CMS (Directus/Strapi) → REST API → Website / Sales App → Product Graph → Recommendation Engine → CRM`.
A troca de fonte de dados ocorre somente em `buildCatalog()`.
