# Checklist de performance Fluig

Para cada item encontrado, registre `arquivo:linha`, o padrão, o risco e a sugestão. Sem evidência no código, não registre.

| # | Padrão a procurar | Risco | Sugestão | Severidade típica |
| --- | --- | --- | --- | --- |
| F01 | `DatasetFactory.getDataset(nome, null, null, null)` em dataset grande | Traz todos os registros e colunas | Passar constraints e lista de campos | alta |
| F02 | `getDataset` dentro de loop (por linha de pai-filho, por usuário) | N consultas por tarefa | Uma consulta com constraints `SHOULD`/`IN` e mapa em memória | alta |
| F03 | Dataset customizado que consulta serviço/banco externo a cada chamada, usado em zoom ou `displayFields` | Tela lenta e carga no ERP | Dataset sincronizado (`onSync`) ou cache | média |
| F04 | Chamada síncrona a serviço externo em `beforeTaskSave`/`beforeStateEntry` sem timeout | Tarefa trava para o usuário; falha bloqueia o envio | Mover para atividade de serviço (`servicetask`) com tentativas | alta |
| F05 | Integração crítica sem tratamento de erro (`try/catch` ausente ou `catch` vazio) | Falha silenciosa, dado inconsistente | Tratar, registrar e decidir rota | alta |
| F06 | Lógica pesada ou `getDataset` em `displayFields`/`enableFields` | Executa a cada abertura do formulário | Pré-calcular em evento de processo e gravar em campo | média |
| F07 | Tabela pai-filho com centenas de linhas percorrida com `hAPI.getCardValue` campo a campo | Muitas leituras | `hAPI.getCardData` uma vez | média |
| F08 | `log.info` com o formulário inteiro ou dentro de loop | Log volumoso, exposição de dados pessoais | Logar id e resumo; nível `debug` | baixa |
| F09 | Scripts de front (HTML/JS do form ou widget) carregando bibliotecas por CDN a cada acesso ou chamando REST em `keyup` | Latência e excesso de requisições | Debounce, cache, bibliotecas do servidor | baixa |
| F10 | Dataset sincronizado com `onSync` completo (sem incremental por `lastSyncDate`) | Sincronização longa | Sincronização incremental | média |
| F11 | Anexos/documentos grandes manipulados em evento de processo | Memória e tempo do servidor | Processar fora do evento ou em serviço | média |

## Como evidenciar

- Cite o trecho e a atividade/evento em que roda (ex.: `beforeTaskSave` em `5 – Aprovar gestor`).
- Volume de registros, tempo de resposta e frequência só com dado medido; sem dado, `[a confirmar: volume do dataset X]`.
