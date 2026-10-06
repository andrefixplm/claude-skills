import type { DomainRecord } from "../types/catalog";

/**
 * Domínios (Nível 1). A taxonomia DESIGN / SIMULATION / GOVERNANCE / MANUFACTURING
 * é linguagem comercial comum; não implica produtos em todos os quadrantes.
 * DELMIA usa as áreas da oferta atual como domínios.
 *
 * `spherePosition` define onde o hotspot do domínio aparece na esfera (graus).
 */
const POSITIONS = [
  { latitude: 22, longitude: -55 },
  { latitude: -18, longitude: 35 },
  { latitude: 28, longitude: 125 },
  { latitude: -24, longitude: -150 },
] as const;

export const domains: DomainRecord[] = [
  // SOLIDWORKS
  {
    id: "sw-design",
    ecosystemId: "solidworks",
    name: "Design",
    slug: "design",
    shortDescription: "CAD 3D, montagens e documentação.",
    description:
      "Modelagem 3D de peças e montagens e documentação técnica — a base do desenvolvimento de produto.",
    capabilityIds: ["3d-cad", "assemblies", "documentation"],
    spherePosition: POSITIONS[0],
  },
  {
    id: "sw-simulation",
    ecosystemId: "solidworks",
    name: "Simulation",
    slug: "simulation",
    shortDescription: "Validação virtual do comportamento do produto.",
    description:
      "Valide o comportamento do produto antes do protótipo físico: estrutural, movimento, escoamento, plásticos e otimização.",
    capabilityIds: [
      "structural",
      "motion",
      "flow",
      "plastics",
      "optimization",
      "advanced-simulation",
    ],
    spherePosition: POSITIONS[1],
  },
  {
    id: "sw-data-management",
    ecosystemId: "solidworks",
    name: "Data Management",
    slug: "data-management",
    shortDescription: "Arquivos, versões, revisões e workflows.",
    description:
      "Gerencie arquivos de projeto, versões, revisões e fluxos de aprovação da engenharia.",
    capabilityIds: ["file-management", "revision-control", "workflow"],
    spherePosition: POSITIONS[2],
  },
  {
    id: "sw-manufacturing",
    ecosystemId: "solidworks",
    name: "Manufacturing",
    slug: "manufacturing",
    shortDescription: "Do modelo 3D ao chão de fábrica.",
    description:
      "Leve a definição do produto até a fabricação: CAM, NC, MBD, definição de manufatura e comunicação técnica.",
    capabilityIds: [
      "cam",
      "nc",
      "mbd",
      "manufacturing-definition",
      "shop-floor",
      "technical-communication",
    ],
    spherePosition: POSITIONS[3],
  },

  // 3DEXPERIENCE
  {
    id: "3dx-design",
    ecosystemId: "3dexperience",
    name: "Design",
    slug: "design",
    shortDescription: "Projeto conectado à plataforma.",
    description: "Aplicações de projeto conectadas aos dados e processos da plataforma.",
    capabilityIds: [],
    spherePosition: POSITIONS[0],
  },
  {
    id: "3dx-simulation",
    ecosystemId: "3dexperience",
    name: "Simulation",
    slug: "simulation",
    shortDescription: "Simulação integrada aos dados do produto.",
    description: "Simulação executada sobre a mesma base de dados do produto.",
    capabilityIds: [],
    spherePosition: POSITIONS[1],
  },
  {
    id: "3dx-governance",
    ecosystemId: "3dexperience",
    name: "Governance",
    slug: "governance",
    shortDescription: "Dados, BOM, mudanças e liberação.",
    description:
      "Governança do ciclo de vida: colaboração, dados de produto, EBOM, configuração, mudanças, liberação e projetos em uma única fonte de verdade.",
    capabilityIds: [
      "collaboration",
      "product-data",
      "document-management",
      "ebom",
      "configuration",
      "change",
      "release",
      "classification",
      "project",
      "lifecycle",
    ],
    spherePosition: POSITIONS[2],
  },
  {
    id: "3dx-manufacturing",
    ecosystemId: "3dexperience",
    name: "Manufacturing",
    slug: "manufacturing",
    shortDescription: "Continuidade digital até a manufatura.",
    description: "Continuidade dos dados de engenharia até a manufatura.",
    capabilityIds: [],
    spherePosition: POSITIONS[3],
  },

  // DELMIA
  {
    id: "delmia-industrial-engineering",
    ecosystemId: "delmia",
    name: "Industrial Engineering",
    slug: "industrial-engineering",
    shortDescription: "MBOM, processos e fábrica digital.",
    description:
      "Planeje virtualmente a industrialização: MBOM, BOP, planejamento de processos, instruções de trabalho, robótica e fábrica digital.",
    capabilityIds: ["mbom", "process-planning", "work-instructions", "robotics", "digital-factory"],
    spherePosition: POSITIONS[0],
  },
  {
    id: "delmia-manufacturing-operations",
    ecosystemId: "delmia",
    name: "Manufacturing & Operations",
    slug: "manufacturing-operations",
    shortDescription: "MES/MOM, qualidade e produção.",
    description:
      "Execução e gestão de operações de manufatura: MES/MOM, produção, qualidade e manutenção.",
    capabilityIds: ["mes-mom", "production", "quality", "maintenance"],
    spherePosition: POSITIONS[1],
  },
  {
    id: "delmia-supply-chain",
    ecosystemId: "delmia",
    name: "Supply Chain Planning & Optimization",
    slug: "supply-chain",
    shortDescription: "Planejamento, sequenciamento e otimização.",
    description: "Planejamento, programação e otimização da cadeia de suprimentos e da produção.",
    capabilityIds: ["planning", "scheduling", "optimization-planning"],
    spherePosition: POSITIONS[2],
  },
  {
    id: "delmia-logistics-workforce",
    ecosystemId: "delmia",
    name: "Logistics & Workforce",
    slug: "logistics-workforce",
    shortDescription: "Logística e força de trabalho.",
    description: "Planejamento e otimização de logística e da força de trabalho.",
    capabilityIds: ["logistics", "workforce"],
    spherePosition: POSITIONS[3],
  },
];
