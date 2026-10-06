import { Canvas } from "@react-three/fiber";
import { useUniverse } from "../store/universe";
import type { Ecosystem } from "../types/catalog";
import { CAMERA, QUALITY_BUDGET } from "./config";
import { OrbitLabels } from "./OrbitLabels";
import { UniverseScene } from "./UniverseScene";

interface ExperienceCanvasProps {
  ecosystems: Ecosystem[];
  onContextLost: () => void;
}

/**
 * Camada 3D. Decorativa para tecnologias assistivas (aria-hidden):
 * toda interação possui equivalente HTML no painel/seletores.
 */
export default function ExperienceCanvas({ ecosystems, onContextLost }: ExperienceCanvasProps) {
  const quality = useUniverse((s) => s.deviceQuality);
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true" data-testid="experience-canvas">
      <Canvas
        dpr={[1, QUALITY_BUDGET[quality].dpr]}
        camera={{ fov: CAMERA.fov, position: [0, 0, CAMERA.universeDistance], near: 0.1, far: 200 }}
        gl={{ antialias: quality !== "low", powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onContextLost();
          });
        }}
        onPointerMissed={() => (document.body.style.cursor = "")}
      >
        <color attach="background" args={["#05070A"]} />
        <UniverseScene ecosystems={ecosystems} />
      </Canvas>
      <OrbitLabels />
    </div>
  );
}
