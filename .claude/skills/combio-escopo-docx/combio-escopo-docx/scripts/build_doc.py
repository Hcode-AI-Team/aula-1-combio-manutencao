#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_doc.py — monta o .docx ComBio a partir de um spec JSON.

    python3 scripts/build_doc.py spec.json --saida Escopos/escopo/Escopo_Tecnico_X_v1.0_ComBio.docx

Formato do spec (todos os campos de topo sao opcionais exceto 'secoes'):

{
  "tipo": "melhoria | tecnico | projeto | entrega",
  "cabecalho": "ESCOPO TECNICO",              # texto do cabecalho de pagina
  "eyebrow": "ESCOPO TECNICO",
  "titulo": "Integracao Fluig -> Melius",
  "subtitulo": "Linha de orientacao em italico (opcional)",
  "status_geral": {"texto": "Entregue com pendencias", "cor": "warn"},   # so 3.4
  "sumario": false,                            # TOC nativo (3.3 e 3.4 longos)
  "secoes": [
    {"faixa": "1. IDENTIFICACAO", "blocos": [
       {"t": "orientacao", "texto": "..."},
       {"t": "paragrafo",  "texto": "texto com **negrito** e `codigo`"},
       {"t": "subtitulo",  "texto": "4.1 Frente de parametrizacao"},
       {"t": "bullets",    "itens": ["...", "..."]},
       {"t": "numerado",   "itens": ["Gatilho: ...", "Passo 2 ..."]},
       {"t": "campos",     "colunas": 1, "linhas": [["Rotulo:", "valor"], ...]},
       {"t": "tabela",     "colunas": ["ID","Regra de Negocio"],
                           "larguras": [1, 7],
                           "linhas": [["RN01","..."], ["RN02","..."]]},
       {"t": "callout",    "texto": "A confirmar com a TI: ...", "cor": "warn"},
       {"t": "codigo",     "texto": "POST esp/v1/piRetornaDadosNota"},
       {"t": "imagem",     "arquivo": "diagrama.png", "largura_px": 600,
                           "legenda": "Fluxo ..."},
       {"t": "regua"},
       {"t": "quebra"}
    ]}
  ]
}

Marcadores de status nas celulas: comece o texto com  ✓ / ⚠ / ✗  e a engine
colore o simbolo automaticamente (sempre acompanhado da palavra).
"""

from __future__ import annotations

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from combio_docx import (CombioDoc, GREEN_DARK, YELLOW, RED, BLUE_GREY,
                         SKILL_NOME, VERSAO)

CORES = {"ok": GREEN_DARK, "warn": YELLOW, "err": RED, "neutro": BLUE_GREY}


def montar(spec, saida):
    doc = CombioDoc(
        header=spec.get("cabecalho") or spec.get("eyebrow") or "ESCOPO",
        eyebrow=spec.get("eyebrow"),
        titulo=spec.get("titulo"),
        subtitulo=spec.get("subtitulo"),
    )
    st = spec.get("status_geral")
    if st:
        doc.chip_status(st.get("texto", ""), CORES.get(st.get("cor", "ok"), GREEN_DARK))
    if spec.get("sumario"):
        nomes = [s["faixa"] for s in spec.get("secoes", []) if s.get("faixa")]
        doc.indice(nomes)
        doc.quebra_pagina()

    for secao in spec.get("secoes", []):
        if secao.get("faixa"):
            doc.faixa(secao["faixa"])
        for b in secao.get("blocos", []):
            t = b.get("t")
            if t == "orientacao":
                doc.orientacao(b["texto"])
            elif t == "paragrafo":
                doc.paragrafo(b["texto"], after=b.get("after", 120))
            elif t == "subtitulo":
                doc.subtitulo(b["texto"])
            elif t == "bullets":
                doc.bullets(b["itens"], nivel=b.get("nivel", 0))
            elif t == "numerado":
                doc.numerado(b["itens"])
            elif t == "campos":
                doc.campos(b["linhas"], colunas=b.get("colunas", 1))
            elif t == "tabela":
                doc.tabela(b["colunas"], b["linhas"], larguras=b.get("larguras"))
            elif t == "callout":
                doc.callout(b["texto"], cor=CORES.get(b.get("cor", "warn"), YELLOW))
            elif t == "chip":
                doc.chip_status(b["texto"], CORES.get(b.get("cor", "ok"), GREEN_DARK))
            elif t == "codigo":
                doc.codigo(b["texto"])
            elif t == "imagem":
                if not os.path.exists(b["arquivo"]):
                    raise SystemExit(
                        "Imagem nao encontrada: %s\n"
                        "Gere o diagrama antes (scripts/diagrama.py) ou o grafico "
                        "(scripts/grafico.py), ou remova o bloco do spec." % b["arquivo"])
                doc.imagem(b["arquivo"], largura_px=b.get("largura_px", 600),
                           legenda=b.get("legenda"))
            elif t == "regua":
                doc.regua()
            elif t == "quebra":
                doc.quebra_pagina()
            else:
                raise ValueError("bloco desconhecido: %r" % t)
    return doc.salvar(saida)


def main():
    ap = argparse.ArgumentParser(description="Monta .docx ComBio a partir de spec JSON")
    ap.add_argument("spec")
    ap.add_argument("--saida", "-o", required=True)
    a = ap.parse_args()
    with open(a.spec, encoding="utf-8") as f:
        spec = json.load(f)
    caminho = montar(spec, a.saida)
    print("OK: %s  (%s v%s)" % (caminho, SKILL_NOME, VERSAO))


if __name__ == "__main__":
    main()
