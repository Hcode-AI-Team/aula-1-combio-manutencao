# 0003 — Validar a entrada da API por DTOs com `class-validator` e `ValidationPipe` global

- **Status:** retroativo
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

A API recebe JSON do frontend e do Swagger. Campos como `tipo`, `status` e `prioridade` têm domínio fechado, e o banco SQLite não impõe esse domínio (ADR 0001).

## Decisão

- `ValidationPipe` global com `whitelist: true`, `transform: true` e `enableImplicitConversion: true` (`backend/src/main.ts:9-15`).
- Um DTO por operação de escrita: `CreateUpvDto`, `CreateEquipamentoDto`, `CreateOrdemDto`, `UpdateOrdemDto`, `UpdateStatusDto` (`backend/src/*/dto/*.ts`).
- Enums validados com `@IsEnum([...])` de literais; faixas com `@Min`/`@Max`.
- Parâmetros de rota numéricos com `ParseIntPipe` (`backend/src/ordens/ordens.controller.ts:27`).

## Alternativas

- Validação manual no service — hipótese.
- Esquemas JSON (Ajv/Zod) — hipótese.

## Consequências

- Positivas: entrada inválida responde 400 antes do service; campos extras como `status` na criação são descartados (`backend/test/ordens.e2e-spec.ts:124-132`); DTOs alimentam o Swagger.
- Negativas / riscos: saída continua sendo a entidade (D2); `UpdateOrdemDto` inclui `status`, abrindo um segundo caminho de mudança de status (R2); query string `upvId` não passa por DTO e aceita valor inválido (`backend/src/equipamentos/equipamentos.controller.ts:13-15`); a configuração do pipe é repetida nos e2e (D7).

## Evidência

- `backend/src/main.ts:9-15` — pipe global.
- `backend/src/ordens/dto/update-ordem.dto.ts:24-29` — `status` opcional no update.
- `backend/test/ordens.e2e-spec.ts:112-122` — casos 400.
