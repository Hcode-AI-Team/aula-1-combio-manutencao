# Convenções Datasul / Progress ABL

Use para decodificar o fonte e para avaliar legibilidade. Convenções variam por cliente e versão: quando o código contradizer esta lista, vale o código, e a divergência é registrada.

## Nomenclatura

| Padrão | Significado usual |
| --- | --- |
| `xx0000.p` / `xx0000.w` | Programa do produto: 2 letras de módulo + número. `.w` = tela (AppBuilder), `.p` = procedure. |
| `es*`, `esp/`, `especificos/` | Programa **específico** (customização do cliente). Priorize a documentação destes. |
| `*rp.p` | Parte "RP" (processamento) de relatório/batch; a tela é o `.w` de mesmo número. |
| `upc/`, `*-upc.p`, `epc*` | UPC (User Program Call) / EPC (Entry Point Call): ganchos chamados pelo produto em eventos. |
| `bo*`, `dbo*`, `api*` | Business Objects e APIs do produto. |
| `tt-*` | Temp-table. `b-*`, `bf-*` = buffer. `h-*` = handle. `c-*`, `i-*`, `d-*`, `l-*`, `da-*` = variável char/int/dec/log/data. |
| `{include/i-prgvrs.i PROG VERSAO}` | Identificação de programa e versão no padrão do produto; use para preencher "Versão". |

## Estrutura de programa

- **`.w` (tela):** blocos gerados pelo AppBuilder (`&ANALYZE-SUSPEND`, `&Scoped-define`) + triggers (`ON CHOOSE OF`, `ON LEAVE OF`) + procedures internas (`local-*`, `pi-*`). A regra de negócio costuma estar em triggers e `pi-*`; o resto é layout.
- **Batch/relatório:** tela de parâmetros grava `tt-param`, que é passada ao `*rp.p`. Documente os campos de `tt-param` como entrada.
- **UPC/EPC:** recebe `p-ind-event`, `p-ind-object`, `p-wgh-object`, `p-wgh-frame`, `p-cod-table`, `p-row-table` (ou variação). Documente **qual evento** e **qual objeto** disparam a lógica.
- **Classes (`.cls`):** documente métodos públicos, propriedades e herança (`INHERITS`, `IMPLEMENTS`).

## Transação e erro

- Escopo de transação: `DO TRANSACTION`, `REPEAT`, `FOR EACH` com atualização, ou o procedimento inteiro quando não há bloco explícito. Registre onde começa e termina.
- Erros: `NO-ERROR` + `ERROR-STATUS`, `RETURN ERROR`, `UNDO, LEAVE`/`UNDO, RETURN`, `CATCH`/`FINALLY` (OO), `RowErrors` (temp-table de erros dos BOs). Documente como cada erro chega ao usuário.
- Mensagens: `MESSAGE ... VIEW-AS ALERT-BOX` ou `run utp/ut-msgs.p` (padrão do produto). Liste número/texto da mensagem nas regras.

## Legibilidade (o que apontar como dívida)

- Procedures internas com mais de ~200 linhas ou regra duplicada entre programas.
- Variáveis globais/`SHARED` e `NEW GLOBAL SHARED` (acoplamento oculto).
- Lógica de negócio dentro de trigger de tela em vez de BO/procedure reutilizável.
- `&IF`/pré-processador escondendo comportamento por ambiente.
- Código comentado extenso, "números mágicos" sem constante, nomes que não dizem o que fazem.
