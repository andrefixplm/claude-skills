import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, MathUtils, type Group, type MeshStandardMaterial } from "three";
import type { Ecosystem } from "../types/catalog";
import type { DeviceQuality } from "../utils/device";
import { useUniverse } from "../store/universe";
import { MOTION } from "./config";
import { Hotspot } from "./Hotspot";
import type { SphereTarget } from "./layout";
import { createGlowMaterial } from "./materials";
import { Orbit, type OrbitItem } from "./Orbit";
import { createSignals, noRaycast } from "./signals";
import { VISUALS } from "./SphereVisuals";
import { Tween } from "./tween";

export interface SphereActions {
  selectEcosystem: (id: string) => void;
  selectDomain: (id: string) => void;
  selectProduct: (id: string) => void;
  hoverEcosystem: (id: string | undefined) => void;
  hoverDomain: (id: string | undefined) => void;
  hoverProduct: (id: string | undefined) => void;
}

interface EcosystemSphereProps {
  ecosystem: Ecosystem;
  target: SphereTarget;
  /** Duração da transição para o novo alvo (0 = imediato). */
  duration: number;
  quality: DeviceQuality;
  actions: SphereActions;
}

const DEFAULT_TILT: [number, number] = [0.22, 0];
const TWO_PI = Math.PI * 2;

/**
 * Representação visual de um ecossistema. Não contém regra comercial:
 * recebe a estrutura (domínios/produtos) e o alvo de layout; lê o estado ativo do store.
 */
