import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  LineBasicMaterial,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  PointsMaterial,
} from "three";
import type { EcosystemTheme } from "../types/catalog";
import type { DeviceQuality } from "../utils/device";
import { QUALITY_BUDGET } from "./config";
import { fibonacciSphere, latLongGrid, latLonToVector, nearestEdges, partialWireframe, seeded } from "./geometry";
import { getDotTexture } from "./materials";
import { noRaycast, type SphereSignals } from "./signals";

interface VisualProps {
  theme: EcosystemTheme;
  quality: DeviceQuality;
  signals: SphereSignals;
}

const lineMaterial = (color: string, opacity: number) =>
  new LineBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false });

const pointsMaterial = (color: string, size: number, opacity: number) =>
  new PointsMaterial({
    color,
    size,
    map: getDotTexture(),
    transparent: true,
    opacity,
    blending: AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

const geometryFrom = (positions: Float32Array) => {
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(positions, 3));
  return g;
};

/** Ajusta a opacidade de materiais conforme o destaque da esfera. */
function useEmphasis(signals: SphereSignals, entries: [{ opacity: number }, number][]) {
  useFrame(() => {
    for (const [mat, base] of entries) mat.opacity = base * signals.emphasis * Math.min(1.4, signals.glow);
  });
}

type Disposable = { dispose: () => void };
const isDisposable = (v: unknown): v is Disposable =>
  typeof v === "object" && v !== null && typeof (v as Disposable).dispose === "function";

/** Libera geometrias/materiais (inclusive em arrays) quando o recurso é recriado ou desmontado. */
function useDisposeAll(res: Record<string, unknown>) {
  useEffect(
    () => () => {
      for (const value of Object.values(res)) {
        for (const item of Array.isArray(value) ? value : [value]) if (isDisposable(item)) item.dispose();
      }
    },
    [res],
  );
}

function ringGeometry(radius: number, segments = 128) {
  const pts = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.set([Math.cos(a) * radius, 0, Math.sin(a) * radius], i * 3);
  }
  return geometryFrom(pts);
}

/** SOLIDWORKS — grid técnico, wireframe parcial, anéis de referência (Engineering / Precision). */
export function CadVisual({ theme, signals }: VisualProps) {
  const res = useMemo(() => {
    const grid = geometryFrom(latLongGrid(10, 16, 1.004));
    const wire = geometryFrom(partialWireframe(1.012, 3, (v) => v.x * 0.7 + v.y * 0.7 > 0.15));
    const ring = ringGeometry(1.22);
    const ring2 = ringGeometry(1.32);
    return {
      grid,
      wire,
      ring,
      ring2,
      gridMat: lineMaterial(theme.glow, 0.16),
      wireMat: lineMaterial("#ffd9d6", 0.32),
      ringMat: lineMaterial(theme.glow, 0.45),
      ring2Mat: lineMaterial(theme.glow, 0.18),
    };
  }, [theme.glow]);
  useDisposeAll(res);
  useEmphasis(signals, [
    [res.gridMat, 0.16],
    [res.wireMat, 0.32],
    [res.ringMat, 0.45],
    [res.ring2Mat, 0.18],
  ]);
  return (
    <group>
      <lineSegments geometry={res.grid} material={res.gridMat} raycast={noRaycast} />
      <lineSegments geometry={res.wire} material={res.wireMat} raycast={noRaycast} />
      <lineLoop geometry={res.ring} material={res.ringMat} rotation={[0.35, 0, 0.2]} raycast={noRaycast} />
      <lineLoop geometry={res.ring2} material={res.ring2Mat} rotation={[-0.5, 0, -0.35]} raycast={noRaycast} />
    </group>
  );
}

/** 3DEXPERIENCE — nós, rede e partículas trafegando (Connected Intelligence). */
export function NetworkVisual({ theme, quality, signals }: VisualProps) {
  const budget = QUALITY_BUDGET[quality];
  const res = useMemo(() => {
    const nodes = fibonacciSphere(budget.networkNodes, 1.01);
    const edges = nearestEdges(nodes, 3, 0.5);
    const linePos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      linePos.set(nodes.subarray(a * 3, a * 3 + 3), i * 6);
      linePos.set(nodes.subarray(b * 3, b * 3 + 3), i * 6 + 3);
    });
    const rand = seeded(7);
    const travelers = Array.from({ length: budget.travelers }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.25 + rand() * 0.5,
    }));
    const travelerGeo = geometryFrom(new Float32Array(Math.max(1, travelers.length) * 3));
    (travelerGeo.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage);
    return {
      nodes,
      edges,
      travelers,
      nodeGeo: geometryFrom(nodes),
      lineGeo: geometryFrom(linePos),
      travelerGeo,
      nodeMat: pointsMaterial(theme.glow, 0.045, 0.85),
      lineMat: lineMaterial(theme.primary, 0.28),
      travelerMat: pointsMaterial("#e6f8ff", 0.07, 1),
    };
  }, [budget.networkNodes, budget.travelers, theme.glow, theme.primary]);
  useDisposeAll(res);
  useEmphasis(signals, [
    [res.nodeMat, 0.85],
    [res.lineMat, 0.28],
    [res.travelerMat, 1],
  ]);

  useFrame((_, delta) => {
    if (signals.reducedMotion || res.travelers.length === 0) return;
    const attr = res.travelerGeo.attributes.position as BufferAttribute;
    const arr = attr.array as Float32Array;
    const n = res.nodes;
    res.travelers.forEach((p, i) => {
      p.t += delta * p.speed * (1 - 0.6 * signals.focus);
      if (p.t >= 1) {
        p.t = 0;
        p.edge = (p.edge + 17) % res.edges.length;
      }
      const [a, b] = res.edges[p.edge] ?? [0, 0];
      for (let k = 0; k < 3; k++) arr[i * 3 + k] = n[a * 3 + k]! + (n[b * 3 + k]! - n[a * 3 + k]!) * p.t;
    });
    attr.needsUpdate = true;
  });

  return (
    <group>
      <points geometry={res.nodeGeo} material={res.nodeMat} raycast={noRaycast} />
      <lineSegments geometry={res.lineGeo} material={res.lineMat} raycast={noRaycast} />
      {res.travelers.length > 0 && <points geometry={res.travelerGeo} material={res.travelerMat} raycast={noRaycast} />}
    </group>
  );
}

