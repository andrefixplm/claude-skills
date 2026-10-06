/**
 * Modelo de dados do catálogo (DATA_MODEL.md).
 * A UI conhece apenas estas estruturas — nunca nomes de produtos.
 */

/** Metadados de governança de conteúdo (DOC 32). */
export interface ContentVerification {
  contentSource: string;
  sourceUrl: string;
  /** Data (ISO) da fonte consultada. `null` enquanto pendente. */
  sourceDate: string | null;
  verifiedBy: string | null;
  /** Data (ISO) da verificação. `null` = conteúdo ainda não verificado. */
  verifiedAt: string | null;
}

/** Linguagem visual da esfera — escolhida pelo dado, renderizada pelo 3D. */
export type SphereVisual = "cad" | "network" | "industrial";

export interface EcosystemTheme {
  primary: string;
  secondary: string;
  glow: string;
  visual: SphereVisual;
}

export interface Vector3Like {
  x: number;
  y: number;
  z: number;
}

/** Registros normalizados (formato "tabela", pronto para CMS). */
export interface EcosystemRecord {
  id: string;
  slug: string;
  name: string;
  /** Rótulo curto exibido sob a esfera no universo (ex.: "DESIGN"). */
  focus: string;
  tagline: string;
  headline: string;
  description: string;
  theme: EcosystemTheme;
  /** Ordem dos domínios exibidos. */
  domainIds: string[];
  officialUrl?: string;
  position?: Vector3Like;
}

export interface DomainRecord {
  id: string;
  ecosystemId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  capabilityIds: string[];
  spherePosition?: { latitude: number; longitude: number };
}

export interface CapabilityRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type ProductStatus = "active" | "coming-soon" | "hidden";

export interface Product {
  id: string;
  name: string;
  /** Rótulo curto para a órbita (ex.: "Premium"). */
  shortName: string;
  slug: string;
  ecosystem: string;
  domain: string;
  capabilities: string[];
  shortDescription: string;
  description: string;
  benefits: string[];
  personas: string[];
  deployment?: string[];
  relatedProducts?: string[];
  upgradesTo?: string;
  officialUrl?: string;
  icon?: string;
  status: ProductStatus;
  verification: ContentVerification;
}

export interface Persona {
  id: string;
  name: string;
}

/** Estruturas aninhadas (DOC 11) — montadas a partir dos registros. */
export interface Capability extends CapabilityRecord {
  products: string[];
}

export interface Domain extends Omit<DomainRecord, "capabilityIds"> {
  capabilities: Capability[];
  products: Product[];
}

export interface Ecosystem extends Omit<EcosystemRecord, "domainIds"> {
  domains: Domain[];
}

export interface Catalog {
  ecosystems: Ecosystem[];
  products: Product[];
  personas: Persona[];
}
