# Carta de missão — modelo em branco

O conteúdo das cartas é definido pelo professor com o pessoal de CyberSecurity antes da aula. Este arquivo traz só a estrutura. As cartas preenchidas **não** ficam no repositório: são entregues a cada time em canal privado.

| Campo | Preenchimento |
|---|---|
| Código | C1, C2, … |
| Categoria | Item do OWASP Top 10:2025 ou do OWASP Top 10 for LLM Applications 2025 |
| Objetivo | O que o time precisa fazer chegar ao PRD adversário, em uma frase |
| Restrições | O que não pode ser feito nesta carta (sempre dentro de `REGRAS.md`) |
| Dificuldade | 1, 2 ou 3 |
| Evidência | Como provar que a carta foi cumprida (link do PR, commit publicado, print da página de status) |
| Camada esperada | Onde a esteira adversária deveria segurar: CI, subagente, gate humano ou verificação pós-deploy |

## Regras para quem escreve as cartas

- Só dados fictícios.
- Cada carta precisa ter uma defesa possível com o que foi ensinado nos Encontros 3, 4 e 5.
- Misture dificuldades: pelo menos uma carta que o subagente pega sozinho e uma que só o gate humano pega.
- O gabarito de cada carta entra em `Encontro6_Gabarito_Defesa.md`, na tabela "controle → risco".
