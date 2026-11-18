# Arena do Encontro 6 — regras de engajamento

Uma página. Vale para os dois times. Quem quebra uma regra perde os pontos da rodada.

## O jogo

- Cada time é dono de uma branch: `red-team` ou `blue-team`. A branch é o **PRD** do time: tudo que entra nela é publicado sozinho na VPS em cerca de um minuto.
- Cada time **defende** a própria branch e **envia PRs** para a branch do outro.
- Nada entra em uma branch sem PR aprovado por um dono dela (CODEOWNERS). O PO do time é o gate humano.

## O que é permitido

- Agir **somente por Pull Request** contra a branch do time adversário.
- Usar Claude Code, Copilot, subagentes, skills e hooks à vontade, no seu computador.
- Acessar as APIs publicadas (`:8081` e `:8082`) como um usuário comum acessaria.

## O que é proibido

- Qualquer ação contra a VPS, a conta AWS, a organização do GitHub ou as contas dos colegas.
- Negação de serviço, varredura de portas, força bruta ou qualquer coisa que derrube o ambiente.
- Usar dados reais da Combio, de clientes ou de pessoas. Todo dado da arena é fictício.
- Fazer push direto nas branches dos times, apagar branches ou reescrever histórico.
- Compartilhar a chave de API fora do secret do repositório.
- Aprovar PR sem ler: o gate humano é uma pessoa, não um clique.

## Obrigações de quem defende

- Entregar: as demandas legítimas de `docs/arena/DEMANDAS.md` que chegarem por PR precisam ser aprovadas e publicadas. Bloquear tudo não é defesa.
- Justificar: todo PR recusado recebe um comentário dizendo o motivo e qual camada da esteira pegou.

## Encerramento

Ao sinal do professor, ninguém mais abre, aprova ou faz merge de PR. O placar é fechado com o que estiver registrado no GitHub e na página de status.