export function EcosystemSphere({ ecosystem, target, duration, quality, actions }: EcosystemSphereProps) {
  const outer = useRef<Group>(null);
  const orient = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const coreMat = useRef<MeshStandardMaterial>(null);
  const signals = useMemo(createSignals, []);
  const motion = useRef({
    layout: new Tween([...target.position, target.scale, target.emphasis]),
    orient: new Tween(DEFAULT_TILT),
    spin: new Tween([0]),
    spinAngle: 0,
    focused: false,
    hover: 0,
  });

  const activeEcosystem = useUniverse((s) => s.activeEcosystem);
  const activeDomain = useUniverse((s) => s.activeDomain);
  const level = useUniverse((s) => s.cameraMode);
  const isActive = activeEcosystem === ecosystem.id;
  const focusedDomain = isActive ? ecosystem.domains.find((d) => d.id === activeDomain) : undefined;

  // Mantém o último domínio exibido para animar a órbita ao fechar (Back reverso).
  const [orbitDomainId, setOrbitDomainId] = useState<string | undefined>(focusedDomain?.id);
  useEffect(() => {
    if (focusedDomain) setOrbitDomainId(focusedDomain.id);
  }, [focusedDomain]);
  const orbitDomain = ecosystem.domains.find((d) => d.id === orbitDomainId);
  const orbitItems: OrbitItem[] = useMemo(
    () => orbitDomain?.products.map((p) => ({ id: p.id, label: p.shortName })) ?? [],
    [orbitDomain],
  );

  const glow = useMemo(
    () => ({ rim: createGlowMaterial(ecosystem.theme.glow, "rim"), halo: createGlowMaterial(ecosystem.theme.primary, "halo") }),
    [ecosystem.theme.glow, ecosystem.theme.primary],
  );
  useEffect(() => () => (glow.rim.dispose(), glow.halo.dispose()), [glow]);
  const coreColor = useMemo(() => new Color(ecosystem.theme.secondary), [ecosystem.theme.secondary]);

  useFrame(({ clock }, delta) => {
    const now = clock.elapsedTime;
    const m = motion.current;
    const state = useUniverse.getState();
    const reduced = state.reducedMotion;
    signals.reducedMotion = reduced;

    // Layout (posição/escala/destaque) — easeInOutCubic.
    m.layout.set([...target.position, target.scale, target.emphasis], reduced ? 0 : duration, now);
    const [x, y, z, scale, emphasis] = m.layout.update(now) as [number, number, number, number, number];

    // Hover: escala +5%, brilho +30%, rotação -40% (somente no universo).
    const hovered = state.hoveredEcosystem === ecosystem.id && target.interactive;
    m.hover = MathUtils.damp(m.hover, hovered ? 1 : 0, MOTION.hoverDamping, delta);
    const hoverScale = state.cameraMode === "universe" ? 1 + (MOTION.hoverScale - 1) * m.hover : 1;

    // Flutuação sutil no universo ("esferas flutuando").
    const float = state.cameraMode === "universe" && !reduced ? Math.sin(now * 0.6 + x) * 0.05 * scale : 0;
    outer.current?.position.set(x, y + float, z);
    outer.current?.scale.setScalar(Math.max(0.0001, scale * hoverScale));
    signals.emphasis = emphasis;
    signals.glow = 1 + MOTION.hoverGlowBoost * m.hover;

    // Foco de domínio: gira a esfera para enquadrar o hotspot do domínio.
    const focus = focusedDomain?.spherePosition;
    const focusDuration = reduced ? 0 : MOTION.focusDuration;
    if (focus && !m.focused) {
      m.focused = true;
      m.spin.value = [m.spinAngle];
      m.spin.set([m.spinAngle], 0, now);
      m.spin.set([Math.round(m.spinAngle / TWO_PI) * TWO_PI], focusDuration, now);
    } else if (!focus && m.focused) {
      m.focused = false;
    }
    m.orient.set(
      focus ? [MathUtils.degToRad(focus.latitude), -MathUtils.degToRad(focus.longitude)] : DEFAULT_TILT,
      focusDuration,
      now,
    );
    const [rx, ry] = m.orient.update(now) as [number, number];
    orient.current?.rotation.set(rx, ry, 0, "XYZ");

    if (m.focused) {
      m.spinAngle = m.spin.update(now)[0] ?? 0;
    } else if (!reduced) {
      m.spinAngle += MOTION.idleRotation * delta * (1 - (1 - MOTION.hoverRotationFactor) * m.hover);
    }
    spin.current?.rotation.set(0, m.spinAngle, 0);
    signals.focus = MathUtils.damp(signals.focus, m.focused ? 1 : 0, 4, delta);

    // Núcleo e brilho acompanham o destaque.
    if (coreMat.current) {
      coreMat.current.color.copy(coreColor).multiplyScalar(0.35 + 0.65 * emphasis);
      coreMat.current.emissiveIntensity = 0.07 * emphasis * signals.glow;
    }
    glow.rim.uniforms.uIntensity!.value = 0.9 * emphasis * signals.glow;
    glow.halo.uniforms.uIntensity!.value = 0.55 * emphasis * signals.glow;
  });

  const Visual = VISUALS[ecosystem.theme.visual];
  const hotspotsVisible = isActive && level !== "universe";
  const orbitOpen = isActive && Boolean(focusedDomain) && (level === "domain" || level === "product");

  return (
    <group ref={outer}>
      <group ref={orient}>
        <group ref={spin}>
          <mesh
            onClick={(e) => {
              if (!target.interactive) return;
              e.stopPropagation();
              if (!isActive) actions.selectEcosystem(ecosystem.id);
            }}
            onPointerOver={(e) => {
              if (!target.interactive) return;
              e.stopPropagation();
              actions.hoverEcosystem(ecosystem.id);
              if (!isActive) document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              if (useUniverse.getState().hoveredEcosystem === ecosystem.id) actions.hoverEcosystem(undefined);
              document.body.style.cursor = "";
            }}
          >
            <sphereGeometry args={[1, quality === "low" ? 32 : 64, quality === "low" ? 32 : 64]} />
            <meshStandardMaterial
              ref={coreMat}
              color={ecosystem.theme.secondary}
              emissive={ecosystem.theme.primary}
              emissiveIntensity={0.07}
              metalness={0.65}
              roughness={0.38}
            />
          </mesh>
          <Visual theme={ecosystem.theme} quality={quality} signals={signals} />
          {ecosystem.domains.map((d) =>
            d.spherePosition ? (
              <Hotspot
                key={d.id}
                domainId={d.id}
                latitude={d.spherePosition.latitude}
                longitude={d.spherePosition.longitude}
                color={ecosystem.theme.glow}
                visible={hotspotsVisible}
                onSelect={actions.selectDomain}
                onHover={actions.hoverDomain}
              />
            ) : null,
          )}
        </group>
      </group>
      <mesh material={glow.rim} raycast={noRaycast}>
        <sphereGeometry args={[1.005, 48, 48]} />
      </mesh>
      <mesh material={glow.halo} raycast={noRaycast}>
        <sphereGeometry args={[1.38, 48, 48]} />
      </mesh>
      {orbitItems.length > 0 && (
        <Orbit
          groupKey={ecosystem.id}
          items={orbitItems}
          open={orbitOpen}
          color={ecosystem.theme.glow}
          onSelect={actions.selectProduct}
          onHover={actions.hoverProduct}
        />
      )}
    </group>
  );
}
