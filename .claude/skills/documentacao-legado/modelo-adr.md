# Modelo de ADR

Arquivo `docs/sistemas/<sistema>/adr/NNNN-<titulo-curto>.md`, numeração sequencial com 4 dígitos. Uma decisão por arquivo.

````markdown
# NNNN — <Decisão em uma frase>

- **Status:** retroativo | proposta | aceita | substituída por NNNN
- **Data:** <data da decisão, se conhecida; senão [a confirmar]> — registrado em <data do documento>

## Contexto

Problema ou força que levou à decisão. Só o que a evidência sustenta; o resto é [a confirmar].

## Decisão

O que foi adotado, de forma verificável (ex.: "integração com o ERP por arquivo TXT em pasta compartilhada, lido pelo job X").

## Alternativas

Alternativas consideradas ou plausíveis. Em ADR retroativo, marque as não documentadas como "hipótese".

## Consequências

- Positivas: ...
- Negativas / riscos: ...

## Evidência

- `arquivo:linha` — o que mostra
````
