# DATA MODEL

> **A UI não conhece produtos. Conhece estruturas.** Fonte: `src/types/catalog.ts`.

## 1. Registros normalizados (formato CMS)

Arquivos em `src/data/` funcionam como "tabelas": `ecosystems`, `domains`, `capabilities`, `products`, `personas`
(+ `content/site` para copy). `buildCatalog()` valida referências (lança erro em ID inexistente), oculta
`status: "hidden"` e monta a árvore aninhada consumida pela UI.

```ts
interface EcosystemRecord {
  id: string; slug: string; name: string;
  focus: string;            // rótulo curto no universo (DESIGN…)
  tagline: string; headline: string; description: string;
  theme: { primary: string; secondary: string; glow: string; visual: "cad" | "network" | "industrial" };
  domainIds: string[];      // ordem de exibição
  officialUrl?: string;
  position?: { x: number; y: number; z: number };
}

interface DomainRecord {
  id: string; ecosystemId: string; name: string; slug: string;
  shortDescription: string; description: string;
  capabilityIds: string[];
  spherePosition?: { latitude: number; longitude: number };   // hotspot na esfera
}

interface CapabilityRecord { id: string; name: string; slug: string; description: string }

interface Product {
  id: string; name: string; shortName: string; slug: string;
  ecosystem: string; domain: string; capabilities: string[];
  shortDescription: string; description: string;
  benefits: string[]; personas: string[];
  deployment?: string[]; relatedProducts?: string[]; upgradesTo?: string;
  officialUrl?: string; icon?: string;
  status: "active" | "coming-soon" | "hidden";
  verification: ContentVerification;
}

interface ContentVerification {      // DOC 32
  contentSource: string; sourceUrl: string;
  sourceDate: string | null; verifiedBy: string | null; verifiedAt: string | null;
}
```

## 2. Árvore aninhada (DOC 11)

`Ecosystem.domains: Domain[]` → `Domain.capabilities: Capability[]` (com `products: string[]` derivado) e
`Domain.products: Product[]`.

## 3. Exemplo (JSON)

```json
{
  "id": "solidworks-design-premium",
  "name": "SOLIDWORKS Design Premium",
  "shortName": "Premium",
  "slug": "premium",
  "ecosystem": "solidworks",
  "domain": "sw-design",
  "capabilities": ["3d-cad", "assemblies", "documentation"],
  "shortDescription": "Solução avançada para desenvolvimento de produtos.",
  "benefits": [],
  "personas": ["designer", "mechanical-engineer", "engineering-manager"],
  "relatedProducts": ["solidworks-pdm-standard", "solidworks-pdm-professional"],
  "upgradesTo": "solidworks-design-ultimate",
  "status": "active",
  "verification": {
    "contentSource": "SOLIDWORKS official site",
    "sourceUrl": "https://www.solidworks.com/",
    "sourceDate": null, "verifiedBy": null, "verifiedAt": null
  }
}
```

## 4. Product Graph (evolução — DOC 14)

```
Product ─belongs_to→ Ecosystem
        ─supports→ Capability
        ─integrates_with→ Product
        ─upgrades_to→ Product          (hoje: upgradesTo)
        ─recommended_with→ Product     (hoje: relatedProducts)
```

Tabela `relationship(source, relation_type, target)` quando migrar para CMS. Habilita o motor de recomendação
(`Challenge → Capability → Ecosystem → Products`) e a IA consultando o grafo (nunca decidindo livremente).

## 5. CMS (Fase 9)

Preferência: **Directus** ou **Strapi**. Coleções: `ecosystem`, `domain`, `capability`, `product`, `benefit`,
`persona`, `relationship`, `journey`. Integração: substituir os imports em `buildCatalog()` por fetch/build-time
loader, mantendo os tipos e os testes de integridade (`src/data/catalog.test.ts`).
