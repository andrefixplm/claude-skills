# DESIGN SYSTEM

Tokens definidos em `src/styles.css` (`@theme`, Tailwind v4). Cores de ecossistema chegam à UI **pelos dados**
(`theme.primary/glow`) via variáveis CSS `--eco` / `--eco-glow`.

## 1. Cores

| Token              | Valor     | Uso |
| ------------------ | --------- | --- |
| `bg`               | `#05070A` | fundo |
| `surface`          | `#0B0E13` | painéis (82% + blur) |
| `ink`              | `#F5F7FA` | texto primário |
| `muted`            | `#9AA4B2` | texto secundário |
| `faint`            | `#5D6672` | rodapé, separadores |
| `line`             | `#1D232C` | bordas |
| `solidworks`       | `#E2231A` | primária SOLIDWORKS · secundária `#3A0806` · glow `#FF5A4F` |
| `3dexperience`     | `#00AEEF` | ⚠️ aproximada — seguir brand guideline autorizado · glow `#5FD4FF` |
| `delmia`           | `#F59E0B` | ⚠️ decisão de UX — brand guideline prevalece · glow `#FFC15A` |

## 2. Tipografia

- **Inter** (UI) — pesos 400/500/600/700. Headline hero 48 px (desktop) / 30 px (mobile), tracking apertado.
- **IBM Plex Mono** (dados, breadcrumb, eyebrows, rótulos de órbita) — uppercase, tracking 0.18–0.3 em.

## 3. Componentes

| Classe/componente | Descrição |
| ----------------- | --------- |
| `.btn-primary`    | pílula clara; glow na cor do ecossistema no hover |
| `.btn-secondary`  | pílula escura com borda; borda `--eco` no hover |
| `.chip`           | seletor/atalho (ecossistemas, relacionados) |
| `.tag`            | capacidade (mono) |
| `.eyebrow`        | rótulo superior mono na cor `--eco-glow` |
| `.panel`          | superfície translúcida (painel lateral, bottom sheet, diálogo) |
| `.list-item-link` | item navegável de domínio/solução |
| `.orbit-label`    | rótulo DOM da órbita 3D |
| `.css-sphere`     | esfera 2D do fallback |

## 4. Esferas (DOC 06)

| Ecossistema  | Visual (`theme.visual`) | Elementos | Sensação |
| ------------ | ----------------------- | --------- | -------- |
| SOLIDWORKS   | `cad`        | núcleo vermelho escuro metálico, grid lat/long técnico, wireframe parcial (icosaedro), anéis de referência | Engineering / Precision |
| 3DEXPERIENCE | `network`    | nós (Fibonacci), rede k-vizinhos, partículas trafegando pelas arestas | Connected Intelligence |
| DELMIA       | `industrial` | grid industrial, células de manufatura (instanced), anéis de produção com fluxos logísticos | Factory / Execution |

Comum: brilho Fresnel (rim + halo), hotspots de domínio, órbita de produtos.

## 5. Brand governance

Nunca alterar logos, proporções, trademarks e nomes oficiais. Não aplicar logos sobre esferas deformadas; usar
esfera simbólica + logo oficial adjacente quando necessário. O MVP usa somente nomes em texto.