/** DELMIA — grid industrial, células de manufatura e fluxos logísticos (Factory / Execution). */
export function IndustrialVisual({ theme, quality, signals }: VisualProps) {
  const budget = QUALITY_BUDGET[quality];
  const res = useMemo(() => {
    const grid = geometryFrom(latLongGrid(8, 18, 1.004, 72));
    const cellGeo = new PlaneGeometry(0.11, 0.11);
    const cellMat = new MeshBasicMaterial({
      transparent: true,
      opacity: 0.6,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    const cells = new InstancedMesh(cellGeo, cellMat, budget.industrialCells);
    cells.raycast = noRaycast;
    const rand = seeded(11);
    const dummy = new Object3D();
    const base = new Color(theme.primary);
    const hot = new Color(theme.glow);
    for (let i = 0; i < budget.industrialCells; i++) {
      // Células alinhadas ao grid (lat 8 × lon 18), como uma planta fabril.
      const lat = -67.5 + Math.floor(rand() * 7) * 22.5;
      const lon = Math.floor(rand() * 36) * 10 + 5;
      const p = latLonToVector(lat, lon, 1.008);
      dummy.position.copy(p);
      dummy.lookAt(p.clone().multiplyScalar(2));
      dummy.updateMatrix();
      cells.setMatrixAt(i, dummy.matrix);
      cells.setColorAt(i, base.clone().lerp(hot, rand()).multiplyScalar(0.5 + rand() * 0.5));
    }
    const rings = [1.14, 1.22, 1.3].map((r) => ringGeometry(r, 96));
    const ringMat = lineMaterial(theme.glow, 0.3);
    const flows = rings.map(() => {
      const g = geometryFrom(new Float32Array(Math.max(1, budget.flowDots) * 3));
      (g.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage);
      return g;
    });
    return {
      grid,
      gridMat: lineMaterial(theme.primary, 0.22),
      cells,
      cellGeo,
      cellMat,
      rings,
      ringMat,
      flows,
      flowMat: pointsMaterial("#fff1d6", 0.075, 1),
      radii: [1.14, 1.22, 1.3],
      tilts: [
        [0.5, 0, 0.1],
        [-0.25, 0, -0.4],
        [1.2, 0, 0.3],
      ] as [number, number, number][],
    };
  }, [budget.industrialCells, budget.flowDots, theme.glow, theme.primary]);
  useDisposeAll(res);
  useEmphasis(signals, [
    [res.gridMat, 0.22],
    [res.cellMat, 0.6],
    [res.ringMat, 0.3],
    [res.flowMat, 1],
  ]);

  useFrame(({ clock }) => {
    if (budget.flowDots === 0) return;
    const t = signals.reducedMotion ? 0 : clock.elapsedTime;
    res.flows.forEach((geo, ringIndex) => {
      const attr = geo.attributes.position as BufferAttribute;
      const arr = attr.array as Float32Array;
      const r = res.radii[ringIndex]!;
      const speed = (0.18 + ringIndex * 0.07) * (ringIndex % 2 ? -1 : 1) * (1 - 0.6 * signals.focus);
      for (let i = 0; i < budget.flowDots; i++) {
        const a = t * speed + (i / budget.flowDots) * Math.PI * 2;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 1] = 0;
        arr[i * 3 + 2] = Math.sin(a) * r;
      }
      attr.needsUpdate = true;
    });
  });

  return (
    <group>
      <lineSegments geometry={res.grid} material={res.gridMat} raycast={noRaycast} />
      <primitive object={res.cells} />
      {res.rings.map((geo, i) => (
        <group key={i} rotation={res.tilts[i]}>
          <lineLoop geometry={geo} material={res.ringMat} raycast={noRaycast} />
          {budget.flowDots > 0 && <points geometry={res.flows[i]} material={res.flowMat} raycast={noRaycast} />}
        </group>
      ))}
    </group>
  );
}

export const VISUALS = { cad: CadVisual, network: NetworkVisual, industrial: IndustrialVisual } as const;
