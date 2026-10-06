# AGENTS.md — Constituição para agentes de IA

> Leia este arquivo inteiro antes de alterar código. Ele prevalece sobre preferências do agente.
> Documentação de referência: [`docs/`](./docs).

## 1. O que é o projeto

**Product Universe** é uma experiência web B2B interativa (React + TypeScript + Three.js/R3F) que apresenta
SOLIDWORKS, 3DEXPERIENCE e DELMIA como três esferas exploráveis, com navegação progressiva:

```
Universe → Ecosystem → Domain → (Capability) → Product → CTA
```

A interface 3D é apenas a **camada visual** de um modelo de conhecimento estruturado (catálogo → grafo de produtos).

## 2. Princípio arquitetural central

```
CONTENT (src/data) → PRODUCT DATA (catalog.ts) → DOMAIN (services/navigation.ts, store)
                                               ├─→ HTML / UI (components/)
                                               └─→ THREE.JS   (experience/)
```

- **Three.js não possui regra comercial.** Ele só representa visualmente o estado do domínio (store/URL).
- **A URL é a fonte da verdade da navegação.** O store (`store/universe.ts`) é escrito por `useRouteSync`.
- **Todo hotspot/objeto 3D clicável possui equivalente HTML** (cards, listas do painel).

## 3. Regras invioláveis

1. **Não inventar produtos.** Nomes vêm de `src/data/products.ts` e devem ter fonte oficial.
2. **Não inventar benefícios.** `benefits: []` até haver fonte oficial; a UI oculta a seção vazia.
3. **Componentes não possuem catálogo hardcoded.** Nenhum nome de produto, domínio ou role em `components/` ou `experience/`.
4. **Conteúdo pertence à camada de dados** (`src/data/**`), inclusive copywriting (`src/data/content/site.ts`).
5. **Comparações (Standard × Professional × …) só a partir de matriz oficial** — nunca escritas em componente.
6. **Todo texto comercial carrega `verification`** (`contentSource`, `sourceUrl`, `sourceDate`, `verifiedBy`, `verifiedAt`).
   `verifiedAt: null` ⇒ a UI exibe "Conteúdo em validação".
7. **Animação não controla regra de negócio.** Tweens leem estado; nunca decidem navegação.
8. **Estado global mínimo.** Nada no store que possa ser derivado da URL ou do catálogo.
9. **WebGL deve ter fallback** (`Fallback2D`, `?webgl=0` para testar). O conteúdo nunca depende do canvas.
10. **Mobile desde o início** (`breakpointFor`: mobile < 768 ≤ tablet < 1100 ≤ desktop).
11. **Performance é medida, não presumida** (orçamentos em `experience/config.ts` → `QUALITY_BUDGET`).
12. **Não instalar dependências desnecessárias.** Justifique qualquer nova dependência no PR.
13. **TypeScript strict** (`noUncheckedIndexedAccess` incluso). Sem `any`.
14. **Back nunca apaga componentes:** toda saída é animação reversa (tweens retargetáveis).
15. **Implementar por pequenas entregas**, rodando os checks a cada mudança relevante.

## 4. Hierarquia de fontes (Source of Truth)

1. solidworks.com · 2. 3ds.com · 3. documentação oficial · 4. material comercial oficial ·
5. revenda/distribuidor autorizado · 6. conteúdo editorial interno. **Nunca blogs aleatórios.**

## 5. Brand governance

Não modificar logotipos, proporções, trademarks ou nomes oficiais. Não aplicar logo em esferas deformadas —
esfera simbólica + logo oficial adjacente, quando necessário. Cores de 3DEXPERIENCE/DELMIA são decisões de UX
provisórias até o brand guideline autorizado.

## 6. Onde mexer

| Quero…                                   | Arquivo                                        |
| ---------------------------------------- | ---------------------------------------------- |
| Adicionar/editar produto                 | `src/data/products.ts`                         |
| Adicionar domínio ou capacidade          | `src/data/domains.ts`, `src/data/capabilities.ts` |
| Alterar textos do site                   | `src/data/content/site.ts`                     |
| Ajustar motion/câmera/orçamento 3D       | `src/experience/config.ts`                     |
| Ajustar enquadramento por breakpoint     | `src/experience/layout.ts` (função pura, testada) |
| Novo evento de analytics                 | `src/services/analytics.ts`                    |
| Trocar fonte de dados por CMS            | `src/data/catalog.ts` (`buildCatalog`)         |

## 7. Checklist antes de concluir (Definition of Done)

```bash
npm run lint && npm run typecheck && npm test && npm run build
CHROMIUM_PATH=/caminho/do/chromium npm run e2e   # opcional localmente, obrigatório no CI
```

- [ ] Responsivo (desktop, tablet, mobile) — verificado visualmente
- [ ] Acessível (teclado, foco visível, equivalente HTML, `prefers-reduced-motion`)
- [ ] Testado (unit/component/e2e conforme `docs/TEST_PLAN.md`)
- [ ] Eventos de analytics no funil
- [ ] Sem erros de console nem de TypeScript
- [ ] Conteúdo com `verification` preenchido
