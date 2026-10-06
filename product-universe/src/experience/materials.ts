import { AdditiveBlending, BackSide, CanvasTexture, Color, FrontSide, ShaderMaterial, type Texture } from "three";

const vertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uPower;
  uniform float uHalo;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float d = abs(dot(vNormal, vView));
    float f = uHalo > 0.5 ? pow(d, uPower) : pow(1.0 - d, uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, 1.0);
  }
`;

/**
 * Brilho Fresnel barato (sem pós-processamento): `rim` contorna a esfera,
 * `halo` cria a atmosfera externa. Intensidade animada via uniform.
 */
export function createGlowMaterial(color: string, kind: "rim" | "halo"): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uColor: { value: new Color(color) },
      uIntensity: { value: 1 },
      uPower: { value: kind === "rim" ? 2.6 : 2.2 },
      uHalo: { value: kind === "halo" ? 1 : 0 },
    },
    side: kind === "rim" ? FrontSide : BackSide,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

let dotTexture: Texture | null = null;

/** Sprite circular com degradê, gerado uma única vez (sem assets externos). */
export function getDotTexture(): Texture {
  if (dotTexture) return dotTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  dotTexture = new CanvasTexture(canvas);
  return dotTexture;
}
