# 0002 — Um módulo Nest por recurso, com `Repository` do TypeORM injetado no service

- **Status:** retroativo
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

A API tem três recursos com relação hierárquica (`Upv 1—N Equipamento 1—N OrdemManutencao`). O time declarou como alvo Clean Architecture (`backend/AGENTS.md:9-37`), mas o código existente foi escrito no estilo padrão do Nest.

## Decisão

- Um diretório/módulo por recurso: `upvs`, `equipamentos`, `ordens`, cada um com entity, service, controller, module e `dto/` (`backend/src/app.module.ts:13-15`).
- Services recebem `Repository<T>` via `@InjectRepository` e lançam `NotFoundException` do Nest (`backend/src/ordens/ordens.service.ts:11-16,30`).
- Módulos que precisam de outra entidade registram o repositório dela diretamente, em vez de depender do service do outro módulo (`backend/src/ordens/ordens.module.ts:9`).
- Controllers só recebem parâmetros e delegam (`backend/src/ordens/ordens.controller.ts:21-47`).

## Alternativas

- Casos de uso na camada `application` com portas de repositório e adapters TypeORM — alvo documentado em `backend/AGENTS.md:14-41`, não implementado.
- Chamar `EquipamentosService` a partir de `OrdensService` — hipótese.

## Consequências

- Positivas: estrutura familiar para quem conhece Nest; pouco código; testes unitários com repositório mockado (`backend/src/ordens/ordens.service.spec.ts`).
- Negativas / riscos: regra de negócio acoplada ao TypeORM e ao HTTP; `OrdensModule` conhece a entidade `Equipamento` diretamente; mudança de persistência toca todos os services (D1).

## Evidência

- `backend/src/*/*.service.ts` — injeção de `Repository<T>`.
- `backend/src/ordens/ordens.module.ts:9` — `forFeature([OrdemManutencao, Equipamento])`.
- `backend/AGENTS.md:26-30` — orientação de não ampliar o acoplamento.
