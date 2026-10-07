# Changelog — combio-escopo-docx

Versionamento semântico simplificado:

- **MAIOR** (2.0) — muda a estrutura de um tipo de documento ou o layout de forma incompatível com documentos já emitidos.
- **MENOR** (1.2) — nova seção, novo tipo, novo script ou nova primitiva de layout.
- **CORREÇÃO** (1.1.1) — ajuste de bug, texto ou regra, sem mudar a saída estruturalmente.

Ao alterar a skill: suba a versão nos **dois** lugares — `version:` no frontmatter do `SKILL.md` (é ele que a tela de Habilidades exibe) e `VERSAO` em `scripts/combio_docx.py` (é ele que carimba o `.docx`) — registre aqui e regere o pacote **sempre com o mesmo nome**, `combio-escopo-docx.zip`.

O nome do pacote não leva versão: a versão vive dentro do arquivo, como nas demais skills ComBio. Assim há um único `.zip` na pasta e nunca dúvida sobre qual instalar. (Não confundir com os documentos gerados: esses continuam versionados no nome — `Escopo_Tecnico_<Assunto>_v<versão>_ComBio.docx`.)

---

## 1.1.1 — 23/09/2026

- Referências às skills `combio-dev-standard`, `combio-design-system` e `combio-hub-onboarding` trocadas por `combio-platform` (fusão das três, v2.0.0) em `scripts/combio_docx.py` e `references/03_layout_diagramas_seguranca.md`. Sem mudança na saída dos documentos.

## 1.1.0 — 11/09/2026

Baseline de versionamento. A skill passa a se identificar na tela de Habilidades e nos artefatos que produz.

- `SKILL.md` ganha `version: 1.1.0` e a lista de `triggers:` no frontmatter, no mesmo formato do `combio-dev-standard` — é isso que faz a tela de Habilidades mostrar a versão e os gatilhos.
- `scripts/combio_docx.py` ganha `SKILL_NOME` e `VERSAO` como fonte da versão carimbada nos documentos.
- Todo `.docx` gerado carrega nas propriedades do arquivo (Propriedades → Comentários, no Word) a marca `Gerado pela skill combio-escopo-docx v<versão>` e a categoria `ComBio Energia — documento de escopo/entrega`.
- `build_doc.py` imprime a versão da skill junto do caminho de saída.
- `empacotar.py` escreve `GERADO_POR.txt` dentro da pasta versionada e do `.zip`, com documento, tipo, versão da skill e data.
- `CHANGELOG.md` criado; `SKILL.md` passa a declarar a versão vigente e a regra de versionamento.

## 1.0 — 11/09/2026

Primeira versão, derivada das instruções do projeto "Escopos de TI".

- Quatro tipos de documento: escopo de melhoria (3.1), escopo técnico (3.2), escopo de projeto (3.3) e relatório de entrega (3.4), mais a versão curta do relatório.
- `esqueleto.py` — spec JSON com todas as seções obrigatórias de cada tipo, já com IDs, marcadores de status e aprovadores em `Pendente`.
- `combio_docx.py` — engine de layout com a anatomia da marca: A4 com as margens da referência, cabeçalho com logo e tipo do documento, rodapé paginado, faixas de seção, blocos de campos, tabelas zebradas com cabeçalho repetido, bullets por `numbering`, callout, chip de status, trecho técnico em Consolas e imagem com legenda.
- `build_doc.py` — spec JSON → `.docx`.
- `diagrama.py` — diagrama de fluxo em SVG → PNG na paleta obrigatória, com quebra automática do rótulo das setas.
- `grafico.py` — gráfico de barra/linha do relatório de entrega, na paleta obrigatória.
- `render_check.py` — `.docx` → PDF → JPEGs para a conferência visual.
- `make_template.py` — regera o template de referência visual.
- `empacotar.py` — `Escopos/<escopo|entregas>/<Nome>_v<versão>/` + `.zip` versionado.
- `references/` — os quatro tipos e a matriz, as regras de conteúdo e a anatomia do layout com diagramas, gráficos, LGPD e checklist.
- `assets/` — logo, fontes Kodchasan e Varela Round, template `.docx` de referência.

Correções de layout descobertas na validação visual e já embutidas na engine: ordem canônica dos filhos de `pPr`/`rPr`/`tcPr`/`tblPr`/`trPr` (ECMA-376), remoção do tab CENTER herdado dos estilos `Header`/`Footer`, `U+FE0E` + fonte de símbolo nos marcadores de status para o `⚠` não virar emoji, `cantSplit` em todas as linhas, e índice montado a partir das faixas em vez de campo TOC.
