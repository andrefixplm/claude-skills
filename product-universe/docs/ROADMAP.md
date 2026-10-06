# ROADMAP

Abordagem: do objetivo final (Digital Sales Advisor) para trás — cada fase entrega uma dependência da seguinte.

| Fase | Entrega | Status |
| ---- | ------- | ------ |
| 0 — Discovery | público, taxonomia, catálogo, branding, conteúdo | 🟡 taxonomia v1 validada; branding e curadoria de conteúdo pendentes |
| 1 — Proof of Concept | universo, 3 esferas, rotação, hover, seleção, câmera, responsivo básico | ✅ |
| 2 — SOLIDWORKS Design | esfera SOLIDWORKS, Design, Standard/Professional/Premium/Ultimate, Product Panel | ✅ (conteúdo ⚠️ pendente de validação) |
| 3 — Architecture | catálogo data-driven, router, store, CMS-ready | ✅ |
| 4 — 3DEXPERIENCE | Governance: Collaboration, BOM, Change, Release, Project | 🟡 capacidades prontas; roles pendentes (arquivo editorial) |
| 5 — DELMIA | Industrial Engineering, Manufacturing Operations, Supply Chain, Logistics | 🟡 áreas e famílias prontas; curadoria pendente |
| 6 — Digital Thread | visualização Design → Simulation → Governance → Manufacturing → Operations | 🟡 arcos no universo; visualização dedicada pendente |
| 7 — Recommendation Engine | "O que você deseja melhorar?" (Challenge → Capability → Ecosystem → Products) | ⏳ |
| 8 — Comparison | comparador de até 3 produtos com dados oficiais | ⏳ (requer matriz oficial) |
| 9 — CMS | conteúdo fora da aplicação (Directus/Strapi) | ⏳ (`buildCatalog` é o ponto de troca) |
| 10 — Analytics / Leads | funil comercial completo, CRM | 🟡 adapter `dataLayer` + formulário; backend/CRM pendentes |

## Próximos passos recomendados

1. **Curadoria de conteúdo** (PRODUCT_TAXONOMY §5) — desbloqueia Fases 4, 5 e 8.
2. **Backend de leads** (validação server-side, rate limit, anti-bot) + `VITE_LEAD_ENDPOINT`.
3. **Pré-renderização das rotas** para SEO.
4. **Medição de performance** em hardware real e calibração de `detectQuality`.
5. **CI** com o pipeline de TEST_PLAN §6.
