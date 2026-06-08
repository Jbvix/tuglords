# 💡 Sugestões Futuras — TUGLORDS

Backlog de ideias aprovadas para implementação **posterior** (não implementadas ainda).

---

## 1. Painel lateral direito — Mercado & Notícias (dashboard dinâmico)

Adicionar, na **lateral direita** da tela de jogo, um painel com gráficos e
movimentações em tempo real do mundo do jogo:

- 📈 **Bolsa de Valores** — gráfico e movimentações (preços das ações/ativos,
  variação por turno, alta/baixa).
- ⛽ **Preço do Combustível** — cotação atual e histórico (impacta custos).
- 🔧 **Operações** — atividade de oficinas/serviços.
- 🚢 **Movimentações Portuárias** — fluxo dos portos (volume/atividade).
- 📰 **Notícias** — eventos/manchetes que **interferem nos valores dos ativos
  para mais ou para menos** (ex.: "Greve no Porto de Santos → aluguéis caem",
  "Alta do diesel → taxas das oficinas sobem"). As notícias devem efetivamente
  alterar os valores (preço de ações, combustível, aluguéis, taxas).

**Notas de implementação (rascunho):**
- Reaproveitar a 3ª coluna do grid do desktop (hoje removida) como host do
  dashboard, e um painel deslizante no mobile.
- Modelar um "estado de mercado" em `state.js` (preços, tendências, fila de
  notícias) atualizado por turno / por evento.
- Gráficos: pode começar com mini-sparklines em SVG/canvas leve (sem libs
  pesadas), mantendo o padrão atual de CSS + estilos inline.

---

## 2. Tela de Administração Interna do Banco

Apresentar uma tela/visão de **administração interna do banco** (back-office),
distinta do terminal do jogador. Possíveis conteúdos:

- Visão consolidada de empréstimos do jogo (ativos, vencimentos, inadimplência).
- Juros, caixa do banco, indicadores.
- Controles administrativos do sistema bancário.

> Detalhar escopo/regras desta tela antes de implementar.

---

_Registrado em 2026-06-08 a pedido do autor (Jossian Brito)._
