# Matriz de equivalência: Copilot × Claude Code

Onde cada primitiva mora nas duas ferramentas, e qual arquivo deste repositório é o exemplo.

## As 7 primitivas

| Primitiva | Quem ativa | Copilot (VS Code) | Claude Code | Compartilhe em | Exemplo no gabarito |
| --- | --- | --- | --- | --- | --- |
| Instrução sempre ativa | automático | `.github/copilot-instructions.md`, `AGENTS.md` | `CLAUDE.md` (+ `@AGENTS.md`) | `AGENTS.md` | `AGENTS.md`, `CLAUDE.md` |
| Instrução por caminho | arquivo casa com o glob | `.github/instructions/*.instructions.md` (`applyTo`) | `.claude/rules/*.md` (`paths`) | — (formatos diferem) | `backend-nestjs.instructions.md`, `.claude/rules/backend-nestjs.md` |
| Prompt / command | você, com `/nome` | `.github/prompts/*.prompt.md` | `.claude/commands/*.md` ou skill | — | `nova-feature.prompt.md`, `checar.md` |
| Skill | agente (pela `description`) ou `/nome` | `.github/skills/`, `.claude/skills/`, `.agents/skills/` | `.claude/skills/` | `.claude/skills/` | `regras-ordem-manutencao`, `testes-nestjs` |
| Agente / subagente | você escolhe, ou outro agente delega | `.github/agents/*.agent.md` (lê também `.claude/agents/`) | `.claude/agents/*.md` | `.claude/agents/` | Planejador, Implementador, Feature Builder, `revisor`, `executor-testes` |
| MCP | agente chama a ferramenta | `.vscode/mcp.json` (`servers`) | `.mcp.json` (`mcpServers`) | — (chaves diferem) | `.vscode/mcp.json` |
| Hook | evento do ciclo do agente | `.github/hooks/*.json` ou `.claude/settings.json` | `.claude/settings.json` | `.claude/settings.json` | `protege-segredos.mjs`, `lint-arquivo.mjs` |

## Frontmatter lado a lado

| Conceito | Copilot | Claude Code |
| --- | --- | --- |
| Escopo por caminho | `applyTo: "backend/**/*.ts"` | `paths: ["backend/**/*.ts"]` |
| Argumento do comando | `${input:nome}` + `argument-hint` | `$ARGUMENTS` + `argument-hint` |
| Ferramentas | `tools: ['read', 'edit', 'execute', 'agent']` | `tools: Read, Grep, Glob, Bash` / `allowed-tools` |
| Modelo | `model: <nome ou lista>` | `model: sonnet \| opus \| haiku \| inherit` |
| Delegação | `agents: [...]` + `handoffs:` | subagente chamado pela `description` ou por pedido explícito |

## Escopos (do mais amplo para o mais estreito)

| Escopo | Copilot | Claude Code | Versionado? |
| --- | --- | --- | --- |
| Organização | custom agents/instruções da org no GitHub | `CLAUDE.md` e settings gerenciados | não pelo dev |
| Usuário | `~/.copilot/`, settings do usuário | `~/.claude/CLAUDE.md`, `~/.claude/settings.json` | não |
| Repositório | `.github/`, `.vscode/`, `AGENTS.md` | `CLAUDE.md`, `.claude/` | sim |
| Local | — | `CLAUDE.local.md`, `.claude/settings.local.json` | não (`.gitignore`) |

No Claude Code tudo é concatenado: nada sobrescreve nada. Escolha o escopo mais estreito que resolve.

## Como provar que carregou

| Ferramenta | Comando / lugar |
| --- | --- |
| Copilot | References na resposta; botão direito no Chat → **Diagnostics** |
| Claude Code | `/context`, `/memory`, `/agents`, `/hooks`, `/permissions`, `claude --debug` |
| Ambos (hooks) | `.claude/hooks/hooks.log` |

> Nomes de chaves e campos do Copilot mudam com frequência (os antigos `.chatmode.md` viraram `.agent.md`). Confira na versão do dia pelo Diagnostics e pela documentação oficial.
