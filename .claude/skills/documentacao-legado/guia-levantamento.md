# Guia de levantamento de sistema legado

Registre cada achado como `item | evidência (arquivo:linha ou caminho) | observação`. Achado sem evidência não entra no documento; vira pergunta em "Pendências".

## 1. Inventário de tecnologias

- Extensões de arquivo e contagem por tipo (Glob): `.p/.w/.i` (Progress), `.process`/`forms/` (Fluig), `.java`, `.cs`, `.js/.ts`, `.sql`, `.sh/.bat/.ps1`, `.xml/.properties/.ini/.pf`.
- Manifestos de dependência e versão: `pom.xml`, `package.json`, `*.csproj`, `requirements.txt`, cabeçalhos de versão, `.pf` (versão OpenEdge/bancos conectados).
- Frameworks e runtimes: o que o código importa, não o que o README diz.

## 2. Pontos de entrada

- Telas/menus, endpoints HTTP, filas consumidas, processos Fluig iniciáveis, programas batch, `main`.
- Para cada ponto: quem aciona (usuário, agendador, sistema externo) e o que dispara.

## 3. Integrações

- Procure: URLs, `ServiceManager`, clientes HTTP/SOAP, `RUN ... ON` (AppServer), FTP/SFTP, pastas compartilhadas, e-mail, arquivos de troca (CSV/TXT/XML), DB links, triggers de banco.
- Para cada integração: origem, destino, direção, formato, frequência, tratamento de erro, dono `[a confirmar]`.

## 4. Dados

- Bancos e esquemas (`.df`, DDL, `CONNECT`, datasources, `.pf`). Mascare credenciais.
- Entidades principais e quem escreve nelas (programa/processo/integração).
- Rotinas de expurgo, backup e arquivamento, se aparecerem em scripts.

## 5. Jobs e operação

- `crontab`, agendador do Windows, RPW/agendador do Datasul, `onSync` de datasets Fluig, schedulers do Fluig, scripts de start/stop.
- Logs: onde são gravados, formato, rotação. Monitoração e alertas, se houver evidência.

## 6. Configuração e implantação

- Arquivos por ambiente, variáveis de ambiente, parâmetros de inicialização, scripts de build/compilação (ex.: `COMPILE ... SAVE`), empacotamento, servidores de destino (só o nome lógico).

## 7. Segurança (visão arquitetural)

- Como o usuário se autentica e como a autorização é feita (grupo, papel, programa de segurança do ERP).
- Segredos no código ou na configuração → registrar caminho, sem reproduzir, como risco alto.
- Dados pessoais tratados e onde aparecem em log.

## 8. Perguntas para as pessoas

Só depois de esgotar o código, liste perguntas objetivas por público:
- Usuário-chave: objetivo de negócio, volume, criticidade, sazonalidade.
- Operação/infra: servidores, janelas de manutenção, incidentes recorrentes.
- Time de desenvolvimento: decisões históricas, partes que ninguém mexe e por quê.
