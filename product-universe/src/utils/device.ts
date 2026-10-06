export type DeviceQuality = "low" | "medium" | "high";

interface DeviceHints {
  width: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  coarsePointer: boolean;
  reducedMotion: boolean;
}

/** Heurística inicial de qualidade (DOC 20). Deve ser recalibrada com medições reais. */
export function detectQuality(h: DeviceHints): DeviceQuality {
  const cores = h.hardwareConcurrency ?? 4;
  const memory = h.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 2) return "low";
  if (h.coarsePointer || h.width < 1024 || cores <= 4 || h.reducedMotion) return "medium";
  return "high";
}

export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    width: window.innerWidth,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    coarsePointer: window.matchMedia?.("(pointer: coarse)").matches ?? false,
    reducedMotion: prefersReducedMotion(),
  };
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function isWebGLAvailable(): boolean {
  if (new URLSearchParams(window.location.search).get("webgl") === "0") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function breakpointFor(width: number): Breakpoint {
  if (width < 768) return "mobile";
  if (width < 1100) return "tablet";
  return "desktop";
}
