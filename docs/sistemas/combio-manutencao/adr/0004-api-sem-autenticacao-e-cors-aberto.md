# 0004 — Expor a API sem autenticação e com CORS aberto

- **Status:** retroativo
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

O frontend roda em `localhost:4200` e a API em `localhost:3000`, origens diferentes (`frontend/src/environments/environment.ts:2`, `backend/src/main.ts:25`). O uso documentado é local e didático (`README.md:18-36`).

## Decisão

- `app.enableCors()` sem opções, aceitando qualquer origem (`backend/src/main.ts:8`).
- Nenhum mecanismo de autenticação ou autorização: não há guards, middlewares de auth nem dependências de auth (`backend/package.json:19-31`).

## Alternativas

- CORS restrito à origem do frontend — hipótese.
- Proxy do `ng serve` para a API, eliminando CORS — hipótese.
- Autenticação por JWT/SSO corporativo — hipótese.

## Consequências

- Positivas: nenhuma configuração para rodar localmente.
- Negativas / riscos: qualquer cliente que alcance a porta 3000 lê e altera todos os dados; nenhum registro de autoria das mudanças (R3). Inaceitável em ambiente compartilhado.

## Evidência

- `backend/src/main.ts:8` — CORS aberto.
- `backend/src/*/*.controller.ts` — nenhum `@UseGuards`.
