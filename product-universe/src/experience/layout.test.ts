import { computeLayout, type Viewport } from "./layout";
import { easeInOutCubic, Tween } from "./tween";

const desktop: Viewport = { width: 1440, height: 900, breakpoint: "desktop" };
const mobile: Viewport = { width: 390, height: 844, breakpoint: "mobile" };

describe("computeLayout", () => {
  it("universo desktop: três esferas visíveis, em linha e simétricas", () => {
    const l = computeLayout({ level: "universe", count: 3, activeIndex: -1, viewport: desktop });
    expect(l.spheres.every((s) => s.scale > 0.1 && s.emphasis === 1)).toBe(true);
    expect(l.spheres[0]!.position[0]).toBeCloseTo(-l.spheres[2]!.position[0]);
  });

  it("universo mobile: apenas uma esfera visível", () => {
    const l = computeLayout({ level: "universe", count: 3, activeIndex: 1, viewport: mobile });
    expect(l.spheres.filter((s) => s.scale > 0.01)).toHaveLength(1);
    expect(l.spheres[1]!.interactive).toBe(true);
  });

  it("ecossistema: ativa centralizada, demais secundárias", () => {
    const l = computeLayout({ level: "ecosystem", count: 3, activeIndex: 0, viewport: desktop });
    expect(l.spheres[0]).toMatchObject({ position: [0, 0, 0], scale: 1, emphasis: 1 });
    expect(l.spheres[1]!.emphasis).toBeLessThan(1);
    expect(l.spheres[1]!.scale).toBeLessThan(0.5);
  });

  it("domínio aproxima a câmera em relação ao ecossistema (desktop)", () => {
    const eco = computeLayout({ level: "ecosystem", count: 3, activeIndex: 0, viewport: desktop });
    const dom = computeLayout({ level: "domain", count: 3, activeIndex: 0, viewport: desktop });
    expect(dom.camera[2]).toBeLessThan(eco.camera[2]);
    // Painel à direita: a câmera desloca-se para +X e a esfera fica à esquerda.
    expect(eco.camera[0]).toBeGreaterThan(0);
  });
});

describe("Tween", () => {
  it("usa easeInOutCubic e parte do valor atual ao mudar de alvo (animação reversa)", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(1)).toBe(1);
    const t = new Tween([0]);
    t.set([10], 1, 0);
    expect(t.update(0.5)[0]).toBeCloseTo(5);
    t.set([0], 1, 0.5);
    expect(t.update(0.5)[0]).toBeCloseTo(5);
    expect(t.update(1.5)[0]).toBeCloseTo(0);
  });
});
