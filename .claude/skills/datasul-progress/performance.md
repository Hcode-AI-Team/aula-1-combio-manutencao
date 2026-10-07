# Checklist de performance ABL

Para cada item encontrado, registre `arquivo:linha`, o padrão, o risco e a sugestão. Sem evidência no código, não registre.

| # | Padrão a procurar | Risco | Sugestão | Severidade típica |
| --- | --- | --- | --- | --- |
| P01 | `FIND`/`FOR EACH` de leitura sem `NO-LOCK` | Lock compartilhado, contenção entre usuários | Adicionar `NO-LOCK` quando não há atualização | média |
| P02 | `EXCLUSIVE-LOCK` mantido durante tela, `PAUSE`, `UPDATE` ou chamada remota | Lock longo, travamento de outros processos | Ler `NO-LOCK`, reler com lock só no bloco de gravação | alta |
| P03 | Transação abrangendo o programa inteiro ou loop grande | Before-image cresce, rollback caro, locks acumulados | Transação por registro/lote em `DO TRANSACTION` | alta |
| P04 | `WHERE` que não casa com índice (campo sem índice, função no campo, `MATCHES`, `BEGINS` fora do prefixo) | `WHOLE-INDEX`, leitura da tabela inteira | Ajustar `WHERE` ao índice ou propor índice | alta |
| P05 | `USE-INDEX` forçando índice que não atende o `WHERE` | Varredura desnecessária | Remover e deixar o compilador escolher | média |
| P06 | `FIND FIRST`/`LAST` só para testar existência | Leitura de registro desnecessária | `CAN-FIND` | baixa |
| P07 | `FOR EACH` aninhado sem `OF`/`WHERE` indexado no filho | Custo N×M | Join indexado ou pré-carga em temp-table | alta |
| P08 | `QUERY` dinâmica (`QUERY-PREPARE`) montada por concatenação | Plano ruim e risco de injeção de predicado | `QUOTER()` nos valores, índice explícito no predicado | média |
| P09 | `RUN ... ON hServer` / chamada de BO dentro de loop | Round-trip por registro | Passar lote em temp-table/dataset | alta |
| P10 | Temp-table grande sem `INDEX` usada em `FIND`/`FOR EACH` | Varredura em memória/disco | Definir índice compatível com a busca | média |
| P11 | Procedure `PERSISTENT` ou handle dinâmico sem `DELETE PROCEDURE`/`DELETE OBJECT` | Vazamento de memória em sessão longa/AppServer | Liberar em `FINALLY` ou ao fim | média |
| P12 | `BREAK BY` / `SORT` em volume alto sem índice correspondente | Ordenação em disco | Usar índice na ordem desejada | baixa |
| P13 | Acesso campo a campo em buffer de outro banco dentro de loop | Tráfego de rede cliente-servidor | `FIELDS(...)` na leitura, processar no AppServer | média |

## Como evidenciar

- Com compilador disponível: `COMPILE <prog> XREF <arq>.xrf` e procurar `SEARCH ... WHOLE-INDEX` e `ACCESS`. Cite o xref como evidência.
- Sem compilador: registre o item como "suspeita — não verificado com XREF" e indique o índice que precisa ser conferido no `.df` (`ADD INDEX`), se o `.df` estiver disponível.
- Nunca afirme tempo de execução ou volume sem dado medido; volume desconhecido vira `[a confirmar: volume da tabela]`.
