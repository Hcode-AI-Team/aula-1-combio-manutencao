# 0006 — Validar transições de status da ordem em uma única função (`validarTransicao`)

- **Status:** proposta
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

Hoje qualquer status pode ir para qualquer outro, e há dois caminhos com comportamento diferente (R2):

- `PATCH /ordens/:id` → `update()` aplica o DTO com `Object.assign` e só preenche `concluidaEm` se vazia (`backend/src/ordens/ordens.service.ts:58-65`).
- `PATCH /ordens/:id/status` → `updateStatus()` troca o status e **sempre** sobrescreve `concluidaEm` ao concluir (`backend/src/ordens/ordens.service.ts:67-77`).

O teste `backend/src/ordens/ordens.service.spec.ts:194-210` registra a assimetria como "não desejável". A tela de detalhe oferece todos os status (`frontend/src/app/ordens/ordem-detalhe.component.ts:47-52`).

## Decisão

Proposta descrita no material do projeto (`aula/LAB.md:246-281,805-812`), pendente de validação do negócio:

| De \ Para | aberta | em_execucao | concluida | cancelada |
| --- | --- | --- | --- | --- |
| aberta | idempotente | permitida | permitida | permitida |
| em_execucao | permitida | idempotente | permitida | permitida |
| concluida | 409 | 409 | idempotente | 409 |
| cancelada | 409 | 409 | 409 | idempotente |

- Uma única função `validarTransicao` usada por `update()` e `updateStatus()`.
- Transição proibida → `ConflictException` (HTTP 409) com a mensagem `Transição de status inválida: <de> → <para>`.
- `concluidaEm` preenchida só na primeira conclusão, nunca sobrescrita; cancelar não a preenche.

## Alternativas

- Remover `status` do `UpdateOrdemDto` e deixar só `PATCH /ordens/:id/status` — hipótese.
- Biblioteca de máquina de estados — hipótese.
- Validação apenas no frontend — descartada: não protege a API.

## Consequências

- Positivas: histórico de manutenção confiável; comportamento igual nos dois endpoints.
- Negativas / riscos: o teste de sobrescrita de `concluidaEm` precisa mudar; ordens do seed com status finais deixam de aceitar mudanças; o frontend deve esconder transições proibidas ou tratar 409.

## Evidência

- `backend/src/ordens/ordens.service.ts:58-77` — comportamento atual.
- `backend/src/ordens/ordens.service.spec.ts:194-210` — assimetria documentada.
- `aula/LAB.md:252-263` — tabela proposta.
