# Modelo de arquitetura técnica (arc42 enxuto + C4)

Copie a estrutura abaixo em `docs/sistemas/<sistema>/arquitetura.md`. Nenhuma seção é removida: se não se aplica, escreva "Não se aplica" e o motivo em uma linha.

````markdown
# Arquitetura — <sistema>

> Objetivo: <uma frase: o que o sistema faz e para quem>.

## 1. Objetivos e restrições

| Tipo | Descrição | Evidência |
| --- | --- | --- |
| Objetivo de negócio | ... | [a confirmar] |
| Restrição técnica | ex.: OpenEdge 11.7, Fluig 1.8 | `arquivo` |

## 2. Contexto (C4 nível 1)

```mermaid
flowchart LR
  usuario([Usuário de compras]) --> sis[<Sistema>]
  sis -->|pedidos, REST| erp[(ERP Datasul)]
  bpm[Fluig] -->|aprovação| sis
```

| Ator / sistema externo | Troca | Protocolo / formato | Evidência |
| --- | --- | --- | --- |

## 3. Contêineres (C4 nível 2)

```mermaid
flowchart TB
  subgraph Sistema
    app[App servidor<br/>tecnologia]
    db[(Banco<br/>tecnologia)]
    job[Job noturno]
  end
  app --> db
  job --> db
```

| Contêiner | Tecnologia | Responsabilidade | Comunica com | Evidência |
| --- | --- | --- | --- | --- |

Componentes detalhados: links para `docs/progress/*.md` e `docs/fluig/*.md`.

## 4. Fluxos críticos (runtime)

### 4.1 <Nome do fluxo>

```mermaid
sequenceDiagram
  actor U as Usuário
  participant F as Fluig
  participant E as Datasul
  U->>F: abre solicitação
  F->>E: servicetask9 cria pedido
  E-->>F: número do pedido
```

Passos e regras relevantes com a fonte de cada um.

## 5. Implantação

| Ambiente | Servidor lógico | Componentes | Como implanta | Evidência |
| --- | --- | --- | --- | --- |

## 6. Conceitos transversais

- **Segurança:** autenticação, autorização, segredos (sem reproduzir).
- **Erros e logs:** padrão de tratamento, onde loga, o que loga.
- **Integração:** padrão (síncrono/assíncrono, arquivo, API), retentativa, idempotência.
- **Dados:** transações, consistência entre sistemas, expurgo.

## 7. Qualidade e riscos

| Id | Risco | Severidade (alta/média/baixa) | Impacto | Evidência | Mitigação sugerida |
| --- | --- | --- | --- | --- | --- |

## 8. Dívidas técnicas

| Id | Dívida | Local | Custo de manter | Sugestão |
| --- | --- | --- | --- | --- |

## Decisões

Links para `adr/NNNN-*.md`.
````
