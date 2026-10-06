import type { EcosystemRecord } from "../types/catalog";

/**
 * Ecossistemas (Nível 0). Cores conforme DESIGN_SYSTEM.md — 3DEXPERIENCE e DELMIA
 * são decisões iniciais de UX; o brand guideline oficial deve prevalecer.
 */
export const ecosystems: EcosystemRecord[] = [
  {
    id: "solidworks",
    slug: "solidworks",
    name: "SOLIDWORKS",
    focus: "Design",
    tagline: "Engenharia e desenvolvimento de produto.",
    headline: "Projete. Simule. Inove.",
    description:
      "Transforme conceitos em produtos utilizando ferramentas digitais de engenharia integradas.",
    theme: { primary: "#E2231A", secondary: "#3A0806", glow: "#FF5A4F", visual: "cad" },
    domainIds: ["sw-design", "sw-simulation", "sw-data-management", "sw-manufacturing"],
    officialUrl: "https://www.solidworks.com/",
  },
  {
    id: "3dexperience",
    slug: "3dexperience",
    name: "3DEXPERIENCE",
    focus: "Governance",
    tagline: "Colaboração, governança, processos e dados.",
    headline: "Conecte produtos, pessoas e processos.",
    description:
      "A camada conectiva do ecossistema: pessoas, dados, processos e aplicações em uma única plataforma.",
    theme: { primary: "#00AEEF", secondary: "#03263A", glow: "#5FD4FF", visual: "network" },
    domainIds: ["3dx-design", "3dx-simulation", "3dx-governance", "3dx-manufacturing"],
    officialUrl: "https://www.3ds.com/3dexperience",
  },
  {
    id: "delmia",
    slug: "delmia",
    name: "DELMIA",
    focus: "Manufacture",
    tagline: "Industrialização, manufatura e operações.",
    headline: "Planeje virtualmente. Execute no mundo real.",
    description:
      "Do planejamento industrial à execução: engenharia de processos, operações de manufatura, supply chain e logística.",
    theme: { primary: "#F59E0B", secondary: "#3A2402", glow: "#FFC15A", visual: "industrial" },
    domainIds: [
      "delmia-industrial-engineering",
      "delmia-manufacturing-operations",
      "delmia-supply-chain",
      "delmia-logistics-workforce",
    ],
    officialUrl: "https://www.3ds.com/products/delmia",
  },
];
