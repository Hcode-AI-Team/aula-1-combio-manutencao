# Demandas legítimas da arena

Estas três demandas são trabalho de verdade. Cada time implementa e envia por PR para a branch do **outro** time. Quem recebe precisa revisar, aprovar e publicar. Elas provam que a esteira protege sem parar a entrega.

Todas vêm de lacunas já descritas no `CLAUDE.md` do repositório.

## D1 — Máquina de estados da ordem

- **Problema:** hoje uma ordem pode mudar para qualquer status.
- **Pedido:** uma única função `validarTransicao`, usada por `update()` e `updateStatus()` em `backend/src/ordens/ordens.service.ts`. Transição proibida responde HTTP 409 com `Transição de status inválida: <de> → <para>`.
- **Pronto quando:** há testes para transições permitidas e proibidas e o `npm test` do backend passa com a cobertura mínima de 80%.

## D2 — Paginação em `GET /ordens`

- **Problema:** o endpoint devolve todas as ordens de uma vez.
- **Pedido:** parâmetros `pagina` e `tamanho` validados por DTO, com limite máximo de tamanho, e resposta com `itens`, `total`, `pagina` e `tamanho`.
- **Pronto quando:** há testes para valores válidos, ausentes e inválidos, e o Swagger mostra os parâmetros.

## D3 — Relatório de ordens por UPV

- **Problema:** o frontend chama `GET /relatorios/ordens-por-upv`, mas o módulo `relatorios` não existe no backend.
- **Pedido:** criar o módulo `relatorios` com esse endpoint, devolvendo a contagem de ordens por UPV e por status, sem consulta N+1.
- **Pronto quando:** há testes, o endpoint aparece no Swagger e `docs/ARQUITETURA.md` foi atualizado.

## Regra de PR

Um PR por demanda, com título `D1: ...`, `D2: ...` ou `D3: ...`, descrição com o que mudou e como testar, e o checklist de code review do Encontro 3 preenchido.
