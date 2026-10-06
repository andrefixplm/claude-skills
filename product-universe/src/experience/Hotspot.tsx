import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { MathUtils, type Group, type Mesh, type Sprite, type SpriteMaterial } from "three";
import { useUniverse } from "../store/universe";
import { latLonToVector } from "./geometry";
import { getDotTexture } from "./materials";
import { noRaycast } from "./signals";

interface HotspotProps {
  domainId: string;
  latitude: number;
  longitude: number;
  color: string;
  /** Hotspots só existem visualmente quando a esfera está ativa. */
  visible: boolean;
  onSelect: (domainId: string) => void;
  onHover: (domainId: string | undefined) => void;
}

/** Marcador de domínio na superfície da esfera. Equivalente HTML: lista de domínios do painel. */
export function Hotspot({ domainId, latitude, longitude, color, visible, onSelect, onHover }: HotspotProps) {
  const group = useRef<Group>(null);
  const dot = useRef<Mesh>(null);
  const halo = useRef<Sprite>(null);
  const position = useMemo(() => latLonToVector(latitude, longitude, 1.02), [latitude, longitude]);
  const state = useRef({ show: 0, emphasis: 0 });

  useFrame(({ clock }, delta) => {
    const { activeDomain, hoveredDomain, reducedMotion } = useUniverse.getState();
    const active = activeDomain === domainId;
    const hovered = hoveredDomain === domainId;
    state.current.show = MathUtils.damp(state.current.show, visible ? 1 : 0, 8, delta);
    state.current.emphasis = MathUtils.damp(state.current.emphasis, active ? 1 : hovered ? 0.6 : 0, 8, delta);
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 3 + longitude) * 0.12;
    const e = state.current.emphasis;
    group.current?.scale.setScalar(Math.max(0.0001, state.current.show));
    dot.current?.scale.setScalar((1 + e * 0.35) * pulse);
    if (halo.current) {
      // "Ilumina a região" do domínio em foco.
      halo.current.scale.setScalar(0.22 + e * 0.75);
      (halo.current.material as SpriteMaterial).opacity = (0.35 + e * 0.45) * state.current.show;
    }
  });

  return (
    <group ref={group} position={position}>
      <sprite ref={halo} raycast={noRaycast}>
        <spriteMaterial map={getDotTexture()} color={color} transparent depthWrite={false} opacity={0.4} />
      </sprite>
      <mesh
        ref={dot}
        onClick={(e) => {
          if (!visible) return;
          e.stopPropagation();
          onSelect(domainId);
        }}
        onPointerOver={(e) => {
          if (!visible) return;
          e.stopPropagation();
          onHover(domainId);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(undefined);
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
