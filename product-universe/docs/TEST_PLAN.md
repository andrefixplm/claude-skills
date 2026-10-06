# TEST PLAN

## 1. Pirâmide

| Camada | Ferramenta | Arquivos | Cobertura atual |
| ------ | ---------- | -------- | --------------- |
| Unit | Vitest | `src/data/catalog.test.ts`, `src/services/*.test.ts`, `src/experience/layout.test.ts` | integridade do catálogo, resolução de rotas/redirects, breadcrumb, parent path, layout de câmera/esferas, tween, validação de lead, UTM |
| Component | Testing Library | `src/app/ExperiencePage.test.tsx` | universo (equivalente HTML), deep link de produto, domínio sem produtos, redirect, formulário de lead — em jsdom (sem WebGL ⇒ fallback 2D) |
| E2E | Playwright (desktop 1440×900 + Pixel 7) | `e2e/navigation.spec.ts` | Universe → SOLIDWORKS → Design → Premium → Demo; Esc/Voltar; fallback `?webgl=0`; zero erros de console |
| Visual regression | Playwright screenshots | — | ⏳ a adicionar (ver §4) |

Futuro: recommendation engine e comparison engine (Fases 7–8) com testes unitários dedicados.

## 2. Comandos

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm run e2e                                         # baixa browsers do Playwright
CHROMIUM_PATH=/opt/pw-browsers/chromium npm run e2e  # usando Chromium pré-instalado
```

## 3. Fluxos E2E obrigatórios

1. `Universe → SOLIDWORKS → Design → Premium → Demo` ✅
2. `Universe → 3DEXPERIENCE → Governance → Capability → Product` ⏳ (quando houver roles/produtos)

## 4. Visual regression (proposta)

`expect(page).toHaveScreenshot()` em `/`, `/solutions/solidworks`, `/solutions/solidworks/design/premium` com
`?quality=low` e `prefers-reduced-motion: reduce` (cena estática e determinística — partículas usam PRNG com seed).

## 5. QA 3D (DOC 28)

| Navegadores | Hardware |
| ----------- | -------- |
| Chrome, Edge, Firefox, Safari | Intel integrada, AMD integrada, NVIDIA dedicada, Apple Silicon, Android, iPhone |

Para cada combinação: FPS em idle/transição, tempo até interativo, perda de contexto WebGL (fallback), DPR,
`?quality=low|medium|high`. Metas: LCP < 2.5 s, INP < 200 ms, CLS < 0.1, Lighthouse Performance ≥ 85.

## 6. Pipeline CI

`npm ci → lint → typecheck → unit → build → e2e smoke → deploy` (branches `main`, `develop`, `feature/*`),
mais `npm audit`/dependency scanning.

## 7. Observabilidade (DOC 29)

Sentry (ou self-hosted) para erros JS/React, erros WebGL (`webglcontextlost`, ErrorBoundary), falhas de API de lead
e degradação de performance. Ponto de integração: `ErrorBoundary.onError` e `ExperienceCanvas.onContextLost`.
