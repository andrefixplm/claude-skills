import { create } from "zustand";

export interface OrbitLabelItem {
  id: string;
  label: string;
}

/** Rótulos ativos por órbita (chave = ecossistema). Renderizados em DOM por <OrbitLabels />. */
export const useOrbitLabels = create<{ groups: Record<string, OrbitLabelItem[]> }>(() => ({ groups: {} }));

export const setOrbitLabels = (key: string, items: OrbitLabelItem[] | null) =>
  useOrbitLabels.setState((s) => {
    const groups = { ...s.groups };
    if (items) groups[key] = items;
    else delete groups[key];
    return { groups };
  });

/** Elementos DOM dos rótulos, posicionados a cada frame pela órbita (sem re-render React). */
export const orbitLabelElements = new Map<string, HTMLButtonElement>();
