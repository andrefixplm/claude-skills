import { capabilities } from "./capabilities";
import { buildCatalog, catalog } from "./catalog";
import { domains } from "./domains";
import { ecosystems } from "./ecosystems";
import { personas } from "./personas";
import { products } from "./products";

describe("catálogo (integridade dos dados)", () => {
  it("monta os três ecossistemas na ordem do Digital Thread", () => {
    expect(catalog.ecosystems.map((e) => e.id)).toEqual(["solidworks", "3dexperience", "delmia"]);
  });

  it("SOLIDWORKS Design expõe os quatro níveis vindos dos dados", () => {
    const design = catalog.ecosystems[0]!.domains.find((d) => d.slug === "design")!;
    expect(design.products.map((p) => p.shortName)).toEqual(["Standard", "Professional", "Premium", "Ultimate"]);
  });

  it("todo produto referencia ecossistema, domínio, capacidades e personas existentes", () => {
    for (const p of products) {
      const domain = domains.find((d) => d.id === p.domain);
      expect(domain, p.id).toBeDefined();
      expect(domain!.ecosystemId).toBe(p.ecosystem);
      for (const c of p.capabilities) expect(domain!.capabilityIds, `${p.id} → ${c}`).toContain(c);
      for (const persona of p.personas) expect(personas.map((x) => x.id)).toContain(persona);
      for (const rel of [...(p.relatedProducts ?? []), ...(p.upgradesTo ? [p.upgradesTo] : [])]) {
        expect(products.map((x) => x.id), `${p.id} → ${rel}`).toContain(rel);
      }
    }
  });

  it("todo produto possui metadados de governança de conteúdo", () => {
    for (const p of products) {
      expect(p.verification.contentSource).toBeTruthy();
      expect(p.verification.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("slugs são únicos dentro de cada nível", () => {
    const unique = (xs: string[]) => new Set(xs).size === xs.length;
    expect(unique(catalog.ecosystems.map((e) => e.slug))).toBe(true);
    for (const eco of catalog.ecosystems) {
      expect(unique(eco.domains.map((d) => d.slug))).toBe(true);
      for (const d of eco.domains) expect(unique(d.products.map((p) => p.slug))).toBe(true);
    }
    expect(unique(capabilities.map((c) => c.id))).toBe(true);
  });

  it("deriva Capability → Product a partir dos dados", () => {
    const governance = catalog.ecosystems[0]!.domains.find((d) => d.slug === "data-management")!;
    const files = governance.capabilities.find((c) => c.id === "file-management")!;
    expect(files.products).toEqual(["solidworks-pdm-standard", "solidworks-pdm-professional"]);
  });

  it("oculta produtos com status hidden e falha com referência inválida", () => {
    const hidden = products.map((p, i) => (i === 0 ? { ...p, status: "hidden" as const } : p));
    const built = buildCatalog({ ecosystems, domains, capabilities, products: hidden, personas });
    expect(built.products.find((p) => p.id === products[0]!.id)).toBeUndefined();

    const broken = ecosystems.map((e, i) => (i === 0 ? { ...e, domainIds: ["nao-existe"] } : e));
    expect(() => buildCatalog({ ecosystems: broken, domains, capabilities, products, personas })).toThrow(/nao-existe/);
  });
});
