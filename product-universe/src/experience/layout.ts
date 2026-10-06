import type { Breakpoint } from "../utils/device";
import type { NavigationLevel } from "../services/navigation";
import { CAMERA, ORBIT } from "./config";

export interface Viewport {
  width: number;
  height: number;
  breakpoint: Breakpoint;
}

export interface SphereTarget {
  position: [number, number, number];
  scale: number;
  /** 1 = destaque total, 0 = apagada (sempre via animação, nunca remoção). */
  emphasis: number;
  interactive: boolean;
}

export interface SceneLayout {
  camera: [number, number, number];
  spheres: SphereTarget[];
}

interface LayoutInput {
  level: NavigationLevel;
  count: number;
  /** Índice do ecossistema ativo (ou em destaque no mobile/universo). */
  activeIndex: number;
  viewport: Viewport;
}

/** Medidas do HTML que o 3D precisa respeitar (ver components/*). */
export const UI = {
  header: 64,
  panelWidth: 440,
  panelGap: 24,
  containerMax: 1200,
  gutter: 16,
  mobileSheet: 0.56,
} as const;

const tanHalf = () => Math.tan(((CAMERA.fov / 2) * Math.PI) / 180);
const pixelsPerUnit = (height: number, distance: number) => height / (2 * distance * tanHalf());

interface Region {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

/** Posiciona a câmera para que um objeto de raio `radius` (na origem) preencha `fill` da região. */
function frame(radius: number, fill: number, region: Region, vp: Viewport) {
  const rw = region.x1 - region.x0;
  const rh = region.y1 - region.y0;
  const z = (radius * vp.height) / (tanHalf() * fill * Math.min(rw, rh));
  const ppu = pixelsPerUnit(vp.height, z);
  const cx = (region.x0 + region.x1) / 2;
  const cy = (region.y0 + region.y1) / 2;
  const camX = -(cx - vp.width / 2) / ppu;
  const camY = (cy - vp.height / 2) / ppu;
  const toWorld = (sx: number, sy: number): [number, number] => [
    camX + (sx - vp.width / 2) / ppu,
    camY - (sy - vp.height / 2) / ppu,
  ];
  return { camera: [camX, camY, z] as [number, number, number], ppu, toWorld, region };
}

/**
 * Enquadra um objeto de raio `radius` reservando margens em pixels (rótulos HTML da órbita)
 * em cada lado.
 */
function frameWithMargins(radius: number, marginX: number, marginY: number, region: Region, vp: Viewport) {
  const rw = region.x1 - region.x0;
  const rh = region.y1 - region.y0;
  const ppu = Math.max(20, Math.min((rw / 2 - marginX) / radius, (rh / 2 - marginY) / radius));
  // Reaproveita `frame` com o preenchimento equivalente a esse ppu.
  return frame(radius, (2 * radius * ppu) / Math.min(rw, rh), region, vp);
}

/** Região útil do canvas (pixels) não coberta pelo painel HTML. */
export function focusRegion(vp: Viewport): Region {
  if (vp.breakpoint === "mobile") {
    return { x0: 0, x1: vp.width, y0: UI.header, y1: vp.height * (1 - UI.mobileSheet) };
  }
  const panel = Math.min(UI.panelWidth, vp.width * 0.42) + UI.panelGap * 2;
  return { x0: 0, x1: vp.width - panel, y0: UI.header, y1: vp.height };
}

/**
 * Layout puro (testável) de câmera e esferas para cada nível de navegação.
 * Não conhece produtos: apenas quantidade de esferas e índice ativo.
 */
export function computeLayout({ level, count, activeIndex, viewport: vp }: LayoutInput): SceneLayout {
  if (level === "universe") return universeLayout(count, activeIndex, vp);

  const region = focusRegion(vp);
  const mobile = vp.breakpoint === "mobile";
  const f =
    level === "ecosystem"
      ? frame(1, mobile ? CAMERA.ecosystemFillMobile : CAMERA.ecosystemFill, region, vp)
      : frameWithMargins(
          ORBIT.radius + ORBIT.nodeRadius,
          mobile ? ORBIT.labelMarginMobile.x : ORBIT.labelMargin.x,
          mobile ? ORBIT.labelMarginMobile.y : ORBIT.labelMargin.y,
          region,
          vp,
        );

  const secondary = Array.from({ length: count }, (_, i) => i).filter((i) => i !== activeIndex);
  const spheres: SphereTarget[] = Array.from({ length: count }, (_, i) => {
    if (i === activeIndex) return { position: [0, 0, 0], scale: 1, emphasis: 1, interactive: true };
    // Secundárias: cantos esquerdos da região (desktop/tablet) e somente no nível ecossistema.
    const slot = secondary.indexOf(i);
    const { region } = f;
    const sx = region.x0 + Math.min(110, (region.x1 - region.x0) * 0.12);
    const sy = slot === 0 ? region.y0 + (region.y1 - region.y0) * 0.16 : region.y1 - (region.y1 - region.y0) * 0.16;
    const [wx, wy] = f.toWorld(sx, sy);
    const visible = level === "ecosystem" && vp.breakpoint !== "mobile";
    const scale = visible ? Math.min(0.42, 46 / f.ppu) : 0.0001;
    return { position: [wx, wy, 0], scale, emphasis: visible ? 0.45 : 0, interactive: visible };
  });
  return { camera: f.camera, spheres };
}

function universeLayout(count: number, activeIndex: number, vp: Viewport): SceneLayout {
  const z = CAMERA.universeDistance;
  const ppu = pixelsPerUnit(vp.height, z);

  if (vp.breakpoint === "mobile") {
    // Mobile: uma única esfera + seletor horizontal (DOC 19).
    const y0 = vp.height * 0.46;
    const y1 = vp.height * 0.78;
    const radiusPx = Math.min(vp.width * 0.34, (y1 - y0) * 0.45);
    const camY = ((y0 + y1) / 2 - vp.height / 2) / ppu;
    return {
      camera: [0, camY, z],
      spheres: Array.from({ length: count }, (_, i) => ({
        position: [0, 0, 0],
        scale: i === activeIndex ? radiusPx / ppu : 0.0001,
        emphasis: i === activeIndex ? 1 : 0,
        interactive: i === activeIndex,
      })),
    };
  }

  // Desktop/tablet: esferas alinhadas às colunas dos cards HTML.
  const container = Math.min(vp.width - UI.gutter * 4, UI.containerMax);
  const column = container / count;
  const y0 = vp.height * 0.42;
  const y1 = vp.height * 0.78;
  const radiusPx = Math.min(column * (vp.breakpoint === "tablet" ? 0.3 : 0.34), (y1 - y0) * 0.46);
  const camY = ((y0 + y1) / 2 - vp.height / 2) / ppu;
  return {
    camera: [0, camY, z],
    spheres: Array.from({ length: count }, (_, i) => ({
      position: [((i - (count - 1) / 2) * column) / ppu, 0, 0],
      scale: radiusPx / ppu,
      emphasis: 1,
      interactive: true,
    })),
  };
}
