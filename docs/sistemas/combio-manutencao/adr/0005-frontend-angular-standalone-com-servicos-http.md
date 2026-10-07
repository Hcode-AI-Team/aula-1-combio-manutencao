# 0005 — Frontend em Angular 17 standalone, com HTTP encapsulado em serviços

- **Status:** retroativo
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

A interface tem três telas simples (lista, detalhe, relatório) consumindo a API REST.

## Decisão

- Angular 17 com componentes `standalone: true`, sem NgModules; rotas em `app.routes.ts` e providers (`provideRouter`, `provideHttpClient`) em `app.config.ts` (`frontend/src/app/app.config.ts:6-8`).
- Templates e estilos inline nos componentes (`frontend/src/app/ordens/ordens.component.ts:13-138`).
- Acesso HTTP só em `CatalogoService` e `OrdensService`, com URL base de `environment.apiUrl` (`frontend/src/app/catalogo.service.ts:11-26`, `frontend/src/app/ordens/ordens.service.ts:9`).
- Tipos da API espelhados manualmente em `models.ts`.
- Filtros de lista feitos no cliente (`frontend/src/app/ordens/ordens.component.ts:178-186`).

## Alternativas

- NgModules — hipótese.
- Cliente e tipos gerados a partir do Swagger — hipótese.

## Consequências

- Positivas: pouco código de infraestrutura; serviços testáveis com `HttpTestingController` (`frontend/src/app/*.spec.ts`).
- Negativas / riscos: tipos podem divergir do backend (D4); sem tratamento de erro HTTP (R11); filtro no cliente exige baixar todas as ordens (R8); Angular 17 fora de suporte (R12); só um arquivo de ambiente (D10).

## Evidência

- `frontend/src/app/app.routes.ts:6-11` — rotas.
- `frontend/src/app/models.ts` — tipos espelhados.
- `frontend/package.json:14-21` — versões Angular.
