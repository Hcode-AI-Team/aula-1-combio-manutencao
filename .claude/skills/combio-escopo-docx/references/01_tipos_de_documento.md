# Os quatro tipos de documento

Layout sempre o mesmo. O que muda é o conjunto de seções, escolhido pelo público e pelo momento do projeto. **Na dúvida, pergunte qual tipo.**

O esqueleto de cada tipo já sai pronto com todas as seções:

```bash
python3 scripts/esqueleto.py --tipo melhoria|tecnico|projeto|entrega|entrega-curta --titulo "..." --versao 1.0 > spec.json
```

---

## 3.1 Escopo de Melhoria — área solicitante

Para quem **pede** a melhoria e vai dar o aceite. Linguagem de negócio, sem tabela de campos nem endpoint.

`IDENTIFICAÇÃO` (Título · Categoria: Infraestrutura/Sistema/Dados/Segurança · Sistema/Serviço afetado: Datasul │ Fluig │ Rede │ Internet │ BI · Solicitante · Área de negócio: Tesouraria │ Biomassa │ Manutenção │ TI) → `HISTÓRICO` (Criado/Atualizado/Aprovado por + datas) → `OBJETIVO` → `CENÁRIO ATUAL (AS-IS)` → `CENÁRIO PROPOSTO (TO-BE)` → `ESCOPO` (linguagem de negócio) → `CRITÉRIOS DE ACEITE`.

Eyebrow `SOLICITAÇÃO DE MELHORIA`, título `Escopo de Melhoria`, cabeçalho `ESCOPO DE MELHORIA`. Sem numeração nas faixas.

Arquivo: `Escopo_Melhoria_<Assunto>_ComBio.docx`

---

## 3.2 Escopo Técnico — integração/TI

Para a TI executar uma integração ou automação específica.

1. `IDENTIFICAÇÃO E METADADOS` — Plataforma · Solicitante · Data · Versão · Responsável Técnico TI · Anexos
2. `INFORMAÇÕES DA DEMANDA` — 2.1 Problema **com causa** (quantificado) · 2.2 Objetivo
3. `PLANEJAMENTO E ARQUITETURA` — escopo detalhado, tecnologias homologadas, **tabela de Endpoints** (`Sistema · Finalidade · Método/Endpoint · Autenticação`), parâmetros
4. `DESENVOLVIMENTO` — funcionalidades, **fluxo numerado** (gatilho → passos → erros), **diagrama** (obrigatório), tabela de Integrações
5. `HOMOLOGAÇÃO E TESTES` — unitário e integrado, casos concretos, **sempre com cenário de erro**
6. `GOVERNANÇA` — documentação, manual de parametrização, relatório de testes, cronograma, status report
7. `GO LIVE E OPERAÇÃO ASSISTIDA` — ___ dias
8. `PENDÊNCIAS`

Eyebrow e cabeçalho `ESCOPO TÉCNICO`. Arquivo: `Escopo_Tecnico_<Assunto>_ComBio.docx`

---

## 3.3 Escopo de Projeto — portfólio/estratégico

Para projeto do portfólio, com sponsor, PO, PMO, investimento e múltiplas frentes. Numeração de 1 a 19:

1. **Informações do Projeto** — Objetivo em texto (com o risco quantificado) + tabela `Campo | Valor`: Código do Projeto · Nome · Dono do Projeto (PO) · Sponsor · PMO · Responsável Técnico TI · Início Previsto · Investimento.
2. **Requisitos Funcionais** — tabela `ID | Regra de Negócio`, IDs `RN01`, `RN02`… Uma regra por linha, verificável.
3. **Requisitos Não-Funcionais** — tabela `ID | Requisito`, IDs nominais (Tempestividade, Rastreabilidade, Integridade, Auditoria, Desempenho) e critério mensurável (ex.: "desvios sinalizados até D+1").
4. **Escopo Incluído** — uma subseção `4.x` por frente: o que será feito, premissas mantidas, resultado esperado e, quando houver, investimento/horas de consultoria e os objetos afetados (ex.: `CE0404`).
5. **Fora do Escopo (explicitamente alinhado)** — tabela `Item | Descrição | Destino`. Todo item excluído aponta para onde vai.
6. **Dependências entre Projetos** — tabela `Dependência | Projeto Relacionado | Impacto | Status`, com o responsável no status.
7. **Roadmap — evolução da informação** — tabela `Fase | Período | Escopo | Projeto Responsável`.
8. **Premissas e Dependências** — tabela `Premissa | Status | Impacto`, status com marcador: `✓ Confirmado`, `⚠ Dependente (<área/pessoa>)`, `⚠ A definir`, `⚠ Condicional`, `⚠ Fase futura (<ano>)`.
9. **Processos de Negócio** — `9.1 AS-IS` e `9.2 TO-BE`.
10. **Arquitetura da Solução** — `10.1 Containers (C4)`, marcando `[Interface]` quando a entrega é de outro projeto. `10.2 ADR` — `ADR-01`, `ADR-02`… cada uma com **Contexto · Decisão · Consequências**.
11. **Integrações** — tabela `Origem | Destino | Tipo | Frequência | Descrição`.
12. **Detalhamento Técnico** — uma subseção `12.x` por item (parametrização, validação, conciliação, modelagem/ETL).
13. **Segurança, LGPD e Compliance** — classificação do dado, segregação de funções por perfil, trilha de auditoria, base legal LGPD, revisão periódica de acessos.
14. **Estratégia de Implantação** — tabela `Fase | Período | Escopo | Critério de Sucesso`, critério **numérico** quando possível.
15. **Riscos e Mitigações** — tabela `Risco | Criticidade | Mitigação`, com fallback quando o risco é de dependência.
16. **Backlog Técnico** — épicos `EP01`, `EP02`… com itens `[G|M|P] <ação> — <sistema/responsável>`.
17. **Tarefas de Acompanhamento** — tabela `Ação | Responsável | Prazo`, com o encontro de origem no título.
18. **Pendências e Dúvidas** — tabela `# | Pendência | Status`.
19. **Aprovadores** — tabela `Nome | Papel | Status | Data` (Sponsor, PO, Gerente TI). `Pendente` até haver aprovação registrada.

