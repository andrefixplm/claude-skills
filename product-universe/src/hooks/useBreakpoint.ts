import { useSyncExternalStore } from "react";
import { breakpointFor, type Breakpoint } from "../utils/device";

const subscribe = (cb: () => void) => {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
};

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, () => breakpointFor(window.innerWidth), () => "desktop");
}
