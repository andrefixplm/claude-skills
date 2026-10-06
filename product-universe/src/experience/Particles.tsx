import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, PointsMaterial, type Points } from "three";
import { useUniverse } from "../store/universe";
import type { DeviceQuality } from "../utils/device";
import { QUALITY_BUDGET } from "./config";
import { seeded } from "./geometry";
import { getDotTexture } from "./materials";
import { noRaycast } from "./signals";

/** Campo de partículas de fundo — quantidade definida pelo orçamento de qualidade. */
export function Particles({ quality }: { quality: DeviceQuality }) {
  const ref = useRef<Points>(null);
  const count = QUALITY_BUDGET[quality].stars;
  const { geometry, material } = useMemo(() => {
    const rand = seeded(3);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Sempre atrás das esferas: nenhuma partícula próxima da câmera.
      pos.set([(rand() - 0.5) * 90, (rand() - 0.5) * 60, -8 - rand() * 40], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    const m = new PointsMaterial({
      size: 0.16,
      map: getDotTexture(),
      color: "#9fb4d9",
      transparent: true,
      opacity: 0.55,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    return { geometry: g, material: m };
  }, [count]);
  useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material]);

  useFrame((_, delta) => {
    if (!ref.current || useUniverse.getState().reducedMotion) return;
    ref.current.rotation.y += delta * 0.006;
  });

  return <points ref={ref} geometry={geometry} material={material} raycast={noRaycast} />;
}
