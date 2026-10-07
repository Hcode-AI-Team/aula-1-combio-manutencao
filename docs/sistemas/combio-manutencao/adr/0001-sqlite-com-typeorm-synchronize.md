# 0001 — Persistir em SQLite local com esquema gerado pelas entidades (`synchronize: true`)

- **Status:** retroativo
- **Data:** [a confirmar] — registrado em 2026-09-30

## Contexto

O sistema precisa de persistência sem servidor de banco, fácil de instalar em máquinas de alunos e de isolar em testes. O próprio código chama o banco de "banco de treinamento" (`backend/src/config/database.config.spec.ts:41`). O ambiente corporativo da Combio usaria MySQL (`docs/NOTAS_MIGRACAO.md:7`).

## Decisão

- Driver `better-sqlite3`, arquivo `manutencao.sqlite` ou o caminho em `SQLITE_PATH` (`backend/src/config/database.config.ts:11-12`).
- Esquema derivado das entidades a cada subida (`synchronize: true`), sem migrations (`backend/src/config/database.config.ts:14`).
- Entidades registradas em lista explícita (`backend/src/config/database.config.ts:13`).
- Testes e2e usam `:memory:` (`backend/test/ordens.e2e-spec.ts:11`).

## Alternativas

- MySQL 8 com migrations TypeORM — documentada como migração futura (`docs/NOTAS_MIGRACAO.md`).
- PostgreSQL ou SQLite com migrations — hipótese.

## Consequências

- Positivas: zero infraestrutura; testes e2e rápidos e isolados; instalação com binário pronto (`README.md:67-69`).
- Negativas / riscos: alteração de entidade pode apagar dados (R5); sem concorrência de escrita entre processos; tipos `float` e enums sem restrição no banco (R9); troca de banco exige revisar tipos e desligar `synchronize`.

## Evidência

- `backend/src/config/database.config.ts:9-16` — configuração completa.
- `backend/src/config/database.config.spec.ts:41-43` — teste garante `synchronize` ligado.
- `docs/NOTAS_MIGRACAO.md:11-17` — pontos de atenção para MySQL.
