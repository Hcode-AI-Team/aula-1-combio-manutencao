# Regras de conteúdo — o que separa um documento bom de um genérico

## Antes de escrever — sempre

1. **Leia todos os anexos** (documentos, planilhas, collections do Postman, atas, prints, e-mails). Extraia fatos reais: endpoints, métodos, campos, sistemas de origem/destino, regras de negócio, volumes, ambientes, responsáveis, prazos, valores.
2. **Identifique os sistemas e o papel de cada um** (origem, destino, quem autentica). Não presuma — confirme pelo anexo ou pergunte.
3. **Pergunte o essencial ambíguo**: tipo de documento (3.1–3.4), plataforma, direção do fluxo, gatilho, ambiente, volume, sponsor/PO, investimento.
4. **Para o Relatório de Entrega (3.4), o escopo aprovado é insumo obrigatório.** Sem ele, não escreva o relatório: peça o arquivo (ou a versão vigente). Copie os IDs e as metas do escopo antes de preencher qualquer resultado.
5. Só então monte o `.docx` — pesquisa → conteúdo → formato.
6. **Nunca deixe seção vazia.** Faltando informação, escreva o melhor conteúdo possível, marque **"a confirmar com a TI" / "a definir"** em callout e registre em `Pendências`.

## Regras gerais

- **Quantifique a dor e o resultado.** Sempre que houver número, ele entra: valor de ajuste evitado, horas gastas, volume de notas, % de desvio. Ex.: "eliminar ajustes massivos como o ocorrido anteriormente (~R$ 30 milhões)".
- **Todo requisito tem ID e é verificável.** `RN01`… numeração sequencial estável entre versões e entre documentos — nunca renumere, adicione no fim.
- **Fora do escopo (e item não entregue) sempre com destino.** Sem destino, vira expectativa frustrada.
- **Nunca prometa o que é fase futura.** "Fase futura (2027)" com o pré-requisito declarado.
- **Toda dependência tem projeto, impacto e status com dono.**
- **Toda premissa tem marcador de status** (`✓` / `⚠ Dependente (<dono>)` / `⚠ A definir` / `⚠ Condicional`) e o impacto de não se sustentar.
- **Todo risco tem criticidade e mitigação acionável**, com fallback quando depende de terceiro.
- **Toda fase tem critério de sucesso mensurável** — e, no relatório, o valor efetivamente medido ao lado.
- **Toda ADR tem Contexto · Decisão · Consequências**, incluindo as negativas aceitas. `(NOVO)` quando entra em nova versão.
- **Todo item de backlog tem tamanho e dono**: `[G] Implementar pipeline ETL Datasul → DW — TI`.
- **Premissa limitante declarada é blindagem**: registre o que **não** muda.
- **Investimento com natureza e origem**: "100h (80h funcional + 20h dev), R$ 29.800 CAPEX, banco de horas TOTVS" — e, no relatório, previsto vs. realizado.
- **Piloto antes de expansão**, com ciclo paralelo quando houver risco operacional; expansão condicionada a maturidade, nunca automática.
- **Nomes reais de responsáveis e prazos**; ata de reunião vira seção.

## Regras exclusivas do Relatório de Entrega

- **Rastreabilidade 1:1 com o escopo.** Todo `RN`, `EP`, fase, risco e pendência do escopo aparece no relatório com um status. Nada é omitido para o documento parecer melhor.
- **Evidência para toda afirmação de entrega**: print, relatório, número de ticket/chamado, tabela consultada, ata, log. Sem evidência, o status é `⚠ Entregue com ressalva`, não `✓`.
- **Números comparados, não recontados**: use a meta do escopo (0,5%, D+1, 100% das fazendas MG) e coloque o medido ao lado. Se não foi medido, escreva "não medido" — não estime.
- **Desvio de escopo exige dono e data da aprovação.** Mudança sem aprovação registrada entra como desvio `⚠ a validar`.
- **Você nunca marca aceite nem aprovação** — status fica `Pendente`.
- **Não declare homologação nem segurança**: descreva o que foi configurado, o que foi testado e quem validou.

## Tom, entrega e versionamento

- Português do Brasil, objetivo e técnico, sem enrolação.
- Entregue o `.docx` (não só texto no chat) e resuma em poucas linhas o que foi coberto, listando os pontos "a confirmar com a TI" e as pendências abertas. No relatório de entrega, diga também o **status geral** e o que falta para o aceite.
- Correção de fato (sistema, campo, direção do fluxo, responsável) → **atualize o documento inteiro**, suba a **Versão** (3.0 → 3.1), atualize `HISTÓRICO`/`Atualizado por` e refaça o diagrama afetado. Item novo recebe `(NOVO)`; item removido vai para `Fora do Escopo` / `Itens não entregues` com destino, nunca desaparece silenciosamente.
- Aprovadores e aceite ficam `Pendente` até haver registro.

## Exemplo de precisão esperada

> **Escopo:** Fluig consulta a nota no **Datasul** (`POST esp/v1/piRetornaDadosNota`, Basic Auth) → extrai `xmlNFe` → autentica na **Melius** (Login → Bearer) → envia via `POST /api/v1/nfs/files/upload` (base64). Nota presa >48h como risco Alto, mitigação de liberação manual monitorada.
>
> **Relatório de entrega correspondente:** `RN01 ✓ Entregue` (evidência: 312 notas processadas entre 01/04 e 30/04, relatório em anexo) · `RN04 ⚠ Entregue com ressalva` (validação de predecessoras manual até o workflow Fluig entrar) · risco "notas presas" **materializou** em 7 casos, todos liberados em até 24h · fase "Expansão SP" `✗ Não entregue → destino: fase futura, pós-maturidade dos controles locais` · aceite `Pendente`.

Sistemas certos, endpoints reais, direção explícita, números onde houver número, exclusões com destino, entregas com evidência, credenciais protegidas, lacunas marcadas.
