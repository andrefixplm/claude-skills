import type { CapabilityRecord } from "../types/catalog";

/**
 * Capacidades (Nível 2). A relação Capability → Product é derivada de
 * `products.ts` (campo `capabilities`) — permanece configurável pelos dados.
 */
const cap = (id: string, name: string, description: string): CapabilityRecord => ({
  id,
  slug: id,
  name,
  description,
});

export const capabilities: CapabilityRecord[] = [
  // SOLIDWORKS · Design
  cap("3d-cad", "Modelagem 3D", "Criação de peças em CAD 3D paramétrico."),
  cap("assemblies", "Montagens", "Montagens e relações entre componentes."),
  cap("documentation", "Documentação 2D", "Desenhos e documentação técnica."),
  // SOLIDWORKS · Simulation
  cap("structural", "Structural", "Análise estrutural."),
  cap("motion", "Motion", "Análise de movimento."),
  cap("flow", "Flow", "Escoamento de fluidos e transferência de calor."),
  cap("plastics", "Plastics", "Simulação de injeção de plásticos."),
  cap("optimization", "Optimization", "Otimização de projeto."),
  cap("advanced-simulation", "Advanced Simulation", "Análises avançadas."),
  // SOLIDWORKS · Data Management
  cap("file-management", "Gestão de arquivos", "Cofre centralizado de arquivos de projeto."),
  cap("revision-control", "Controle de revisões", "Versões e revisões rastreáveis."),
  cap("workflow", "Workflow", "Fluxos de aprovação e liberação."),
  // SOLIDWORKS · Manufacturing
  cap("cam", "CAM", "Programação de usinagem a partir do modelo 3D."),
  cap("nc", "NC", "Geração de código NC."),
  cap("mbd", "MBD", "Definição baseada em modelo (Model-Based Definition)."),
  cap("manufacturing-definition", "Manufacturing Definition", "Definição de manufatura."),
  cap("shop-floor", "Shop Floor", "Informação de projeto no chão de fábrica."),
  cap("technical-communication", "Technical Communication", "Comunicação técnica."),
  // 3DEXPERIENCE · Governance
  cap("collaboration", "Collaboration", "Colaboração entre equipes e parceiros."),
  cap("product-data", "Product Data", "Dados de produto em fonte única."),
  cap("document-management", "Document Management", "Gestão de documentos."),
  cap("ebom", "EBOM", "Estrutura de produto de engenharia."),
  cap("configuration", "Configuration", "Gestão de configuração."),
  cap("change", "Change", "Gestão de mudanças."),
  cap("release", "Release", "Liberação e maturidade."),
  cap("classification", "Classification", "Classificação e reutilização."),
  cap("project", "Project", "Gestão de projetos."),
  cap("lifecycle", "Lifecycle", "Ciclo de vida do produto."),
  // DELMIA · Industrial Engineering
  cap("mbom", "MBOM", "Estrutura de produto de manufatura."),
  cap("process-planning", "Process Planning", "BOP, roteiros e planejamento de processos."),
  cap("work-instructions", "Work Instructions", "Instruções de trabalho digitais."),
  cap("robotics", "Robotics", "Programação e simulação robótica."),
  cap("digital-factory", "Digital Factory", "Layout e simulação da fábrica digital."),
  // DELMIA · Manufacturing & Operations
  cap("mes-mom", "MES / MOM", "Execução e gestão de operações de manufatura."),
  cap("production", "Production", "Controle da produção."),
  cap("quality", "Quality", "Gestão da qualidade."),
  cap("maintenance", "Maintenance", "Gestão da manutenção."),
  // DELMIA · Supply Chain
  cap("planning", "Planning", "Planejamento de supply chain e produção."),
  cap("scheduling", "Scheduling", "Programação e sequenciamento."),
  cap("optimization-planning", "Optimization", "Otimização de planejamento."),
  // DELMIA · Logistics & Workforce
  cap("logistics", "Logistics", "Planejamento logístico."),
  cap("workforce", "Workforce", "Planejamento da força de trabalho."),
];
