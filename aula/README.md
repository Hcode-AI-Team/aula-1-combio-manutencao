# Master Class — Agentes no ambiente de desenvolvimento (Copilot × Claude Code)

4 horas com lab guiado. Você configura o GitHub Copilot (`.github/`, `.vscode/`) e o Claude Code (`.claude/`, `CLAUDE.md`, `AGENTS.md`) neste repositório e usa os dois para entregar a máquina de estados das ordens de manutenção.

## Material

| Arquivo | Para quem | O que é |
| --- | --- | --- |
| [slides/master-class-agentes.pdf](slides/master-class-agentes.pdf) | todos | deck da aula (34 slides) |
| [LAB.md](LAB.md) | alunos | passo a passo: Missão 0, Partes A, B e C, com o conteúdo de cada arquivo |
| [kit/hooks/](kit/hooks/) | alunos | scripts dos hooks para copiar na Missão 8 |
| [referencia/matriz-equivalencia.md](referencia/matriz-equivalencia.md) | todos | onde cada primitiva mora em cada ferramenta |
| [referencia/ataques-e-defesas.md](referencia/ataques-e-defesas.md) | todos | os 4 ataques e as camadas de defesa |
| [referencia/antipadroes.md](referencia/antipadroes.md) | todos | antipadrões e checklist de revisão |
| `roteiro-instrutor.md` | instrutor | só na branch `gabarito/masterclass` |

## Agenda

| Horário | Bloco | Min |
| --- | --- | --- |
| 00:00 | Abertura e setup do lab (Missão 0) | 15 |
| 00:15 | Fundamentos: contexto, primitivas, escopos | 25 |
| 00:40 | GitHub Copilot: `.github` e `.vscode` | 25 |
| 01:05 | Lab A — Copilot (Missões 1 a 4) | 45 |
| 01:50 | Intervalo | 10 |
| 02:00 | Claude Code: `.claude`, `CLAUDE.md`, `AGENTS.md` | 25 |
| 02:25 | Lab B — Claude Code (Missões 5 a 8) | 40 |
| 03:05 | Lab C — a feature ponta a ponta nas duas ferramentas | 40 |
| 03:45 | Convergência, segurança e encerramento | 15 |

## Pré-requisitos

Os mesmos do [README do projeto](../README.md), mais:

- VS Code com a extensão GitHub Copilot Chat (modo Agent habilitado)
- [Claude Code](https://docs.claude.com/en/docs/claude-code) instalado e logado

## Branches

- `main`: ponto de partida dos alunos, com `CLAUDE.md` e `copilot-instructions.md` vazios.
- `gabarito/masterclass`: lab finalizado, um commit por missão com as tags `aula/m1` a `aula/m8` e `aula/lab-c`.