Subtítulo institucional: `COMBIO ENERGIA S.A. · Tecnologia da Informação · Programa: ___ · Data: ___ · Versão: ___`. Índice ligado (`"sumario": true`).
Arquivo: `Escopo_<Projeto>_v<versão>_ComBio.docx`

---

## 3.4 Relatório de Entrega — fechamento

Gerado **a partir do escopo aprovado**, ao final da execução (ou de uma fase). Mesma base de dados do escopo: mesmos IDs, mesmas metas, mesmos responsáveis — agora com resultado, evidência e aceite. Numeração de 1 a 18:

1. **Identificação da Entrega** — Projeto/Demanda (mesmo Código do escopo) · Documento de escopo de origem (nome + versão) · Solicitante/PO · Sponsor · Responsável Técnico TI · Período de execução (início e fim reais) · Data · Versão · **Status geral** (`Entregue` / `Entregue com pendências` / `Entrega parcial`).
2. **Sumário Executivo** — 5 a 8 linhas: o que foi entregue, o resultado medido, o que ficou pendente e qual decisão está sendo pedida (aceite).
3. **Resultado vs. Objetivo** — tabela `Objetivo declarado no escopo | Resultado alcançado | Evidência`.
4. **Escopo Entregue** — tabela `ID | Item | Status | Evidência`. IDs **iguais** aos do escopo. Status: `✓ Entregue`, `⚠ Entregue com ressalva`, `✗ Não entregue`. **Todo ID do escopo aparece aqui.**
5. **Requisitos Não-Funcionais — aferição** — tabela `Requisito | Critério do escopo | Medido | Situação`.
6. **Cronograma: planejado vs. realizado** — tabela `Fase | Período planejado | Período realizado | Critério de sucesso | Atingido?`, com o desvio em dias.
7. **Testes e Homologação** — tabela `Caso de teste | Tipo | Resultado | Data | Responsável`, incluindo os **cenários de erro**.
8. **Desvios em relação ao escopo** — tabela `Item | O que mudou | Motivo | Impacto | Aprovado por / quando`.
9. **Itens não entregues e destino** — tabela `Item | Motivo | Destino | Prazo`.
10. **Riscos materializados** — tabela `Risco (do escopo) | Materializou? | O que ocorreu | Ação tomada | Situação`.
11. **Pendências abertas** — tabela `# | Pendência | Dono | Prazo | Criticidade`, herdando a numeração do escopo.
12. **Operação assistida e suporte** — período (X dias, com data de saída), canal (**ServiceUP**), o que está coberto e o que não está, volume de chamados.
13. **Documentação e governança entregues** — checklist com status.
14. **Segurança e LGPD na entrega** — o que foi configurado e **quem validou**. Nunca "seguro" nem "homologado".
15. **Investimento realizado** — tabela `Previsto | Realizado | Variação | Observação`.
16. **Lições aprendidas** — tabela `O que funcionou | O que repetir | O que evitar`.
17. **Próximos passos e fases futuras** — com ano e pré-requisito.
18. **Aceite** — tabela `Nome | Papel | Status | Data`. `Pendente` até assinatura — **você nunca marca aceite**.

Eyebrow e cabeçalho `RELATÓRIO DE ENTREGA`; título = nome do projeto/demanda.
Para melhoria pequena (tipo 3.1), use `--tipo entrega-curta`: seções 1, 2, 4, 7, 9, 11, 12 e 18.
Arquivo: `Relatorio_Entrega_<Projeto>_v<versão>_ComBio.docx`

---

## Matriz rápida

| Seção | 3.1 Melhoria | 3.2 Técnico | 3.3 Projeto | 3.4 Entrega |
|---|---|---|---|---|
| Identificação / metadados | ✓ | ✓ | ✓ (PO, Sponsor, PMO, investimento) | ✓ (+ escopo de origem, status geral) |
| Sumário executivo | — | — | — | ✓ |
| AS-IS / TO-BE | ✓ | — | ✓ | — |
| Requisitos com ID (RN/RNF) | — | — | ✓ | ✓ (com status e medição) |
| Endpoints e diagrama de fluxo | — | ✓ | ✓ (se houver integração) | — |
| Fora do escopo / não entregues com destino | — | recomendado | ✓ | ✓ |
| Dependências entre projetos | — | recomendado | ✓ | — |
| ADR | — | recomendado | ✓ | ✓ (atualizadas) |
| Riscos | — | recomendado | ✓ (mitigações) | ✓ (materializados) |
| Backlog técnico (EP/G-M-P) | — | — | ✓ | ✓ (status por EP) |
| Cronograma / fases | — | ✓ | ✓ (critério de sucesso) | ✓ (planejado vs. realizado) |
| Testes | — | ✓ | ✓ | ✓ (com resultado e data) |
| Investimento | — | — | ✓ (previsto) | ✓ (realizado vs. previsto) |
| Operação assistida | — | ✓ | ✓ | ✓ (com data de saída) |
| Pendências | — | ✓ | ✓ | ✓ (com dono e prazo) |
| Aprovação / aceite | ✓ | ✓ | ✓ (aprovadores) | ✓ (aceite) |
