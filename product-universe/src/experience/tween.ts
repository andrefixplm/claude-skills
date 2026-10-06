export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Interpolação temporal de vetores numéricos com easeInOutCubic.
 * Retargeting parte do valor atual — a animação reversa (Back) é natural.
 */
export class Tween {
  value: number[];
  private from: number[];
  private target: number[];
  private start = 0;
  private duration = 0;

  constructor(initial: number[]) {
    this.value = [...initial];
    this.from = [...initial];
    this.target = [...initial];
  }

  set(target: number[], duration: number, now: number): void {
    if (target.every((v, i) => Math.abs(v - (this.target[i] ?? 0)) < 1e-6)) return;
    this.from = [...this.value];
    this.target = [...target];
    this.start = now;
    this.duration = duration;
  }

  update(now: number): number[] {
    const t = this.duration <= 0 ? 1 : Math.min(1, Math.max(0, (now - this.start) / this.duration));
    const e = easeInOutCubic(t);
    for (let i = 0; i < this.value.length; i++) {
      const a = this.from[i] ?? 0;
      const b = this.target[i] ?? 0;
      this.value[i] = a + (b - a) * e;
    }
    return this.value;
  }
}
