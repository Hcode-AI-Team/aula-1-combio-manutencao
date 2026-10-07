# Referência de eventos e APIs do Fluig

Use para reconhecer o que o código faz e **o que documentar** em cada caso. Assinaturas e disponibilidade variam por versão do Fluig: confira sempre com o código lido. Se um item não aparecer no código e a versão não estiver clara, marque `[confirmar na versão do Fluig]`.

## Eventos de processo (`workflow/scripts/<processo>.<evento>.js`)

| Evento | Quando dispara | O que documentar |
| --- | --- | --- |
| `beforeStateEntry(sequenceId)` | Antes de entrar em uma atividade | Atividades afetadas, preparação de dados, bloqueios (`throw`) |
| `afterStateEntry(sequenceId)` | Depois de entrar em uma atividade | Notificações, atribuições, integrações disparadas |
| `beforeStateLeave(sequenceId)` / `afterStateLeave(sequenceId)` | Ao sair de uma atividade | Validações de saída, gravações |
| `beforeTaskSave(colleagueId, nextSequenceId, userList)` | Antes de salvar/enviar a tarefa | Validações que impedem o envio (mensagem do `throw`) |
| `afterTaskSave(colleagueId, nextSequenceId, userList)` | Depois de salvar | Gravações em campos, integrações |
| `beforeTaskComplete(...)` / `afterTaskComplete(...)` | Ao concluir a tarefa | Regras de conclusão, integrações pós-aprovação |
| `beforeTaskCreate(colleagueId)` / `afterTaskCreate(colleagueId)` | Criação da tarefa | Prazos, atribuições dinâmicas |
| `validateAvailableStates(iCurrentState, stateList)` | Monta a lista de próximas atividades | Rotas escondidas/liberadas e a condição |
| `afterProcessCreate(processId)` | Solicitação criada | Número da solicitação gravado em campo, integrações iniciais |
| `afterProcessFinish(processId)` | Processo finalizado | Integração final, arquivamento |
| `beforeCancelProcess(colleagueId, processId)` / `afterCancelProcess(...)` | Cancelamento | Quem pode cancelar, estornos |
| `beforeSendData` / `afterSendData` | Envio de dados do formulário | Transformações |
| `setProcess`/`setTaskComments`/`onNotify(subject, receivers, template, params)` | Notificações | Destinatários, template e gatilho |
| `servicetask<N>(attempt, message)` | Atividade de serviço `N` (automática) | Serviço chamado, tentativas, tratamento de falha |
| `subProcessCreated(processId)` | Subprocesso criado | Processo filho e dados repassados |
| `calculateAgreement(currentState, agreementData)` | Consenso em atividade conjunta | Regra de percentual/aprovação |

Variáveis de contexto comuns via `getValue(...)`: `WKNumState` (atividade atual), `WKNextState` (próxima), `WKNumProces` (nº da solicitação), `WKUser`, `WKCompany`, `WKDef` (código do processo), `WKVersDef`, `WKCompletTask`, `WKUserComment`, `WKManagerMode`. Documente qual variável decide cada ramo.

## hAPI (disponível em eventos de processo)

| Método | Uso | Documentar como |
| --- | --- | --- |
| `hAPI.getCardValue(campo)` / `hAPI.setCardValue(campo, valor)` | Lê/grava campo do formulário | Linha na matriz campo × atividade (leitura/gravação por script) |
| `hAPI.getCardData(processId)` | Lê todos os campos | Campos efetivamente usados |
| `hAPI.setTaskComments(user, processId, thread, texto)` | Comentário na solicitação | Regra de auditoria |
| `hAPI.setAutomaticDecision(atividade, usuarios, comentario)` | Força decisão automática | Regra de roteamento (RN) |
| `hAPI.getActualThread(company, processId, state)` | Thread da atividade | Atividades paralelas |
| `hAPI.getChildrenFromTable(tabela)` / `hAPI.addCardChild(tabela, mapa)` | Tabela pai-filho | Estrutura da tabela filha |
| `hAPI.listAttachments()` / `hAPI.attachDocument(...)` | Anexos | Anexos obrigatórios/gerados |
| `hAPI.startProcess(...)` | Inicia outro processo | Dependência entre processos |

## Eventos de formulário (`forms/<form>/events/*.js`)

| Evento | Quando | O que documentar |
| --- | --- | --- |
| `validateForm(form)` | Ao salvar/enviar | Validações por atividade e mensagens (`throw`) |
| `displayFields(form, customHTML)` | Ao exibir | Campos ocultos/visíveis por atividade, `form.setShowDisabledFields`, JS injetado |
| `enableFields(form)` | Ao exibir | Campos habilitados/desabilitados por atividade (`form.setEnabled`) |
| `inputFields(form)` | Antes de gravar | Normalizações e cálculos |
| `setEnable()` / scripts no HTML | No navegador | Regras de tela (máscaras, zoom, chamadas de dataset no front) |

`form.getFormMode()` (`ADD`, `MOD`, `VIEW`, `NONE`) e `getValue("WKNumState")` definem o comportamento por atividade.

## Datasets (`datasets/*.js`)

| Função | O que documentar |
| --- | --- |
| `defineStructure()` | Colunas e chave (`addColumn`, `setKey`, `addIndex`) — dataset sincronizado |
| `onSync(lastSyncDate)` | Origem dos dados, periodicidade, volume `[a confirmar]` |
| `createDataset(fields, constraints, sortFields)` | Origem (tabela, serviço, outro dataset), constraints aceitas, colunas devolvidas |
| `onMobileSync(user)` | Dados disponíveis offline |

Consumo: `DatasetFactory.getDataset(nome, campos, constraints, ordem)` e `DatasetFactory.createConstraint(campo, inicial, final, ConstraintType.MUST|SHOULD|MUST_NOT)`. Documente nome, constraints e colunas usadas.

## Integrações

- `ServiceManager.getService("<nome>")` → serviço cadastrado no Fluig (SOAP/REST). Documente nome do serviço, método, dados enviados/recebidos e tratamento de erro.
- `fluigAPI.get*Service()` (ex.: `getDocumentService`, `getUserService`) → API interna.
- `clientService` / `fluigAPI.getAuthorizeClientService()` com `invoke(...)` → REST autorizado (OAuth). Mascare `serviceCode`, chaves e tokens se aparecerem em claro.
- `log.info/warn/error` → o que é logado (atenção a dados pessoais).
