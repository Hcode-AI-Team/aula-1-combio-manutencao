# Antipadrões e checklist de revisão (slide 33)

| Sintoma | Correção |
| --- | --- |
| `CLAUDE.md` ou `AGENTS.md` com centenas de linhas | rules com `paths` + skills; mire em menos de 200 linhas |
| "Sempre rode os testes" como instrução | hook ou subagente `executor-testes` |
| A mesma regra em três arquivos | `AGENTS.md` como fonte; os outros importam (`@AGENTS.md`) ou apontam |
| Agente com todas as ferramentas | lista mínima por papel (Planejador sem `edit`, revisor só `Read, Grep, Glob`) |
| Skill com `description` vaga | diga o que cobre **e quando usar** |
| "Revise tudo duas vezes" nas instruções | modelos atuais já verificam; isso só gasta turnos |
| Segredo "protegido" só por instrução | permissão `deny` + hook `PreToolUse` |
| Preferência pessoal no `CLAUDE.md` do time | `CLAUDE.local.md` (fora do git) ou `~/.claude/CLAUDE.md` |
| `CLAUDE.md` e `AGENTS.md` carregados juntos no Copilot | `chat.useClaudeMdFile: false` |

## Checklist para PR que mexe em configuração de agentes

- [ ] O arquivo novo está no escopo mais estreito possível?
- [ ] Não repete regra que já está no `AGENTS.md`?
- [ ] `tools` é o mínimo necessário para o papel?
- [ ] Não há segredo, URL interna ou dado pessoal no texto?
- [ ] A `description` de skills e agentes diz quando usar?
- [ ] Existe uma forma de provar que foi carregado (References, `/context`, log)?
