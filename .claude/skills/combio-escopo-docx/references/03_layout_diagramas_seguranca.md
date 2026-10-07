# Layout, diagramas, gráficos e segurança

## Anatomia exata do layout

Tudo abaixo já está implementado em `scripts/combio_docx.py` — só precisa ser conferido se você editar a engine. Tokens da skill `combio-platform` (`design/colors_and_type.css` é a fonte única — **não invente hex**).

**Página** — A4 (11906 × 16838 dxa). Margens: topo **1500**, base **1300**, laterais **1300**. Header/footer **708**. Largura de tabela: **9300 dxa**.

**Cabeçalho** — logo `combio-primary.png` inline à esquerda, **1143000 × 247650 EMU** (≈ 3,0 × 0,65 cm) → tab direito em **9026** → tipo do documento em **Kodchasan Bold 13pt `#116533`** caixa alta. Borda inferior: `single` **`#399444`** `sz=10` `space=8`.

**Rodapé** — borda superior `single` **`#399444`** `sz=8` `space=6`. **Varela Round 8pt `#4E5B50`**: `ComBio Energia` → tab direito → `Página ` + campo `PAGE` + ` de ` + `NUMPAGES`.

**Eyebrow + título** — eyebrow **Varela Round 9pt `#399444`**, `spacing w:val="24"`, caixa alta, `spacing after 140`. Título **Kodchasan Bold 24pt `#116533`**, `spacing after 260`.

**Faixa de seção** — tabela 1 coluna 9300 dxa, célula `shd fill="116533"` (`ShadingType.CLEAR`), margens 90 (topo/base) e 160 (laterais), `vAlign center`. Texto **Kodchasan Bold 11pt branco**, `spacing w:val="12"`, caixa alta, `keepNext`. Em 3.3 e 3.4 a faixa recebe o número: `9. ITENS NÃO ENTREGUES E DESTINO`.

**Bloco de campos** — tabela 1 coluna 9300 dxa (ou 2 × 4650). Bordas `single` **`#C5CCC6`** `sz=4`. Zebra **`#FFFFFF` / `#F2F4F1`**. Margens 130/160. Rótulo **Kodchasan Bold 10,5pt `#0F1A11`**; dica na mesma linha **Varela Round 9pt `#4E5B50`**.

**Corpo** — orientação em **Varela Round Itálico 9,5pt `#4E5B50`** (`spacing after 160`). Bullets por `numbering` (`●`), **Kodchasan 10,5pt `#2A3A2D`**, `spacing after 90` — nunca `•`/`—` literal. Trecho técnico em **Consolas 9,5pt `#0F1A11`** com shading `#F2F4F1`.

**Tabelas de dados** — cabeçalho `#116533` com **branco Kodchasan Bold 10pt**; corpo 10pt `#2A3A2D`; zebra `#F9FAF8`; bordas `#C5CCC6` `sz=4`; coluna de ID estreita (~900 dxa); `repeatHeader` e `cantSplit` ligados.

**Marcadores de status** — `✓` em `#116533`, `⚠` em `#BF882D`, `✗` em `#AB3434`, sempre acompanhados da palavra (`✓ Entregue`), nunca só o símbolo. Basta iniciar o texto da célula com o símbolo: a engine colore e força apresentação monocromática (fonte de símbolo + `U+FE0E`), para o `⚠` não virar emoji. Status geral no topo do relatório: chip com shading `#F2F4F1` e barra esquerda 3pt na cor do status.

**Callout "a confirmar com a TI"** — shading `#F2F4F1`, barra esquerda 3pt **`#BF882D`**, Kodchasan 10pt `#2A3A2D`.

**Proibido** — emoji (`✓`/`⚠`/`✗` de status são a exceção); vermelho `#AB3434` decorativo; Green Dark com vermelho em bloco; gradiente; mais de 3 cores fortes na página; corpo abaixo de 10pt; faixa de seção órfã no fim da página.

### Paleta (única permitida)

| Token | Hex | Uso |
|---|---|---|
| Green Dark | `#116533` | faixas, cabeçalho de tabela, título, âncora de diagrama, "realizado" |
| Green Light | `#399444` | eyebrow, réguas, bordas de cabeçalho/rodapé, destino de diagrama |
| Blue Grey | `#76858E` | neutro executivo, intermediário de diagrama, "planejado" |
| Yellow | `#BF882D` | atenção, callout, `⚠`, bloco de erro do diagrama |
| Red | `#AB3434` | só erro/estouro real, `✗` |
| Ink / 80 / 60 / 20 / 05 / 02 | `#0F1A11` `#2A3A2D` `#4E5B50` `#C5CCC6` `#F2F4F1` `#F9FAF8` | texto, bordas, zebra, shading |

