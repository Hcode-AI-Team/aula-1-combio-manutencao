#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
diagrama.py — diagrama de fluxo ComBio (obrigatorio no Escopo Tecnico; no
Escopo de Projeto quando houver integracao).

    python3 scripts/diagrama.py fluxo.json --saida diagrama.png

Spec:
{
  "caixas": [
    {"id": "fluig",   "texto": "Fluig\\nGatilho: nota aprovada", "tipo": "ancora",        "col": 0, "linha": 0},
    {"id": "datasul", "texto": "Datasul\\nDados da nota",        "tipo": "intermediario", "col": 1, "linha": 0},
    {"id": "melius",  "texto": "Melius\\nUpload XML",            "tipo": "destino",       "col": 2, "linha": 0},
    {"id": "erro",    "texto": "Erro > 48h\\nLiberacao manual",  "tipo": "erro",          "col": 1, "linha": 1}
  ],
  "setas": [
    {"de": "fluig",   "para": "datasul", "rotulo": "POST esp/v1/piRetornaDadosNota"},
    {"de": "datasul", "para": "melius",  "rotulo": "POST /api/v1/nfs/files/upload"},
    {"de": "datasul", "para": "erro",    "rotulo": "falha"}
  ],
  "legenda": "Fluxo de envio da NF-e do Fluig para a Melius."
}

Cores fixas: ancora #116533 · destino #399444 · intermediario #76858E ·
erro #BF882D (unico uso de amarelo). Texto branco, setas #4E5B50, raio 4px,
Kodchasan 13px. Nunca gradiente, emoji ou icone desenhado de memoria.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from xml.sax.saxutils import escape

CORES = {
    "ancora": "#116533",
    "origem": "#116533",
    "destino": "#399444",
    "intermediario": "#76858E",
    "erro": "#BF882D",
}

BOX_W, BOX_H = 190, 62
GAP_X, GAP_Y = 196, 74
PAD = 18
S = 2          # fator de escala do SVG (PNG sai em 2x para ficar nitido)
ROT_FS = 8.5   # tamanho do rotulo de seta


def _quebra(texto, largura_px, fs=ROT_FS, max_linhas=2):
    """Quebra o rotulo da seta para caber no vao entre as caixas."""
    max_chars = max(10, int(largura_px / (fs * 0.52)))
    palavras = str(texto).split()
    linhas, atual = [], ""
    for p in palavras:
        cand = (atual + " " + p).strip()
        if len(cand) <= max_chars or not atual:
            atual = cand
        else:
            linhas.append(atual)
            atual = p
    if atual:
        linhas.append(atual)
    if len(linhas) > max_linhas:
        linhas = linhas[:max_linhas]
        linhas[-1] = linhas[-1][:max_chars - 1] + "…"
    return linhas


