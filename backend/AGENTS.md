# AGENTS.md do Backend

Estas instruções complementam o `AGENTS.md` da raiz e se aplicam a todo o diretório `backend/`.

## Stack e princípios

- Use Node.js 20 ou superior, TypeScript e NestJS.
- Siga Clean Architecture: dependências apontam para as camadas internas.
- Não use `any`. Modele tipos explícitos e use `unknown` com refinamento quando a entrada não for confiável.
- Prefira alterações pequenas e compatíveis com os padrões existentes. Não faça refatorações sem relação com a tarefa.

## Camadas e responsabilidades

### Domain

- Concentre regras e invariantes de negócio em entidades, objetos de valor e serviços de domínio.
- Mantenha o domínio independente de NestJS, TypeORM, HTTP e banco de dados.

### Application

- Implemente cada operação de negócio como um caso de uso na camada `application`.
- Casos de uso coordenam domínio e portas, mas não conhecem detalhes de HTTP ou TypeORM.
- Defina interfaces de repositório na camada interna que as consome.

### Infrastructure

- Implemente as interfaces de repositório com adapters de infraestrutura.
- Restrinja TypeORM, SQLite e demais detalhes de persistência a essa camada.
- Não injete `Repository<T>` do TypeORM diretamente em novos casos de uso.
- Ao alterar código legado acoplado ao TypeORM, não amplie o acoplamento; faça a migração incremental para portas e adapters quando estiver no escopo da mudança.

### Presentation

- Controllers tratam apenas responsabilidades HTTP: receber parâmetros, acionar casos de uso e devolver respostas.
- Controllers não contêm regra de negócio, acesso direto à persistência ou decisões de fluxo da aplicação.
- Use DTOs para entradas e saídas da API. Valide entradas com `class-validator` e não reutilize entidades de persistência como contrato HTTP.
- Traduza erros de domínio ou aplicação para exceções HTTP na borda. Não introduza dependência de exceções do NestJS nas camadas internas.

## Implementação

- Use injeção de dependência por interfaces ou tokens para separar casos de uso de adapters.
- Preserve invariantes dentro do domínio ou do caso de uso responsável, nunca apenas no controller.
- Evite `Object.assign` em atualizações quando ele permitir alterar campos que não pertencem ao caso de uso.
- Não exponha credenciais, detalhes internos ou stack traces em mensagens de erro.
- Mantenha módulos coesos por funcionalidade e evite dependências circulares.

## Testes

- Toda alteração de comportamento deve incluir ou atualizar testes.
- Teste casos de uso de forma unitária, substituindo portas por fakes ou mocks tipados.
- Teste controllers sem duplicar nos testes as regras já cobertas nos casos de uso.
- Adicione testes de integração para adapters de persistência e testes E2E para contratos HTTP e fluxos críticos.
- Cubra caminho feliz, validação, recurso inexistente, regras inválidas e falhas relevantes.
- Preserve a cobertura global mínima de 80% para statements, branches, functions e lines.

## Validação

Execute no diretório `backend/`, conforme o alcance da mudança:

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Use `npm test` para executar a suíte completa com cobertura.

## Decisões arquiteturais

- Documente em `docs/` decisões que alterem limites de camadas, direção de dependências, contratos entre módulos, estratégia de persistência ou padrões transversais.
- Registre contexto, decisão, alternativas consideradas e consequências.
- Atualize `docs/ARQUITETURA.md` quando a visão estrutural do sistema mudar.

## Critérios de conclusão

Antes de encerrar uma tarefa, confirme que:

- regras de negócio estão fora dos controllers;
- casos de uso estão na camada `application`;
- persistência está abstraída por interfaces de repositório;
- nenhuma dependência externa vazou para o domínio;
- não foi introduzido `any`;
- testes relevantes foram escritos e passaram;
- lint e build passaram;
- decisões arquiteturais relevantes foram documentadas.
