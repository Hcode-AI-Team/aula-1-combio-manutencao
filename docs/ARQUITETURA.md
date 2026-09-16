# Arquitetura

Sistema de gestão de ordens de manutenção das usinas (UPVs) da Combio. O frontend Angular consome a API NestJS, que persiste dados em SQLite via TypeORM.

```mermaid
flowchart LR
  subgraph frontend [Frontend Angular]
    OrdensUI[Ordens]
    DetalheUI[Detalhe da ordem]
    RelatorioUI[Relatorio]
  end

  subgraph backend [Backend NestJS]
    UpvsMod[upvs]
    EquipMod[equipamentos]
    OrdensMod[ordens]
    RelatMod[relatorios]
  end

  subgraph dados [SQLite]
    DB[(manutencao.sqlite)]
  end

  OrdensUI --> OrdensMod
  OrdensUI --> UpvsMod
  OrdensUI --> EquipMod
  DetalheUI --> OrdensMod
  RelatorioUI --> RelatMod
  UpvsMod --> DB
  EquipMod --> DB
  OrdensMod --> DB
  RelatMod --> DB
```

## Módulos da API

- `upvs`: cadastro e consulta de usinas.
- `equipamentos`: cadastro e filtro por UPV.
- `ordens`: ciclo de vida das ordens de manutenção.
- `relatorios`: agregações para o dashboard (ordens por UPV).
