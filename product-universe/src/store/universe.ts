import { create } from "zustand";
import type { NavigationLevel } from "../services/navigation";
import type { DeviceQuality } from "../utils/device";

export interface LeadRequest {
  kind: "demo" | "contact";
}

/**
 * Estado global mínimo (DOC 10). A URL é a fonte da verdade da navegação:
 * `active*` e `cameraMode` são escritos apenas por <RouteSync />.
 */
export interface UniverseState {
  activeEcosystem?: string;
  activeDomain?: string;
  activeProduct?: string;
  cameraMode: NavigationLevel;

  /** Destaque compartilhado entre HTML e canvas (hover/foco). */
  hoveredEcosystem?: string;
  hoveredDomain?: string;
  hoveredProduct?: string;

  reducedMotion: boolean;
  deviceQuality: DeviceQuality;

  lead: LeadRequest | null;

  setHovered: (patch: Partial<Pick<UniverseState, "hoveredEcosystem" | "hoveredDomain" | "hoveredProduct">>) => void;
  openLead: (lead: LeadRequest) => void;
  closeLead: () => void;
}

export const useUniverse = create<UniverseState>((set) => ({
  cameraMode: "universe",
  reducedMotion: false,
  deviceQuality: "high",
  lead: null,
  setHovered: (patch) => set(patch),
  openLead: (lead) => set({ lead }),
  closeLead: () => set({ lead: null }),
}));
