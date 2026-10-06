/** Parâmetros de motion e câmera (UX_SPEC.md · DOC 07). Ajuste aqui, não nos componentes. */
export const MOTION = {
  /** Rotação idle em rad/s (faixa especificada: 0.01–0.03; usamos o topo da faixa). */
  idleRotation: 0.03,
  /** Redução da rotação no hover (-40%). */
  hoverRotationFactor: 0.6,
  hoverScale: 1.05,
  hoverGlowBoost: 0.3,
  /** Constante de amortecimento ~ 300 ms para hover (faixa 250–400 ms). */
  hoverDamping: 10,
  /** Duração de seleção/foco em segundos (faixa 0.8–1.4 s). */
  selectionDuration: 1.2,
  focusDuration: 1.0,
} as const;

export const CAMERA = {
  fov: 40,
  /** Distância da câmera no universo (a escala das esferas é derivada do viewport). */
  universeDistance: 12,
  /** Preenchimento da região útil no nível ecossistema (menor = mais distante). O domínio aproxima a câmera. */
  ecosystemFill: 0.5,
  ecosystemFillMobile: 0.45,
} as const;

export const ORBIT = {
  radius: 1.3,
  nodeRadius: 0.06,
  /** Espaço (px) reservado aos rótulos HTML ao enquadrar a órbita: radiais no desktop, abaixo do nó no mobile. */
  labelMargin: { x: 122, y: 44 },
  labelMarginMobile: { x: 64, y: 40 },
} as const;

/** Orçamento por nível de qualidade (DOC 20). */
export const QUALITY_BUDGET = {
  high: { stars: 1400, networkNodes: 220, travelers: 120, industrialCells: 160, flowDots: 10, dpr: 2 },
  medium: { stars: 650, networkNodes: 140, travelers: 50, industrialCells: 90, flowDots: 6, dpr: 1.5 },
  low: { stars: 200, networkNodes: 80, travelers: 0, industrialCells: 40, flowDots: 0, dpr: 1 },
} as const;
