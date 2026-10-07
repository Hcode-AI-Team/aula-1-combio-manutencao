#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
render_check.py — conferencia visual obrigatoria antes de entregar.

    python3 scripts/render_check.py saida.docx [--dpi 100] [--out /tmp/check]

Converte o .docx em PDF (LibreOffice) e o PDF em JPEGs, um por pagina, e
imprime os caminhos. Depois DE FATO OLHE as imagens com a ferramenta Read:
procure faixa de secao orfa no pe da pagina, tabela quebrada sem cabecalho
repetido, sobreposicao de logo e titulo, celula estourada e texto abaixo de 10pt.
"""

from __future__ import annotations

import argparse
import glob
import os
import shutil
import subprocess
import sys


def instalar_fontes():
    """Instala Kodchasan/Varela Round no ambiente para o PDF sair fiel."""
    here = os.path.dirname(os.path.abspath(__file__))
    src = os.path.normpath(os.path.join(here, "..", "assets", "fonts"))
    dst = os.path.expanduser("~/.fonts")
    if not os.path.isdir(src):
        return
    os.makedirs(dst, exist_ok=True)
    novo = False
    for f in glob.glob(os.path.join(src, "*.ttf")):
        alvo = os.path.join(dst, os.path.basename(f))
        if not os.path.exists(alvo):
            shutil.copy(f, alvo)
            novo = True
    if novo:
        subprocess.run(["fc-cache", "-f"], capture_output=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("--dpi", type=int, default=100)
    ap.add_argument("--out", default=None)
    a = ap.parse_args()

    docx = os.path.abspath(a.docx)
    out = os.path.abspath(a.out or os.path.join(os.path.dirname(docx), "_check"))
    os.makedirs(out, exist_ok=True)

    instalar_fontes()

    r = subprocess.run(
        ["soffice", "--headless", "--convert-to", "pdf", "--outdir", out, docx],
        capture_output=True, text=True, timeout=300)
    pdf = os.path.join(out, os.path.splitext(os.path.basename(docx))[0] + ".pdf")
    if not os.path.exists(pdf):
        print("FALHA na conversao:\n" + r.stdout + r.stderr, file=sys.stderr)
        sys.exit(1)

    base = os.path.join(out, "pag")
    subprocess.run(["pdftoppm", "-jpeg", "-r", str(a.dpi), pdf, base], check=True)

    print("PDF: %s" % pdf)
    for p in sorted(glob.glob(base + "*.jpg")):
        print("IMG: %s" % p)
    print("\nAgora LEIA as imagens acima e corrija o que estiver errado.")


if __name__ == "__main__":
    main()
