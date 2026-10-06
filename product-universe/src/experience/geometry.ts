import { EdgesGeometry, IcosahedronGeometry, Vector3 } from "three";

/** Ponto na esfera unitária a partir de latitude/longitude em graus. */
export function latLonToVector(latitude: number, longitude: number, radius = 1): Vector3 {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  return new Vector3(
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}

/** Pontos distribuídos uniformemente (espiral de Fibonacci). */
export function fibonacciSphere(count: number, radius: number): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    out.set([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius], i * 3);
  }
  return out;
}

/** Paralelos e meridianos como LineSegments. */
export function latLongGrid(parallels: number, meridians: number, radius: number, segments = 64): Float32Array {
  const pts: number[] = [];
  const push = (a: Vector3, b: Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let p = 1; p < parallels; p++) {
    const lat = -90 + (180 * p) / parallels;
    for (let s = 0; s < segments; s++) {
      push(latLonToVector(lat, (360 * s) / segments, radius), latLonToVector(lat, (360 * (s + 1)) / segments, radius));
    }
  }
  for (let m = 0; m < meridians; m++) {
    const lon = (360 * m) / meridians;
    for (let s = 0; s < segments / 2; s++) {
      const a = -90 + (180 * s) / (segments / 2);
      const b = -90 + (180 * (s + 1)) / (segments / 2);
      push(latLonToVector(a, lon, radius), latLonToVector(b, lon, radius));
    }
  }
  return new Float32Array(pts);
}

/** Wireframe de icosaedro mantendo apenas arestas que satisfazem o predicado (wireframe parcial). */
export function partialWireframe(radius: number, detail: number, keep: (mid: Vector3) => boolean): Float32Array {
  const ico = new IcosahedronGeometry(radius, detail);
  const edges = new EdgesGeometry(ico, 1);
  const src = edges.attributes.position!.array as Float32Array;
  const out: number[] = [];
  const mid = new Vector3();
  for (let i = 0; i < src.length; i += 6) {
    mid.set((src[i]! + src[i + 3]!) / 2, (src[i + 1]! + src[i + 4]!) / 2, (src[i + 2]! + src[i + 5]!) / 2);
    if (keep(mid.clone().normalize())) out.push(...src.slice(i, i + 6));
  }
  ico.dispose();
  edges.dispose();
  return new Float32Array(out);
}

/** Liga cada ponto aos `k` vizinhos mais próximos (rede de nós). Retorna pares de índices. */
export function nearestEdges(points: Float32Array, k: number, maxDistance: number): [number, number][] {
  const n = points.length / 3;
  const edges = new Set<string>();
  const result: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = points[i * 3]! - points[j * 3]!;
      const dy = points[i * 3 + 1]! - points[j * 3 + 1]!;
      const dz = points[i * 3 + 2]! - points[j * 3 + 2]!;
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (const { j, d } of dists.slice(0, k)) {
      if (Math.sqrt(d) > maxDistance) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (edges.has(key)) continue;
      edges.add(key);
      result.push([i, j]);
    }
  }
  return result;
}

/** Gerador pseudo-aleatório determinístico (visual estável entre renders e testes). */
export function seeded(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
