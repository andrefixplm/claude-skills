# PRODUCT TAXONOMY

> **Nomes de produtos são conteúdo, não código.** Esta taxonomia espelha `src/data/*` e deve ser revisada contra as
> fontes oficiais (hierarquia em AGENTS.md §4). Itens marcados ⚠️ estão com `verifiedAt: null`.

Portfólio validado pelo time em **2026-10** (base para esta versão):
SOLIDWORKS Design = Standard, Professional, Premium, Ultimate · SOLIDWORKS PDM = Standard, Professional ·
DELMIA = Industrial Engineering, Manufacturing & Operations, Supply Chain Planning & Optimization, Logistics & Workforce,
com as famílias Apriso, Quintiq, Ortems e 3DEXPERIENCE DELMIA.

## Níveis

`0 Ecossistema → 1 Domínio → 2 Capacidade → 3 Produto/Role → 4 Detalhe`

A taxonomia comum de domínios — **DESIGN · SIMULATION · GOVERNANCE · MANUFACTURING** — é linguagem comercial; não
implica produtos em todos os quadrantes.

## 1. SOLIDWORKS

| Domínio (slug)                   | Capacidades | Produtos |
| -------------------------------- | ----------- | -------- |
| Design (`design`)                | Modelagem 3D, Montagens, Documentação 2D | ⚠️ SOLIDWORKS Design Standard, Professional, Premium, Ultimate |
| Simulation (`simulation`)        | Structural, Motion, Flow, Plastics, Optimization, Advanced Simulation | — nomes comerciais a obter da base editorial oficial |
| Data Management (`data-management`) | Gestão de arquivos, Controle de revisões, Workflow | ⚠️ SOLIDWORKS PDM Standard, PDM Professional |
| Manufacturing (`manufacturing`)  | CAM, NC, MBD, Manufacturing Definition, Shop Floor, Technical Communication | — a curar |

Relações: Standard → Professional → Premium → Ultimate (`upgradesTo`); PDM Standard → PDM Professional;
Design ↔ PDM (`relatedProducts`). **Diferenças entre níveis não estão descritas** — pertencem ao comparador (Fase 8),
alimentado pela matriz oficial.

## 2. 3DEXPERIENCE

Mensagem: **People + Data + Process + Applications**. Camada conectiva.

| Domínio       | Capacidades | Produtos/Roles |
| ------------- | ----------- | -------------- |
| Design        | — | — |
| Simulation    | — | — |
| **Governance** (destaque) | Collaboration, Product Data, Document Management, EBOM, Configuration, Change, Release, Classification, Project, Lifecycle | — roles a definir em arquivo editorial separado |
| Manufacturing | — | — |

> Nomes de **roles** devem ficar em arquivo editorial próprio (ex.: `src/data/roles.ts` ou coleção no CMS) para que
> mudanças comerciais não exijam alterar o front-end.

## 3. DELMIA

| Domínio (slug)                                           | Capacidades | Produtos/famílias |
| -------------------------------------------------------- | ----------- | ----------------- |
| Industrial Engineering (`industrial-engineering`)        | MBOM, Process Planning (BOP/roteiros), Work Instructions, Robotics, Digital Factory | ⚠️ 3DEXPERIENCE DELMIA |
| Manufacturing & Operations (`manufacturing-operations`)  | MES/MOM, Production, Quality, Maintenance | ⚠️ DELMIA Apriso |
| Supply Chain Planning & Optimization (`supply-chain`)    | Planning, Scheduling, Optimization | ⚠️ DELMIA Quintiq, DELMIA Ortems |
| Logistics & Workforce (`logistics-workforce`)            | Logistics, Workforce | — a curar (Quintiq também atua aqui; o modelo atual permite um domínio por produto) |

Augmented Experience (citado no dossiê) **não foi incluído** até confirmação de posicionamento na oferta atual.
A relação Capability → Product é derivada de `product.capabilities` e permanece configurável.

## 4. Digital Thread (modelo conceitual)

```
IDEA → SOLIDWORKS (CAD/Design → Simulation) → 3DEXPERIENCE (EBOM → Configuration → Change → Release)
     → DELMIA (MBOM → BOP → Process Planning → MES) → PRODUCTION
```

Orienta animações e relacionamentos; hoje representado pelos arcos do universo. Visualização dedicada na Fase 6.

## 5. Checklist de curadoria

- [ ] Validar cada produto ⚠️ em solidworks.com / 3ds.com e preencher `sourceDate`, `verifiedBy`, `verifiedAt`
- [ ] Obter matriz oficial Standard × Professional × Premium × Ultimate (comparador)
- [ ] Definir nomes comerciais de Simulation e Manufacturing (SOLIDWORKS)
- [ ] Definir roles 3DEXPERIENCE (arquivo editorial separado)
- [ ] Confirmar mapeamento das famílias DELMIA por área e decidir multi-domínio
- [ ] Benefícios oficiais por produto
