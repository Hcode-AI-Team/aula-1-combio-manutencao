# combio-manutencao

Sistema simples de gestão de ordens de manutenção de usinas (UPVs) de uma empresa de energia por biomassa.

## Pré-requisitos

Instale **antes** de clonar o projeto. Use o instalador **64-bit**. Depois de cada instalação, **feche e abra um terminal novo** — o PATH só atualiza assim.

| Ferramenta | Versão esperada | Como conferir |
| --- | --- | --- |
| [Node.js LTS](https://nodejs.org/) | 20 ou 22 ou 24 (recomendado: **24 LTS 64-bit**) | `node --version` e `npm --version` |
| [Git](https://git-scm.com/downloads) | qualquer recente | `git --version` |
| [Google Chrome](https://www.google.com/chrome/) | qualquer recente | necessário para os testes do frontend |
| [VS Code](https://code.visualstudio.com/) | qualquer recente | editor do programa |

Se você está no checklist do programa, use também a página `setup.html` (na pasta do material da imersão) para validar o ambiente passo a passo.

## Como rodar

Abra um terminal **na raiz deste repositório** (a pasta que contém este `README.md`, não `backend/` nem `frontend/`).

```bash
npm run install:all
npm run seed
npm run start:backend
```

Deixe o backend rodando e **abra um segundo terminal** na mesma pasta:

```bash
npm run start:frontend
```

- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Frontend: http://localhost:4200

Na primeira vez, o `npm run install:all` pode levar alguns minutos. Espere terminar sem erro antes de rodar o seed.

## Scripts da raiz

| Script | Descrição |
| --- | --- |
| `npm run install:all` | Instala dependências do backend e do frontend |
| `npm run start:backend` | Sobe a API NestJS em modo watch |
| `npm run start:frontend` | Sobe o Angular em http://localhost:4200 |
| `npm run seed` | Popula o SQLite com UPVs, equipamentos e ordens |
| `npm test` | Testes do backend (unitários + e2e) e do frontend |
| `npm run lint` | Lint do backend e do frontend |

## Deu erro?

**PowerShell: "running scripts is disabled"**

O Windows está bloqueando scripts do npm. Abra o PowerShell **como o seu usuário** (não precisa ser administrador) e rode:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Feche o terminal, abra outro e tente de novo. Alternativa: use o **Git Bash** em vez do PowerShell.

**`EBADENGINE` / "engine node"**

A versão do Node é antiga demais. Instale o [Node.js LTS 64-bit](https://nodejs.org/), feche o terminal, abra outro e confira com `node --version` (precisa ser `v20`, `v22` ou `v24`).

**Erro ao instalar `better-sqlite3` / `node-gyp` / "Could not find any Visual Studio"**

Esse pacote vem com binário pronto. Se o npm tenta **compilar**, o Node está errado (32-bit, versão não suportada, ou instalação incompleta). Não instale Visual Studio por causa disso.

1. Desinstale o Node e instale o **LTS 64-bit** de https://nodejs.org/
2. Feche todos os terminais
3. Na raiz do projeto:

```bash
rm -rf backend/node_modules frontend/node_modules
npm run install:all
```

No PowerShell, no lugar do `rm -rf`:

```powershell
Remove-Item -Recurse -Force backend/node_modules, frontend/node_modules -ErrorAction SilentlyContinue
npm run install:all
```

**Porta 3000 ou 4200 já em uso (`EADDRINUSE`)**

Algum processo antigo ficou aberto. Feche o terminal onde o servidor está rodando (Ctrl+C) e tente de novo. Se persistir, reinicie o computador ou mate o processo que está na porta.

**Troquei de branch e o projeto quebrou**

Dependências podem ter mudado. Apague `backend/node_modules` e `frontend/node_modules` e rode `npm run install:all` de novo.

**`npm run seed` ou `npm run start:backend` não encontra o comando**

Você não está na raiz do repositório. Dê `cd` até a pasta que contém este `README.md` (e os diretórios `backend/` e `frontend/`).
