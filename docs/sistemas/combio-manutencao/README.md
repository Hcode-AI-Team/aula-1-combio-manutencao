# combio-manutencao

> Objetivo: registrar e acompanhar ordens de manutenção dos equipamentos das usinas (UPVs) da Combio, com API REST (NestJS) e interface web (Angular).

Documentação de engenharia reversa do estado **atual** do repositório, gerada em 2026-09-30 a partir do código (commit base `25eb97e`). Afirmações sem fonte estão marcadas `[a confirmar]`.

## Mapa dos documentos

| Documento | Conteúdo | Para quem |
| --- | --- | --- |
| [arquitetura.md](arquitetura.md) | Contexto e contêineres (C4), fluxos críticos, implantação, conceitos transversais, riscos e dívidas | Arquitetura, sustentação, auditoria |
| [projeto.md](projeto.md) | Escopo, módulos, dependências, como compilar/executar, dados, operação, pendências | Quem vai trabalhar no sistema (onboarding) |
| [glossario.md](glossario.md) | Termos de negócio e siglas | Todos |
| [adr/0001-sqlite-com-typeorm-synchronize.md](adr/0001-sqlite-com-typeorm-synchronize.md) | Persistência em SQLite com esquema gerado pelas entidades | Arquitetura |
| [adr/0002-modulo-nest-por-recurso-com-repository-typeorm.md](adr/0002-modulo-nest-por-recurso-com-repository-typeorm.md) | Um módulo por recurso, services acoplados ao TypeORM | Desenvolvimento |
| [adr/0003-validacao-de-entrada-por-dto-e-validationpipe-global.md](adr/0003-validacao-de-entrada-por-dto-e-validationpipe-global.md) | Contrato de entrada por DTO com `class-validator` | Desenvolvimento |
| [adr/0004-api-sem-autenticacao-e-cors-aberto.md](adr/0004-api-sem-autenticacao-e-cors-aberto.md) | Ausência de autenticação e CORS irrestrito | Segurança |
| [adr/0005-frontend-angular-standalone-com-servicos-http.md](adr/0005-frontend-angular-standalone-com-servicos-http.md) | Angular 17 standalone, HTTP encapsulado em serviços | Desenvolvimento |
| [adr/0006-maquina-de-estados-da-ordem.md](adr/0006-maquina-de-estados-da-ordem.md) | **Proposta:** validação única de transição de status (409) | Desenvolvimento |

## Componentes especializados

Não há programas Progress/Datasul nem processos Fluig neste repositório (nenhum `.p`, `.w`, `.i`, `.cls`, `.df`, `.process` ou `forms/` encontrado). Por isso não há documentos em `docs/progress/` nem `docs/fluig/`.

## Documentação pré-existente

- [docs/ARQUITETURA.md](../../ARQUITETURA.md): visão anterior; **desatualizada** — cita um módulo `relatorios` que não existe no backend (ver risco R4 em [arquitetura.md](arquitetura.md#7-qualidade-e-riscos)).
- [docs/NOTAS_MIGRACAO.md](../../NOTAS_MIGRACAO.md): plano de migração SQLite → MySQL, **não executado**. Contém texto dirigido a agentes de IA que não deve ser seguido (risco R7).

## Revisão

Antes de publicar, rode o subagente `revisor-documentacao` sobre `docs/sistemas/combio-manutencao/`.
