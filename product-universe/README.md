# Product Universe

**SOLIDWORKS · 3DEXPERIENCE · DELMIA** — landing page / product explorer 3D que transforma um portfólio complexo
em um mapa interativo do *Digital Thread*.

```
Universe → SOLIDWORKS → Design → Premium → Solicitar demonstração
```

| Nível       | URL                                        |
| ----------- | ------------------------------------------ |
| Universo    | `/`                                        |
| Ecossistema | `/solutions/solidworks`                    |
| Domínio     | `/solutions/solidworks/design`             |
| Produto     | `/solutions/solidworks/design/premium`     |

## Stack

React 19 · TypeScript (strict) · Vite · three + @react-three/fiber · Zustand · React Router · Tailwind CSS v4 ·
Vitest + Testing Library · Playwright.

## Começando

```bash
npm install
npm run dev          # http://localhost:5173
```

| Script              | Descrição                                        |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | servidor de desenvolvimento                      |
| `npm run lint`      | ESLint                                           |
| `npm run typecheck` | TypeScript sem emissão                           |
| `npm test`          | testes unitários e de componentes (Vitest)       |
| `npm run build`     | build de produção em `dist/`                     |
| `npm run e2e`       | E2E Playwright (desktop + mobile)                |

Parâmetros de QA na URL: `?webgl=0` força o mapa 2D de fallback; `?quality=low|medium|high` força o nível 3D.

### Variáveis de ambiente

Copie `.env.example` para `.env.local`. `VITE_LEAD_ENDPOINT` recebe o POST do formulário de lead. Sem endpoint,
o modo dev simula o envio e a produção exibe erro (nunca coloque segredos em `VITE_*`).

### Deploy

Build estática servida por NGINX (`nginx.conf` faz o fallback de deep links e define headers de segurança/CSP):

```bash
docker build -t product-universe --build-arg VITE_LEAD_ENDPOINT=https://api.exemplo.com/leads .
docker run -p 8080:80 product-universe
```

## Documentação

| Documento                                          | Conteúdo                                         |
| -------------------------------------------------- | ------------------------------------------------ |
| [AGENTS.md](./AGENTS.md)                           | constituição para agentes de IA (leia primeiro) |
| [docs/PRD.md](./docs/PRD.md)                       | visão, personas, objetivos, KPIs, MVP            |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)     | camadas, pastas, estado, 3D, performance, SEO    |
| [docs/UX_SPEC.md](./docs/UX_SPEC.md)               | fluxos, motion, navegação, responsividade, a11y  |
| [docs/PRODUCT_TAXONOMY.md](./docs/PRODUCT_TAXONOMY.md) | ecossistemas, domínios, capacidades, produtos |
| [docs/DATA_MODEL.md](./docs/DATA_MODEL.md)         | tipos, registros normalizados, grafo, CMS        |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)   | cores, tipografia, componentes, esferas          |
| [docs/ROADMAP.md](./docs/ROADMAP.md)               | fases 0–10 e status                              |
| [docs/TEST_PLAN.md](./docs/TEST_PLAN.md)           | estratégia de testes, QA 3D, CI                  |

## Aviso de marcas

SOLIDWORKS, 3DEXPERIENCE e DELMIA são marcas comerciais ou registradas da Dassault Systèmes ou de suas subsidiárias.
O conteúdo de produto deste repositório está marcado como **pendente de validação** até verificação nas fontes oficiais.
