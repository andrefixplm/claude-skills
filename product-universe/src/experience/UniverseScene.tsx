import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { useExperienceActions } from "../hooks/useExperienceActions";
import { useUniverse } from "../store/universe";
import type { Ecosystem } from "../types/catalog";
import { breakpointFor } from "../utils/device";
import { CameraController } from "./CameraController";
import { MOTION } from "./config";
import { Connections } from "./Connections";
import { EcosystemSphere } from "./EcosystemSphere";
import { computeLayout } from "./layout";
import { Particles } from "./Particles";

/** Cena única: o mesmo grafo de objetos atende universo, ecossistema, domínio e produto. */
export function UniverseScene({ ecosystems }: { ecosystems: Ecosystem[] }) {
  const size = useThree((s) => s.size);
  const level = useUniverse((s) => s.cameraMode);
  const activeEcosystem = useUniverse((s) => s.activeEcosystem);
  const hoveredEcosystem = useUniverse((s) => s.hoveredEcosystem);
  const quality = useUniverse((s) => s.deviceQuality);
  const actions = useExperienceActions();

  const breakpoint = breakpointFor(size.width);
  const indexOf = (id?: string) => ecosystems.findIndex((e) => e.id === id);
  // No mobile, o universo mostra uma esfera por vez (a destacada no seletor).
  const activeIndex =
    level === "universe" ? (breakpoint === "mobile" ? Math.max(0, indexOf(hoveredEcosystem)) : -1) : indexOf(activeEcosystem);

  const viewport = useMemo(
    () => ({ width: size.width, height: size.height, breakpoint }),
    [size.width, size.height, breakpoint],
  );
  const layout = useMemo(
    () => computeLayout({ level, count: ecosystems.length, activeIndex, viewport }),
    [level, ecosystems.length, activeIndex, viewport],
  );
  const universe = useMemo(
    () => computeLayout({ level: "universe", count: ecosystems.length, activeIndex: -1, viewport }),
    [ecosystems.length, viewport],
  );
  const anchors = useMemo(() => universe.spheres.map((s) => s.position), [universe]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={1.6} />
      <directionalLight position={[-6, -2, -4]} intensity={0.6} color="#6b8cff" />
      <CameraController position={layout.camera} duration={MOTION.selectionDuration} />
      <Particles quality={quality} />
      {breakpoint !== "mobile" && (
        <Connections anchors={anchors} radius={universe.spheres[0]?.scale ?? 1} visible={level === "universe"} />
      )}
      {ecosystems.map((eco, i) => (
        <EcosystemSphere
          key={eco.id}
          ecosystem={eco}
          target={layout.spheres[i]!}
          duration={MOTION.selectionDuration}
          quality={quality}
          actions={actions}
        />
      ))}
    </>
  );
}
