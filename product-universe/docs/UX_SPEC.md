# UX SPEC — Product Universe

## 1. Fluxo principal

```
UNIVERSO ──clique esfera/card──▶ ECOSSISTEMA ──domínio──▶ DOMÍNIO ──produto──▶ PRODUTO ──CTA──▶ LEAD
   ▲                                 │                      │                    │
   └──── Voltar ao universo / breadcrumb / Esc (sobe um nível, animação reversa) ─┘
```

## 2. Telas

### 2.1 Universo (`/`)
- Fundo `#05070A`, partículas e o **fio digital** (arcos com pulsos) ligando SOLIDWORKS → 3DEXPERIENCE → DELMIA.
- Hero: eyebrow, headline, subheadline, CTAs **Explorar soluções** (foca o seletor) e **Encontre a solução ideal**
  (abre contato; a Journey Engine substituirá na Fase 7).
- Três esferas flutuando, alinhadas a três cards HTML (nome, foco — DESIGN/GOVERNANCE/MANUFACTURE —, tagline, Explorar →).
- Hover (esfera ou card, sincronizados): escala 1 → 1.05, brilho +30%, rotação −40%, card destacado.

### 2.2 Ecossistema (`/solutions/:eco`)
- Esfera ativa centralizada na área livre (à esquerda do painel); câmera aproxima (seleção 1.2 s, easeInOutCubic).
- Demais esferas encolhem para os cantos e esmaecem (continuam clicáveis) — nunca somem abruptamente.
- Hotspots dos domínios aparecem na superfície; hover na lista do painel faz o hotspot pulsar.
- Painel: tagline, nome, headline, descrição, **Domínios**, CTAs, outros ecossistemas, site oficial.

### 2.3 Domínio (`/solutions/:eco/:domain`)
1. a esfera gira até o hotspot do domínio encarar a câmera; 2. enquadra; 3. aproxima; 4. ilumina a região;
5. produtos entram em **órbita** (escalonados) com linhas discretas até a esfera.
- Painel: descrição, **Soluções** (ou estado "catálogo em curadoria"), **Capacidades**, CTAs.

### 2.4 Produto (`/solutions/:eco/:domain/:product`)
- Nó do produto destacado na órbita; demais esmaecidos. A esfera segue animada atrás.
- Painel: nome, resumo, descrição, aviso **Conteúdo em validação** + fonte, CTAs, Capacidades, Benefícios
  (se houver), Para quem, Próximo nível (`upgradesTo`), Relacionados.

### 2.5 Lead
Diálogo modal (foco preso, Esc fecha, foco retorna ao gatilho): Nome, Empresa, E-mail, Telefone (opcional), Área de
interesse. Contexto de navegação anexado automaticamente.

## 3. Motion (DOC 07)

| Situação     | Parâmetro                         | Valor |
| ------------ | --------------------------------- | ----- |
| Idle         | rotação                           | 0.03 rad/s + flutuação sutil |
| Hover        | duração / escala / brilho / giro  | ~300 ms / ×1.05 / +30% / −40% |
| Seleção      | duração, curva                    | 1.2 s, easeInOutCubic |
| Foco domínio | rotação da esfera                 | 1.0 s |
| Órbita       | entrada                           | escalonada 120 ms/nó; saída reversa |
| Back         | —                                 | sempre animação reversa (tweens retargetáveis) |
| Reduced motion | `prefers-reduced-motion`         | transições instantâneas, sem idle/parallax |

Toda animação transmite informação (seleção, foco, hierarquia) — nada decorativo bloqueia interação.

## 4. Navegação (DOC 08)

- Breadcrumb `Universo / SOLIDWORKS / Design / Premium` — todos os níveis clicáveis; `aria-current="page"` no atual.
- **← Voltar ao universo** sempre presente no painel; **Esc** sobe um nível.
- Deep linking: cada nível tem URL; slug inválido redireciona para o nível válido mais profundo.

## 5. Responsividade (DOC 19)

| Breakpoint | Largura      | Comportamento |
| ---------- | ------------ | ------------- |
| Mobile     | < 768 px     | Universo: **uma esfera** + seletor horizontal (tabs) + "Explorar X →". Níveis internos: esfera no topo, painel como **bottom sheet** (56% da altura); rótulos da órbita abaixo dos nós; CTA do header oculto (está no painel). |
| Tablet     | 768–1099 px  | Três esferas menores no universo; painel lateral `min(440px, 42vw)`; qualidade média por padrão. |
| Desktop    | ≥ 1100 px    | Experiência completa: partículas, conexões, full motion. |

## 6. Acessibilidade (DOC 22)

- Canvas `aria-hidden`; **todo hotspot/nó tem equivalente HTML** (cards, listas de domínios/soluções).
- Navegação completa por teclado; `:focus-visible` com a cor do ecossistema; skip link "Pular para o conteúdo".
- `aria-label`/`aria-labelledby`/`aria-describedby` em seletor, painel, produto e formulário; erros com `aria-invalid`.
- `prefers-reduced-motion` respeitado no 3D (store) e no CSS.
- Pendente: auditoria WCAG 2.1 AA com leitor de tela real (NVDA/VoiceOver).

## 7. Copywriting (DOC 17)

Todo texto em `src/data/content/site.ts`. Headlines por ecossistema em `src/data/ecosystems.ts`:
SOLIDWORKS "Projete. Simule. Inove." · 3DEXPERIENCE "Conecte produtos, pessoas e processos." ·
DELMIA "Planeje virtualmente. Execute no mundo real."