def _svg(spec):
    caixas = spec["caixas"]
    setas = spec.get("setas", [])
    cols = max(c.get("col", 0) for c in caixas) + 1
    linhas = max(c.get("linha", 0) for c in caixas) + 1
    w = PAD * 2 + cols * BOX_W + (cols - 1) * GAP_X
    h = PAD * 2 + linhas * BOX_H + (linhas - 1) * GAP_Y + 14

    pos = {}
    for c in caixas:
        x = PAD + c.get("col", 0) * (BOX_W + GAP_X)
        y = PAD + c.get("linha", 0) * (BOX_H + GAP_Y)
        pos[c["id"]] = (x, y)

    out = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" '
        'viewBox="0 0 %d %d">' % (w * S, h * S, w, h),
        '<rect width="%d" height="%d" fill="#FFFFFF"/>' % (w, h),
        '<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" '
        'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        '<path d="M0,0 L10,5 L0,10 z" fill="#4E5B50"/></marker></defs>',
    ]

    for s in setas:
        x1, y1 = pos[s["de"]]
        x2, y2 = pos[s["para"]]
        if y1 == y2:
            ax1, ay1 = x1 + BOX_W, y1 + BOX_H / 2
            ax2, ay2 = x2, y2 + BOX_H / 2
            lx, anchor, disp = (ax1 + ax2) / 2, "middle", abs(ax2 - ax1) - 16
            ly0 = ay1 - 10
            vertical = False
        else:
            ax1, ay1 = x1 + BOX_W / 2, y1 + BOX_H
            ax2, ay2 = x2 + BOX_W / 2, y2
            lx, anchor, disp = ax1 + 10, "start", GAP_X - 24
            ly0 = (ay1 + ay2) / 2
            vertical = True
        out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#4E5B50" '
                   'stroke-width="1.4" marker-end="url(#a)"/>' % (ax1, ay1, ax2, ay2))
        if s.get("rotulo"):
            linhas_rot = _quebra(s["rotulo"], disp)
            for i, ln in enumerate(linhas_rot):
                if vertical:
                    ty = ly0 + (i - (len(linhas_rot) - 1) / 2) * (ROT_FS + 2)
                else:
                    ty = ly0 - (len(linhas_rot) - 1 - i) * (ROT_FS + 2)
                out.append('<text x="%.1f" y="%.1f" text-anchor="%s" fill="#4E5B50" '
                           'font-family="Kodchasan, Trebuchet MS, sans-serif" '
                           'font-size="%s">%s</text>'
                           % (lx, ty, anchor, ROT_FS, escape(ln)))

    for c in caixas:
        x, y = pos[c["id"]]
        cor = CORES.get(c.get("tipo", "intermediario"), CORES["intermediario"])
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="4" fill="%s"/>'
                   % (x, y, BOX_W, BOX_H, cor))
        linhas_txt = str(c["texto"]).split("\n")
        total = len(linhas_txt)
        for i, t in enumerate(linhas_txt):
            ty = y + BOX_H / 2 + (i - (total - 1) / 2) * 15 + 4.5
            peso = "600" if i == 0 else "400"
            tam = 13 if i == 0 else 10
            out.append('<text x="%.1f" y="%.1f" text-anchor="middle" fill="#FFFFFF" '
                       'font-family="Kodchasan, Trebuchet MS, sans-serif" '
                       'font-size="%d" font-weight="%s">%s</text>'
                       % (x + BOX_W / 2, ty, tam, peso, escape(t)))

    out.append("</svg>")
    return "\n".join(out)


def svg_para_png(svg_txt, saida):
    tmp = tempfile.mkdtemp()
    svg_path = os.path.join(tmp, "d.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_txt)
    for cmd in (["rsvg-convert", "-o", saida, svg_path],
                ["soffice", "--headless", "--convert-to", "png",
                 "--outdir", tmp, svg_path]):
        if shutil.which(cmd[0]) is None:
            continue
        subprocess.run(cmd, capture_output=True, timeout=300)
        gerado = saida if cmd[0] == "rsvg-convert" else os.path.join(tmp, "d.png")
        if os.path.exists(gerado):
            if gerado != saida:
                shutil.move(gerado, saida)
            return saida
    raise RuntimeError("nenhum conversor SVG->PNG disponivel (rsvg-convert ou soffice)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--saida", "-o", required=True)
    ap.add_argument("--svg", action="store_true", help="salvar tambem o .svg")
    a = ap.parse_args()
    with open(a.spec, encoding="utf-8") as f:
        spec = json.load(f)
    svg_txt = _svg(spec)
    if a.svg:
        with open(os.path.splitext(a.saida)[0] + ".svg", "w", encoding="utf-8") as f:
            f.write(svg_txt)
    svg_para_png(svg_txt, a.saida)
    print("OK: %s" % a.saida)
    if spec.get("legenda"):
        print("Legenda (inserir abaixo da imagem): %s" % spec["legenda"])


if __name__ == "__main__":
    main()
