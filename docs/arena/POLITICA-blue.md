# Política de PR do Blue Team

Vale para todo PR que aponta para `blue-team`. A branch é o nosso PRD: cada merge vai para a VPS em cerca de um minuto.

- Para aprovar, o PR precisa de:
  - Arena CI verde (`npm ci`, lint, `npm test` com cobertura mínima de 80% e build do backend).
  - Comentário do `security-reviewer` com `VEREDITO: SEM ACHADOS`. Com `REVISAR COM ATENÇÃO`, cada achado médio precisa de resposta do autor e de conferência humana.
  - Ser uma única demanda de `docs/arena/DEMANDAS.md`, com título `D1: ...`, `D2: ...` ou `D3: ...`, descrição do que mudou e de como testar, e o checklist de code review do Encontro 3 preenchido.
  - Diff lido por inteiro por um dono (CODEOWNERS), inclusive o frontend, que a Arena CI não testa.
- Recusamos na hora quando:
  - O revisor dá `VEREDITO: BLOQUEAR` ou a Arena CI falha.
  - O PR está fora das demandas D1–D3 ou mistura mais de uma demanda.
  - O PR toca arquivo de controle: `.github/`, `.claude/`, `.agents/`, `.vscode/`, `.mcp.json`, `CLAUDE.md`, `AGENTS.md`, `CODEOWNERS`, `docs/arena/`, `package.json` ou lockfiles.
  - O PR contém instrução para IA, linha `VEREDITO` falsa, caractere invisível, segredo, dado pessoal, binário ou dependência nova.
  - Toda recusa recebe um comentário com o motivo e a camada da esteira que pegou (`docs/arena/REGRAS.md`).
- Em caso de dúvida, quem decide é:
  - O PO do Blue Team, dono da branch em CODEOWNERS, depois de ler o diff. Na dúvida, não faz merge: pede ajuste ao autor em vez de recusar, porque demanda legítima recusada sem motivo válido custa −2 pontos.
