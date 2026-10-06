import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  LineBasicMaterial,
  PointsMaterial,
  QuadraticBezierCurve3,
  Vector3,
} from "three";
import { useUniverse } from "../store/universe";
import { getDotTexture } from "./materials";
import { noRaycast } from "./signals";

interface ConnectionsProps {
  /** Posições das esferas, na ordem do Digital Thread. */
  anchors: [number, number, number][];
  radius: number;
  visible: boolean;
}

const PULSES_PER_LINK = 3;

/**
 * Fio digital entre os ecossistemas (Design → Governança → Manufatura),
 * visível no universo. Some com fade — nunca abruptamente.
 */
export function Connections({ anchors, radius, visible }: ConnectionsProps) {
  const res = useMemo(() => {
    const curves = anchors.slice(0, -1).map((a, i) => {
      const b = anchors[i + 1]!;
      const start = new Vector3(a[0] + radius * 1.05, a[1], a[2]);
      const end = new Vector3(b[0] - radius * 1.05, b[1], b[2]);
      const mid = start.clone().lerp(end, 0.5).add(new Vector3(0, radius * 0.35, 0));
      return new QuadraticBezierCurve3(start, mid, end);
    });
    const linePts = curves.flatMap((c) => c.getPoints(48).flatMap((p, i, arr) => (i < arr.length - 1 ? [p, arr[i + 1]!] : [])));
    const lineGeo = new BufferGeometry().setFromPoints(linePts);
    const pulseGeo = new BufferGeometry();
    pulseGeo.setAttribute("position", new BufferAttribute(new Float32Array(Math.max(1, curves.length * PULSES_PER_LINK) * 3), 3));
    (pulseGeo.attributes.position as BufferAttribute).setUsage(DynamicDrawUsage);
    const lineMat = new LineBasicMaterial({ color: "#8fa6c8", transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
    const pulseMat = new PointsMaterial({
      size: Math.max(0.05, radius * 0.09),
      map: getDotTexture(),
      color: "#ffffff",
      transparent: true,
      opacity: 0,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    return { curves, lineGeo, pulseGeo, lineMat, pulseMat };
  }, [anchors, radius]);
  useEffect(
    () => () => {
      res.lineGeo.dispose();
      res.pulseGeo.dispose();
      res.lineMat.dispose();
      res.pulseMat.dispose();
    },
    [res],
  );

  const tmp = useMemo(() => new Vector3(), []);
  useFrame(({ clock }, delta) => {
    const reduced = useUniverse.getState().reducedMotion;
    const targetOpacity = visible ? 1 : 0;
    const step = reduced ? 1 : delta * 2.5;
    const current = res.lineMat.opacity / 0.22;
    const next = current + Math.sign(targetOpacity - current) * Math.min(step, Math.abs(targetOpacity - current));
    res.lineMat.opacity = next * 0.22;
    res.pulseMat.opacity = next * 0.9;
    if (reduced) return;
    const attr = res.pulseGeo.attributes.position as BufferAttribute;
    res.curves.forEach((curve, c) => {
      for (let k = 0; k < PULSES_PER_LINK; k++) {
        const t = (clock.elapsedTime * 0.12 + k / PULSES_PER_LINK) % 1;
        curve.getPoint(t, tmp);
        attr.setXYZ(c * PULSES_PER_LINK + k, tmp.x, tmp.y, tmp.z);
      }
    });
    attr.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={res.lineGeo} material={res.lineMat} raycast={noRaycast} />
      <points geometry={res.pulseGeo} material={res.pulseMat} raycast={noRaycast} />
    </group>
  );
}
