# Modelo de documentação de projeto

Copie a estrutura abaixo em `docs/sistemas/<sistema>/projeto.md`. É o documento de "como trabalhar com o sistema"; a arquitetura fica em `arquitetura.md`.

````markdown
# Projeto — <sistema>

> Objetivo: <uma frase>.

## Escopo

- **Faz:** <capacidades, em lista>.
- **Não faz:** <limites conhecidos, o que fica em outro sistema>.

## Partes interessadas

| Papel | Área / pessoa | Responsabilidade |
| --- | --- | --- |
| Dono de negócio | [a confirmar] | |
| Sustentação técnica | [a confirmar] | |

## Módulos

| Módulo | Finalidade | Tecnologia | Documentação |
| --- | --- | --- | --- |
| Pedidos | ... | Progress | [docs/progress/esxx001.md](../../progress/esxx001.md) |

## Dependências

| Dependência | Versão | Uso | Evidência | Situação (suportada/fim de vida/[a confirmar]) |
| --- | --- | --- | --- | --- |

## Como compilar, executar e implantar

Comandos e passos exatamente como aparecem em scripts do repositório, com o caminho do script. Passos que dependem de conhecimento tácito → `[a confirmar]`.

## Dados

| Banco / esquema | Conteúdo principal | Quem escreve | Retenção |
| --- | --- | --- | --- |

## Operação

| Rotina / job | Agenda | O que faz | Em caso de falha | Evidência |
| --- | --- | --- | --- | --- |

Logs e monitoração: onde estão e o que observar.

## Riscos

Resumo dos riscos de severidade alta, com link para `arquitetura.md#7-qualidade-e-riscos`.

## Pendências

- [a confirmar] <pergunta> — quem responde: <papel>
````
