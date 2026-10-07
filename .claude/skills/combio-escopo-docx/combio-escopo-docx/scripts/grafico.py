#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
grafico.py — grafico simples para o Relatorio de Entrega (max. 2 por relatorio).

    python3 scripts/grafico.py grafico.json --saida grafico.png

Spec (barras agrupadas — planejado vs. realizado):
{
  "tipo": "barra",
  "titulo": "Cronograma — dias por fase",
  "categorias": ["Piloto MG", "Expansao SP", "Estabilizacao"],
  "series": [
    {"nome": "Planejado", "cor": "planejado", "valores": [30, 45, 20]},
    {"nome": "Realizado", "cor": "realizado", "valores": [34, 45, 26]}
  ],
  "sufixo": " d"
}

Spec (linha — evolucao):
{"tipo": "linha", "titulo": "Desvio mensal (%)", "categorias": ["Abr","Mai","Jun"],
 "series": [{"nome": "Desvio", "cor": "realizado", "valores": [1.2, 0.7, 0.4]}]}

Paleta obrigatoria: realizado #116533 · planejado #76858E · atencao #BF882D ·
estouro #AB3434. Sem 3D, sem gradiente, sem legenda flutuante; rotulo de valor
direto na barra; eixo em Varela Round 8pt #4E5B50.
"""

from __future__ import annotations

import argparse
import glob
import json
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm  # noqa: E402
import matplotlib.pyplot as plt  # noqa: E402

CORES = {"realizado": "#116533", "planejado": "#76858E",
         "atencao": "#BF882D", "estouro": "#AB3434"}
INK_60 = "#4E5B50"
INK_20 = "#C5CCC6"

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.normpath(os.path.join(HERE, "..", "assets", "fonts"))


def _fontes():
    for f in glob.glob(os.path.join(FONTS, "*.ttf")):
        try:
            fm.fontManager.addfont(f)
        except Exception:
            pass
    plt.rcParams["font.family"] = ["Kodchasan", "Trebuchet MS", "DejaVu Sans"]


def gerar(spec, saida):
    _fontes()
    cats = spec["categorias"]
    series = spec["series"]
    sufixo = spec.get("sufixo", "")
    fig, ax = plt.subplots(figsize=(7.2, 3.4), dpi=200)

    if spec.get("tipo", "barra") == "linha":
        for s in series:
            ax.plot(cats, s["valores"], marker="o", linewidth=2,
                    color=CORES.get(s.get("cor", "realizado"), "#116533"),
                    label=s["nome"])
            for x, v in zip(cats, s["valores"]):
                ax.annotate("%g%s" % (v, sufixo), (x, v), textcoords="offset points",
                            xytext=(0, 7), ha="center", fontsize=8, color=INK_60)
    else:
        n = len(series)
        largura = 0.72 / n
        base = range(len(cats))
        for i, s in enumerate(series):
            xs = [b + (i - (n - 1) / 2) * largura for b in base]
            cor = CORES.get(s.get("cor", "realizado"), "#116533")
            ax.bar(xs, s["valores"], width=largura * 0.92, color=cor, label=s["nome"])
            for x, v in zip(xs, s["valores"]):
                ax.annotate("%g%s" % (v, sufixo), (x, v), textcoords="offset points",
                            xytext=(0, 4), ha="center", fontsize=8, color=INK_60)
        ax.set_xticks(list(base))
        ax.set_xticklabels(cats)

    ax.set_title(spec.get("titulo", ""), fontsize=11, color="#116533",
                 fontweight="bold", loc="left", pad=12)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    for lado in ("left", "bottom"):
        ax.spines[lado].set_color(INK_20)
    ax.tick_params(colors=INK_60, labelsize=8)
    ax.grid(axis="y", color=INK_20, linewidth=0.6, alpha=0.6)
    ax.set_axisbelow(True)
    if len(series) > 1:
        ax.legend(frameon=False, fontsize=8, labelcolor=INK_60,
                  loc="upper center", bbox_to_anchor=(0.5, -0.14), ncol=len(series))
    fig.tight_layout()
    os.makedirs(os.path.dirname(os.path.abspath(saida)) or ".", exist_ok=True)
    fig.savefig(saida, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return saida


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--saida", "-o", required=True)
    a = ap.parse_args()
    with open(a.spec, encoding="utf-8") as f:
        spec = json.load(f)
    print("OK: %s" % gerar(spec, a.saida))


if __name__ == "__main__":
    main()
