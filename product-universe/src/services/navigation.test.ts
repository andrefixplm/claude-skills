import { catalog } from "../data/catalog";
import { buildBreadcrumb, parentPath, paths, resolveRoute } from "./navigation";

describe("resolveRoute", () => {
  it("resolve cada nível do deep link", () => {
    expect(resolveRoute(catalog, {}).level).toBe("universe");
    expect(resolveRoute(catalog, { ecosystem: "solidworks" }).level).toBe("ecosystem");
    expect(resolveRoute(catalog, { ecosystem: "solidworks", domain: "design" }).level).toBe("domain");
    const r = resolveRoute(catalog, { ecosystem: "solidworks", domain: "design", product: "premium" });
    expect(r.level).toBe("product");
    expect(r.product?.id).toBe("solidworks-design-premium");
  });

  it("redireciona slugs inválidos para o nível válido mais profundo", () => {
    expect(resolveRoute(catalog, { ecosystem: "x" }).redirectTo).toBe("/");
    expect(resolveRoute(catalog, { ecosystem: "solidworks", domain: "x" }).redirectTo).toBe("/solutions/solidworks");
    expect(resolveRoute(catalog, { ecosystem: "solidworks", domain: "design", product: "x" }).redirectTo).toBe(
      "/solutions/solidworks/design",
    );
  });

  it("não aceita produto de outro domínio", () => {
    const r = resolveRoute(catalog, { ecosystem: "solidworks", domain: "simulation", product: "premium" });
    expect(r.redirectTo).toBe("/solutions/solidworks/simulation");
  });
});

describe("breadcrumb e retorno", () => {
  const route = resolveRoute(catalog, { ecosystem: "solidworks", domain: "design", product: "premium" });

  it("gera Universe / SOLIDWORKS / Design / Premium com links clicáveis", () => {
    const crumbs = buildBreadcrumb(route, "Universo");
    expect(crumbs.map((c) => c.label)).toEqual(["Universo", "SOLIDWORKS", "Design", "Premium"]);
    expect(crumbs.map((c) => c.to)).toEqual([
      "/",
      "/solutions/solidworks",
      "/solutions/solidworks/design",
      "/solutions/solidworks/design/premium",
    ]);
    expect(crumbs.filter((c) => c.current)).toHaveLength(1);
  });

  it("sobe um nível por vez", () => {
    expect(parentPath(route)).toBe(paths.domain("solidworks", "design"));
    expect(parentPath(resolveRoute(catalog, { ecosystem: "solidworks", domain: "design" }))).toBe("/solutions/solidworks");
    expect(parentPath(resolveRoute(catalog, { ecosystem: "solidworks" }))).toBe("/");
  });
});