---

## Diagrama de fluxo

Obrigatório em 3.2; em 3.3 quando houver integração. Use `scripts/diagrama.py` — ele já aplica as cores, o raio 4px, a tipografia e as setas corretas.

```bash
python3 scripts/diagrama.py fluxo.json --saida diagrama.png
```

Caixas + setas: gatilho → origem → transformação → destino; rótulo da seta = método + endpoint curto. Cores: `#116533` (âncora/origem), `#399444` (destino), `#76858E` (intermediário), `#BF882D` só no bloco de erro. Texto branco, setas `#4E5B50`, Kodchasan. Legenda abaixo em Varela Round 8pt `#4E5B50` (o script imprime a legenda para você copiar no bloco `imagem`). Nunca gradiente, emoji ou ícone desenhado "de memória".

**No máximo 3 caixas por linha** — fluxos maiores quebram em duas linhas (`"linha": 1`), senão o diagrama fica ilegível quando reduzido para 560 px na página.

---

## Gráficos no Relatório de Entrega

Quando o relatório apresenta números comparáveis (planejado vs. realizado, evolução de desvio, chamados na operação assistida), prefira **gráfico > tabela > texto**. **Máximo 2 gráficos por relatório**, simples (barra ou linha).

```bash
python3 scripts/grafico.py grafico.json --saida grafico.png
```

Paleta obrigatória: `#116533` (realizado), `#76858E` (planejado), `#BF882D` (atenção), `#AB3434` só para estouro real. Sem 3D, sem gradiente, sem legenda flutuante; rótulo de valor direto na barra, eixo em 8pt `#4E5B50`.

---

## Segurança e conformidade (obrigatório)

- **Nunca reproduza credenciais** (usuário, senha, token, Basic Auth), mesmo presentes nos anexos/collections. Escreva **"credenciais gerenciadas pela TI em cofre de segredos"** e registre que as credenciais de exemplo dos anexos **não devem ir para produção**.
- **Nunca declare** "pronto para produção", "seguro" ou "homologado" — nem no escopo, nem no relatório. No relatório, descreva o que foi configurado, o que foi testado e quem validou.
- **Publicação, deploy, domínio, banco, CI/CD**: fora do escopo do documento — direcione ao **ServiceUP/TI**.
- Em escopo de projeto e no relatório, cubra sempre: **classificação do dado**, **segregação de funções por perfil** (quem aponta não aprova ajuste do próprio apontamento), **trilha de auditoria** (antes/depois, responsável, justificativa), **base legal LGPD** com finalidade declarada e **revisão periódica de acessos** com dono e cadência.
- Dados internos de negócio (fiscal, contábil, operacional) são uso legítimo. Pessoais/sensíveis: use o mínimo, prefira anonimizado; volume grande → alinhe com TI/SI/LGPD.
- Escopo que envolve **desenvolver** app/API interna segue `combio-platform` (Python + Django + Django Ninja, MySQL, Angular + PO UI). Acoplar ao HUB IA → `combio-platform` (`references/07-hub-onboarding.md`).
- Escopo e relatório são **comunicação**, não protótipo funcional: **não** aplique banner "[PROTÓTIPO]".

---

## Checklist antes de entregar

1. Tipo correto (3.1–3.4) e todas as seções do tipo presentes, nenhuma vazia.
2. Layout idêntico à referência (`assets/templates/`): logo, cabeçalho, faixas verdes em caixa alta, zebra, rodapé paginado.
3. Cores só as da tabela acima — nenhum hex inventado.
4. IDs sequenciais, sem repetição e **iguais entre escopo e relatório**.
5. Escopo: exclusão com destino, dependência com dono, premissa com status, risco com mitigação, fase com critério mensurável, backlog com tamanho e dono.
6. Relatório: todo ID do escopo com status, toda entrega com evidência, meta e medido lado a lado, desvio com aprovador, item não entregue com destino e prazo, aceite `Pendente`.
7. Nenhuma credencial; nenhuma afirmação de produção/homologação; nada prometido que é fase futura.
8. Cada seção com tabela, lista com ID, fluxo numerado, gráfico, diagrama ou callout.
9. **Renderize e olhe**: `python3 scripts/render_check.py <arquivo>.docx` → leia os JPEGs e corrija sobreposição, faixa órfã e tabela quebrada sem cabeçalho repetido.
