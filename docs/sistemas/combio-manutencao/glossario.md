# Glossário — combio-manutencao

| Termo | Definição | Onde aparece |
| --- | --- | --- |
| Combio | Empresa de energia por biomassa dona das usinas | `package.json:5`, `README.md:3` |
| UPV | Usina da Combio. Expansão da sigla [a confirmar]. Entidade com `nome`, `cidade`, `estado`, `capacidadeMw` | `backend/src/upvs/upv.entity.ts`, `frontend/src/app/models.ts:1-7` |
| capacidadeMw | Capacidade da UPV em megawatts (`float`, >= 0) | `backend/src/upvs/upv.entity.ts:18-19`, `backend/src/upvs/dto/create-upv.dto.ts:17-20` |
| Equipamento | Ativo de uma UPV que recebe manutenção | `backend/src/equipamentos/equipamento.entity.ts` |
| Tag | Identificador do equipamento. No seed segue `<PREFIXO_UPV>-<3 letras do tipo>-01`, ex.: `LP-CAL-01` | `backend/src/equipamentos/equipamento.entity.ts:19-20`, `backend/src/seed.ts:123` |
| Tipo de equipamento | `caldeira`, `turbina`, `esteira`, `gerador`, `bomba` | `backend/src/equipamentos/equipamento.entity.ts:11-12` |
| Ordem de manutenção (OM) | Registro de um serviço de manutenção em um equipamento. Classe `OrdemManutencao` | `backend/src/ordens/ordem-manutencao.entity.ts` |
| Número da ordem | Código informado na criação; no seed, `OM-NNNNN`. Sem unicidade no banco | `backend/src/ordens/ordem-manutencao.entity.ts:12-13`, `backend/src/seed.ts:140` |
| Preventiva | Tipo de ordem: manutenção planejada antes da falha | `backend/src/ordens/ordem-manutencao.entity.ts:4` |
| Corretiva | Tipo de ordem: manutenção após falha | `backend/src/ordens/ordem-manutencao.entity.ts:4` |
| Preditiva | Tipo de ordem: manutenção guiada por monitoramento de condição | `backend/src/ordens/ordem-manutencao.entity.ts:4` |
| Status da ordem | `aberta`, `em_execucao`, `concluida`, `cancelada`. Toda ordem nasce `aberta` | `backend/src/ordens/ordem-manutencao.entity.ts:5`, `backend/src/ordens/ordens.service.ts:49` |
| Transição de status | Mudança de um status para outro. Hoje sem validação; regra alvo em [ADR 0006](adr/0006-maquina-de-estados-da-ordem.md) | `backend/src/ordens/ordens.service.ts:58-77` |
| Prioridade | Inteiro 1, 2 ou 3. Sentido (1 = alta) [a confirmar]; só o material de aula define | `backend/src/ordens/dto/create-ordem.dto.ts:18-22`, `aula/LAB.md:98` |
| criadaEm | Data/hora de abertura da ordem, preenchida pelo servidor | `backend/src/ordens/ordens.service.ts:52` |
| concluidaEm | Data/hora de conclusão; preenchida ao ir para `concluida` (sobrescrita por `updateStatus`) | `backend/src/ordens/ordens.service.ts:61-63,73-75` |
| custoEstimado | Custo previsto da ordem (`float`, >= 0); exibido em BRL | `backend/src/ordens/ordem-manutencao.entity.ts:38-39`, `frontend/src/app/ordens/ordem-detalhe.component.ts:21` |
| Relatório de ordens por UPV | Agregado por UPV: total de ordens, abertas, custo total. Só existe no frontend | `frontend/src/app/models.ts:29-34`, `frontend/src/app/relatorio/relatorio.component.ts` |
| Seed | Script que recria o banco com dados sintéticos determinísticos | `backend/src/seed.ts` |
| DTO | Classe de entrada da API validada com `class-validator` | `backend/src/*/dto/*.ts` |
| Swagger | Documentação OpenAPI interativa em `/api/docs` | `backend/src/main.ts:17-23` |
| `SQLITE_PATH` | Variável de ambiente com o caminho do arquivo SQLite (`:memory:` nos e2e) | `backend/src/config/database.config.ts:12` |
