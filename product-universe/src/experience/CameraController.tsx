import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useUniverse } from "../store/universe";
import { Tween } from "./tween";

interface CameraControllerProps {
  position: [number, number, number];
  duration: number;
}

/**
 * Move a câmera até o enquadramento calculado pelo layout (easeInOutCubic).
 * A câmera nunca rotaciona — olha sempre para -Z; o enquadramento é feito por translação.
 * No universo, um leve parallax acompanha o ponteiro.
 */
export function CameraController({ position, duration }: CameraControllerProps) {
  const camera = useThree((s) => s.camera);
  const tween = useRef(new Tween(position));
  const parallax = useRef({ x: 0, y: 0 });

  useFrame(({ clock, pointer }, delta) => {
    const { reducedMotion, cameraMode } = useUniverse.getState();
    tween.current.set(position, reducedMotion ? 0 : duration, clock.elapsedTime);
    const [x, y, z] = tween.current.update(clock.elapsedTime) as [number, number, number];
    const enabled = cameraMode === "universe" && !reducedMotion;
    const k = Math.min(1, delta * 2);
    parallax.current.x += ((enabled ? pointer.x * 0.25 : 0) - parallax.current.x) * k;
    parallax.current.y += ((enabled ? pointer.y * 0.15 : 0) - parallax.current.y) * k;
    camera.position.set(x + parallax.current.x, y + parallax.current.y, z);
  });

  return null;
}
