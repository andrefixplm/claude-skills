/** Sinais mutáveis por esfera, escritos a cada frame pela esfera e lidos pelos visuais (sem re-render). */
export interface SphereSignals {
  /** 0..1 — destaque da esfera (secundárias ficam esmaecidas). */
  emphasis: number;
  /** Multiplicador de brilho (hover). */
  glow: number;
  /** 0..1 — quanto a esfera está em foco de domínio (desacelera os fluxos). */
  focus: number;
  reducedMotion: boolean;
}

export const createSignals = (): SphereSignals => ({ emphasis: 1, glow: 1, focus: 0, reducedMotion: false });

/** Objetos puramente decorativos não participam do raycasting. */
export const noRaycast = () => null;
