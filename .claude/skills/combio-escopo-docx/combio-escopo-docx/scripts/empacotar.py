#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
empacotar.py — organiza e empacota a entrega.

Estrutura fixa no workspace (convencao do projeto "Escopos de TI"):

    Escopos/
      escopo/     <- tipos 3.1, 3.2 e 3.3
      entregas/   <- tipo 3.4 (relatorio de entrega)

Uso:

    python3 scripts/empacotar.py \
        --docx build/Escopo_Tecnico_Recebimento_v1.0_ComBio.docx \
        --tipo escopo --nome Escopo_Tecnico_Recebimento --versao 1.0 \
        --extra build/diagrama.png --extra build/spec.json \
        --raiz .

Faz: renderiza o PDF de conferencia, copia tudo para
Escopos/<escopo|entregas>/<Nome>_v<versao>/ e gera o .zip versionado ao lado.
Imprime os caminhos finais.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import zipfile
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--docx", required=True)
    ap.add_argument("--tipo", choices=["escopo", "entrega"], required=True)
    ap.add_argument("--nome", required=True, help="ex.: Escopo_Tecnico_Recebimento")
    ap.add_argument("--versao", required=True, help="ex.: 1.0")
    ap.add_argument("--extra", action="append", default=[],
                    help="arquivo adicional (diagrama, grafico, spec, anexo)")
    ap.add_argument("--raiz", default=".", help="raiz onde fica a pasta Escopos/")
    ap.add_argument("--sem-pdf", action="store_true")
    a = ap.parse_args()

    sub = "escopo" if a.tipo == "escopo" else "entregas"
    base = os.path.abspath(os.path.join(a.raiz, "Escopos", sub))
    pasta = os.path.join(base, "%s_v%s" % (a.nome, a.versao))
    os.makedirs(pasta, exist_ok=True)

    docx_final = os.path.join(pasta, "%s_v%s_ComBio.docx" % (a.nome, a.versao))
    shutil.copy(os.path.abspath(a.docx), docx_final)

    if not a.sem_pdf:
        r = subprocess.run(["soffice", "--headless", "--convert-to", "pdf",
                            "--outdir", pasta, docx_final],
                           capture_output=True, text=True, timeout=300)
        if not os.path.exists(os.path.splitext(docx_final)[0] + ".pdf"):
            print("AVISO: PDF nao gerado:\n" + r.stdout + r.stderr, file=sys.stderr)

    for e in a.extra:
        if os.path.exists(e):
            shutil.copy(e, os.path.join(pasta, os.path.basename(e)))

    # Manifesto: quem gerou, com qual versao da skill e quando.
    sys.path.insert(0, HERE)
    try:
        from combio_docx import SKILL_NOME, VERSAO
    except Exception:
        SKILL_NOME, VERSAO = "combio-escopo-docx", "desconhecida"
    with open(os.path.join(pasta, "GERADO_POR.txt"), "w", encoding="utf-8") as f:
        f.write("Documento: %s_v%s\n" % (a.nome, a.versao))
        f.write("Tipo: %s\n" % a.tipo)
        f.write("Skill: %s v%s\n" % (SKILL_NOME, VERSAO))
        f.write("Gerado em: %s\n" % datetime.now().strftime("%d/%m/%Y %H:%M"))
        f.write("\nDocumento para validacao interna. Execucao, publicacao e "
                "homologacao seguem pela TI, via ServiceUP.\n")

    zip_path = os.path.join(base, "%s_v%s_ComBio.zip" % (a.nome, a.versao))
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for raiz, _, arquivos in os.walk(pasta):
            for f in arquivos:
                p = os.path.join(raiz, f)
                z.write(p, os.path.relpath(p, base))

    print("PASTA: %s" % pasta)
    print("DOCX:  %s" % docx_final)
    print("ZIP:   %s" % zip_path)


if __name__ == "__main__":
    main()
