# PRD — Product Universe

Versão 1.0 · Tipo: Landing Page / Product Explorer / Sales Experience

## 1. Visão

Experiência web premium para que o visitante compreenda **visualmente** como SOLIDWORKS, 3DEXPERIENCE e DELMIA se
relacionam ao longo do ciclo de desenvolvimento de produto.

| Esfera       | Papel                                          |
| ------------ | ---------------------------------------------- |
| SOLIDWORKS   | Engenharia e desenvolvimento de produto        |
| 3DEXPERIENCE | Colaboração, governança, processos e dados     |
| DELMIA       | Industrialização, manufatura e operações       |

Navegação progressiva: `Ecossistema → Domínio → Capacidade → Solução/Produto → Benefícios → Comparação → CTA`.

## 2. Problema

O portfólio possui muitos produtos, roles, aplicações, níveis de licenciamento e integrações. Catálogos baseados
apenas em cards geram a sensação *"existem dezenas de produtos, mas não entendi o que preciso"*. O Product Universe
deve produzir: *"entendi onde estou, qual problema preciso resolver e qual caminho tecnológico faz sentido"*.

## 3. Proposta de valor

Um **mapa interativo do Digital Thread**:
`Idea → Design → Simulation → Collaboration → Governance → Industrialization → Manufacturing → Operations`.

## 4. Usos

Geração de demanda · apresentação comercial · pré-vendas · demonstrações · eventos · apresentações remotas ·
campanhas · descoberta de soluções · educação sobre portfólio.

## 5. Personas

| Persona | Perfil                         | Busca                                                                 |
| ------- | ------------------------------ | --------------------------------------------------------------------- |
| A       | Engenharia (projetista, eng. mecânico, coordenação) | CAD, desenho, modelagem, documentação, simulação, colaboração |
| B       | Gestor de engenharia           | versões, revisão, colaboração, projetos, BOM, mudanças, liberação     |
| C       | Manufatura                     | MBOM, planejamento de processo, roteiros, work instructions, NC, robótica, fábrica digital |
| D       | Operações                      | MES/MOM, planejamento, produção, qualidade, manutenção, logística, supply chain |
| E       | Executivo                      | time-to-market, eliminar silos, conectar engenharia e manufatura, Digital Thread, Virtual Twin |

## 6. Objetivos de negócio

1. Geração de leads · 2. Solicitação de demonstração · 3. Agendamento comercial · 4. Entendimento do portfólio ·
5. Cross-selling · 6. Oportunidades de expansão · 7. Jornadas tecnológicas.

## 7. KPIs

Visitors · Product Universe Started · Sphere Selected · Domain Selected · Product Viewed · Products Compared ·
Journey Started · CTA Clicked · Demo Requested · Contact Requested · Conversion Rate · Average Exploration Depth ·
Average Session Time. Mapeamento para eventos: ver [ARCHITECTURE.md §8](./ARCHITECTURE.md#8-analytics).

## 8. Escopo do MVP (DOC 36) — status

| Item                                   | Status |
| -------------------------------------- | ------ |
| Home: header, hero, três esferas       | ✅ |
| Universo: hover, rotação, seleção      | ✅ |
| SOLIDWORKS: quatro domínios            | ✅ (Design, Simulation, Data Management, Manufacturing) |
| Design: Standard, Professional, Premium, Ultimate | ✅ (dados, pendentes de validação) |
| Product Detail: painel lateral         | ✅ |
| Navegação: breadcrumb, voltar, URL sincronizada | ✅ (+ Esc sobe um nível) |
| Responsividade desktop/tablet/mobile   | ✅ |
| Extra: formulário de lead com contexto | ✅ (US-005) |
| Extra: fallback 2D, analytics adapter, metadados por rota | ✅ |

## 9. Fora do MVP (DOC 37)

CMS completo · chatbot de IA · pricing engine · login · portal do cliente · recomendação por IA · AR/VR ·
catálogo completo · configurador complexo · **comparador** (Fase 8) · **journey engine** (Fase 7).

## 10. User stories

| ID     | História | Aceite | Status |
| ------ | -------- | ------ | ------ |
| US-001 | Como visitante, quero visualizar os ecossistemas para compreender as opções. | Três esferas visualmente distintas. | ✅ |
| US-002 | Como visitante, quero selecionar SOLIDWORKS para explorar suas soluções. | Câmera aproxima, esfera centraliza, outras ficam secundárias. | ✅ |
| US-003 | Como engenheiro, quero explorar Design para identificar o pacote adequado. | Órbita com os níveis + painel. | ✅ |
| US-004 | Como comprador, quero comparar produtos. | Comparador com dados oficiais. | ⏳ Fase 8 |
| US-005 | Como cliente, quero solicitar demonstração do produto selecionado. | Formulário com contexto automático. | ✅ (endpoint a configurar) |

## 11. Lead generation (DOC 25)

CTA principal **Solicitar demonstração**; secundário **Falar com especialista** (também previstos: Solicitar orçamento,
Receber mais informações — textos já em `site.ts`). Formulário mínimo: Nome, Empresa, E-mail, Telefone (opcional),
Área de interesse. Contexto invisível enviado: `ecosystem`, `domain`, `product`, `source_url`, `utm`
(`journey` quando a Fase 7 existir).

## 12. Visão de evolução

`Landing Page → Product Discovery Platform → Digital Sales Advisor`. O ativo de longo prazo é
**Product Graph + Capability Model + Customer Journey**; IA só depois do catálogo estruturado, sempre consultando o grafo.
