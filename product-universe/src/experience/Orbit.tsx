import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  MathUtils,
  Vector3,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { useUniverse } from "../store/universe";
import { ORBIT } from "./config";
import { orbitLabelElements, setOrbitLabels, type OrbitLabelItem } from "./orbitLabels";
import { noRaycast } from "./signals";

export type OrbitItem = OrbitLabelItem;

interface OrbitProps {
  /** Identifica a órbita no registro de rótulos (um por ecossistema). */
  groupKey: string;
  items: OrbitItem[];
  open: boolean;
  color: string;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
}

/** Ângulos começando no topo, sentido horário. */
const angleFor = (i: number, n: number) => Math.PI / 2 - (i / Math.max(1, n)) * Math.PI * 2;

/**
 * Produtos orbitando a esfera do domínio em foco (DOC 05 §5).
 * Abre e fecha com animação — nunca é simplesmente removido.
 * Equivalente HTML: lista "Soluções" no painel.
 */
export function Orbit({ groupKey, items, open, color, onSelect, onHover }: OrbitProps) {
  const nodes = useRef<(Mesh | null)[]>([]);
  const anchors = useRef<(Group | null)[]>([]);
  const world = useMemo(() => new Vector3(), []);
  const group = useRef<Group>(null);
  const progress = useRef(0);
  const emphasis = useRef<number[]>([]);

  const { lineGeo, lineMat } = useMemo(() => {
    const pts = new Float32Array(items.length * 6);
    items.forEach((_, i) => {
      const a = angleFor(i, items.length);
      pts.set([Math.cos(a) * 1.02, Math.sin(a) * 1.02, 0, Math.cos(a) * ORBIT.radius, Math.sin(a) * ORBIT.radius, 0], i * 6);
    });
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pts, 3));
    const m = new LineBasicMaterial({ color, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    return { lineGeo: g, lineMat: m };
  }, [items, color]);
  useEffect(() => () => (lineGeo.dispose(), lineMat.dispose()), [lineGeo, lineMat]);
  useEffect(() => {
    setOrbitLabels(groupKey, items);
    return () => setOrbitLabels(groupKey, null);
  }, [groupKey, items]);

  useFrame(({ camera, size }, delta) => {
    const { activeProduct, hoveredProduct, reducedMotion } = useUniverse.getState();
    const speed = reducedMotion ? 1000 : 1.4;
    progress.current = MathUtils.clamp(progress.current + (open ? delta : -delta) * speed, 0, 1 + items.length * 0.12);
    lineMat.opacity = Math.min(1, progress.current) * 0.28;
    if (group.current) group.current.visible = progress.current > 0;

    items.forEach((item, i) => {
      // Entrada escalonada; saída em ordem reversa.
      const local = MathUtils.clamp(progress.current - i * 0.12, 0, 1);
      const eased = local * local * (3 - 2 * local);
      const target = item.id === activeProduct ? 1 : item.id === hoveredProduct ? 0.6 : 0;
      emphasis.current[i] = MathUtils.damp(emphasis.current[i] ?? 0, target, 10, delta);
      const e = emphasis.current[i] ?? 0;
      const node = nodes.current[i];
      if (node) {
        node.scale.setScalar(Math.max(0.0001, eased * (1 + e * 0.45)));
        (node.material as MeshBasicMaterial).opacity = 0.55 + e * 0.45;
      }
      // Projeta a âncora do rótulo para pixels e posiciona o elemento DOM, afastando-o do nó.
      const label = orbitLabelElements.get(item.id);
      const anchor = anchors.current[i];
      if (label && anchor) {
        anchor.getWorldPosition(world).project(camera);
        const a = angleFor(i, items.length);
        const px = ((world.x + 1) / 2) * size.width;
        const py = ((1 - world.y) / 2) * size.height;
        // Desktop/tablet: rótulo radial. Mobile: rótulo abaixo do nó (cabe na largura).
        const below = size.width < 768 && Math.abs(Math.cos(a)) > 0.5;
        const tx = below ? -50 : -50 + Math.cos(a) * 50;
        const ty = below ? 60 : -50 - Math.sin(a) * 50;
        label.style.transform = `translate(${px}px, ${py}px) translate(${tx}%, ${ty}%)`;
        label.style.opacity = String(eased * (activeProduct && !e ? 0.6 : 1));
        label.style.pointerEvents = eased > 0.9 ? "auto" : "none";
        label.dataset.active = String(item.id === activeProduct);
      }
    });
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo} material={lineMat} raycast={noRaycast} />
      {items.map((item, i) => {
        const a = angleFor(i, items.length);
        const x = Math.cos(a) * ORBIT.radius;
        const y = Math.sin(a) * ORBIT.radius;
        const labelOffset = ORBIT.nodeRadius * 1.8;
        return (
          <group key={item.id} position={[x, y, 0]}>
            <mesh
              ref={(m) => {
                nodes.current[i] = m;
              }}
              scale={0.0001}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(item.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                onHover(undefined);
                document.body.style.cursor = "";
              }}
            >
              <sphereGeometry args={[ORBIT.nodeRadius, 24, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </mesh>
            <group
              ref={(g) => {
                anchors.current[i] = g;
              }}
              position={[Math.cos(a) * labelOffset, Math.sin(a) * labelOffset, 0]}
            />
          </group>
        );
      })}
    </group>
  );
}
