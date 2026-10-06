import type { ContentVerification, Product } from "../types/catalog";

/**
 * Produtos / famílias (Nível 3). CONTEÚDO, não código.
 *
 * Regras (AGENTS.md):
 * - Não inventar produtos nem benefícios. `benefits` fica vazio até existir fonte oficial.
 * - Todo texto comercial carrega `verification`. `verifiedAt: null` = pendente,
 *   e a UI sinaliza "conteúdo em validação".
 * - Diferenças entre níveis (Standard → Ultimate) pertencem ao comparador e devem
 *   vir de matriz oficial — não são descritas aqui.
 */
const pending = (contentSource: string, sourceUrl: string): ContentVerification => ({
  contentSource,
  sourceUrl,
  sourceDate: null,
  verifiedBy: null,
  verifiedAt: null,
});

const SW = pending("SOLIDWORKS official site", "https://www.solidworks.com/");
const DELMIA = pending("3DS official site — DELMIA", "https://www.3ds.com/products/delmia");

const swDesign = (
  tier: string,
  slug: string,
  shortDescription: string,
  upgradesTo?: string,
): Product => ({
  id: `solidworks-design-${slug}`,
  name: `SOLIDWORKS Design ${tier}`,
  shortName: tier,
  slug,
  ecosystem: "solidworks",
  domain: "sw-design",
  capabilities: ["3d-cad", "assemblies", "documentation"],
  shortDescription,
  description: `${shortDescription} Faz parte da matriz SOLIDWORKS Design (Standard, Professional, Premium e Ultimate); a composição exata de cada nível deve ser consultada na matriz oficial.`,
  benefits: [],
  personas: ["designer", "mechanical-engineer", "engineering-manager"],
  relatedProducts: ["solidworks-pdm-standard", "solidworks-pdm-professional"],
  upgradesTo,
  status: "active",
  verification: SW,
});

export const products: Product[] = [
  swDesign(
    "Standard",
    "standard",
    "Nível de entrada da linha SOLIDWORKS Design para modelagem 3D, montagens e documentação 2D.",
    "solidworks-design-professional",
  ),
  swDesign(
    "Professional",
    "professional",
    "Nível que amplia o Standard com recursos adicionais de produtividade para engenharia.",
    "solidworks-design-premium",
  ),
  swDesign(
    "Premium",
    "premium",
    "Solução avançada para desenvolvimento de produtos.",
    "solidworks-design-ultimate",
  ),
  swDesign("Ultimate", "ultimate", "Nível mais completo da matriz atual do SOLIDWORKS Design."),

  {
    id: "solidworks-pdm-standard",
    name: "SOLIDWORKS PDM Standard",
    shortName: "PDM Standard",
    slug: "pdm-standard",
    ecosystem: "solidworks",
    domain: "sw-data-management",
    capabilities: ["file-management", "revision-control", "workflow"],
    shortDescription: "Gestão de dados de projeto SOLIDWORKS: arquivos, versões e revisões.",
    description:
      "Gestão de dados de projeto para equipes de engenharia: cofre de arquivos, controle de versões e revisões e fluxos de aprovação.",
    benefits: [],
    personas: ["engineering-manager", "designer"],
    relatedProducts: ["solidworks-design-professional", "solidworks-design-premium"],
    upgradesTo: "solidworks-pdm-professional",
    status: "active",
    verification: SW,
  },
  {
    id: "solidworks-pdm-professional",
    name: "SOLIDWORKS PDM Professional",
    shortName: "PDM Professional",
    slug: "pdm-professional",
    ecosystem: "solidworks",
    domain: "sw-data-management",
    capabilities: ["file-management", "revision-control", "workflow"],
    shortDescription: "Gestão de dados de produto para equipes maiores e processos mais amplos.",
    description:
      "Nível superior do SOLIDWORKS PDM, voltado a equipes maiores e processos de engenharia mais amplos.",
    benefits: [],
    personas: ["engineering-manager"],
    relatedProducts: ["solidworks-design-premium"],
    status: "active",
    verification: SW,
  },

  {
    id: "delmia-3dexperience",
    name: "3DEXPERIENCE DELMIA",
    shortName: "3DEXPERIENCE DELMIA",
    slug: "3dexperience-delmia",
    ecosystem: "delmia",
    domain: "delmia-industrial-engineering",
    capabilities: ["mbom", "process-planning", "work-instructions", "robotics", "digital-factory"],
    shortDescription: "Aplicações DELMIA na plataforma 3DEXPERIENCE.",
    description:
      "Aplicações DELMIA executadas na plataforma 3DEXPERIENCE para engenharia industrial e planejamento virtual da manufatura.",
    benefits: [],
    personas: ["manufacturing-engineer"],
    status: "active",
    verification: DELMIA,
  },
  {
    id: "delmia-apriso",
    name: "DELMIA Apriso",
    shortName: "Apriso",
    slug: "apriso",
    ecosystem: "delmia",
    domain: "delmia-manufacturing-operations",
    capabilities: ["mes-mom", "production", "quality", "maintenance"],
    shortDescription: "Família DELMIA para operações de manufatura (MES/MOM).",
    description: "Família de soluções DELMIA para execução e gestão de operações de manufatura.",
    benefits: [],
    personas: ["operations-manager"],
    status: "active",
    verification: DELMIA,
  },
  {
    id: "delmia-quintiq",
    name: "DELMIA Quintiq",
    shortName: "Quintiq",
    slug: "quintiq",
    ecosystem: "delmia",
    domain: "delmia-supply-chain",
    capabilities: ["planning", "scheduling", "optimization-planning"],
    shortDescription: "Família DELMIA para planejamento e otimização.",
    description: "Família de soluções DELMIA para planejamento e otimização da cadeia de suprimentos.",
    benefits: [],
    personas: ["operations-manager", "executive"],
    status: "active",
    verification: DELMIA,
  },
  {
    id: "delmia-ortems",
    name: "DELMIA Ortems",
    shortName: "Ortems",
    slug: "ortems",
    ecosystem: "delmia",
    domain: "delmia-supply-chain",
    capabilities: ["planning", "scheduling"],
    shortDescription: "Família DELMIA para planejamento e programação da produção.",
    description: "Família de soluções DELMIA para planejamento e programação da produção.",
    benefits: [],
    personas: ["operations-manager"],
    status: "active",
    verification: DELMIA,
  },
];
