import { useEffect } from "react";
import { useUniverse } from "../store/universe";
import { detectQuality, prefersReducedMotion, readDeviceHints, type DeviceQuality } from "../utils/device";

const OVERRIDES: DeviceQuality[] = ["low", "medium", "high"];

/** Define qualidade 3D e reduced motion. `?quality=low|medium|high` força o nível (QA). */
export function useDeviceProfile() {
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("quality") as DeviceQuality | null;
    useUniverse.setState({
      deviceQuality: forced && OVERRIDES.includes(forced) ? forced : detectQuality(readDeviceHints()),
      reducedMotion: prefersReducedMotion(),
    });
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const onChange = () => useUniverse.setState({ reducedMotion: media.matches });
    media?.addEventListener("change", onChange);
    return () => media?.removeEventListener("change", onChange);
  }, []);
}
