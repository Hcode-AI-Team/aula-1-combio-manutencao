#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_template.py — regenera o template canonico de referencia visual
(assets/templates/Escopo_Melhoria_Area_Solicitante_ComBio.docx).

Esse arquivo e a fonte de verdade VISUAL da skill: quando precisar conferir se
um documento novo saiu no layout certo, renderize os dois e compare.
Rode apenas se a anatomia da secao 8 mudar.

    python3 scripts/make_template.py
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from combio_docx import CombioDoc  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SAIDA = os.path.normpath(os.path.join(
    HERE, "..", "assets", "templates", "Escopo_Melhoria_Area_Solicitante_ComBio.docx"))


def main():
    d = CombioDoc(header="ESCOPO DE MELHORIA",
                  eyebrow="SOLICITAÇÃO DE MELHORIA",
                  titulo="Escopo de Melhoria")

    d.faixa("IDENTIFICAÇÃO")
    d.campos([
        ["Título da melhoria:", ""],
        ["Categoria:", "(Infraestrutura │ Sistema │ Dados │ Segurança)"],
        ["Sistema/Serviço afetado:", "(Datasul │ Fluig │ Rede │ Internet │ BI)"],
        ["Solicitante:", ""],
        ["Área de negócio:", "(Tesouraria │ Biomassa │ Manutenção │ TI)"],
    ])

    d.faixa("HISTÓRICO")
    d.campos([
        ["Criado por:", ""],
        ["Data criação:", ""],
        ["Atualizado por:", ""],
        ["Data última atualização:", ""],
        ["Aprovado por:", ""],
        ["Data aprovação:", ""],
    ], colunas=2)

    d.faixa("OBJETIVO")
    d.orientacao("Descrever de forma clara:")
    d.bullets([
        "Qual oportunidade de melhoria foi identificada",
        "Qual o resultado esperado",
        "Qual o benefício que esta melhoria traz para a área/empresa",
    ])

    d.faixa("CENÁRIO ATUAL (AS-IS)")
    d.orientacao("Descrever como o processo/sistema funciona hoje:")
    d.bullets(["Fluxo atual", "Ferramentas envolvidas", "Pontos de dor",
               "Impactos negativos"])

    d.faixa("CENÁRIO PROPOSTO (TO-BE)")
    d.orientacao("Descrever como ficará após a melhoria:")
    d.bullets(["Novo fluxo", "Mudanças técnicas", "Alterações em sistemas"])

    d.faixa("ESCOPO")
    d.orientacao("Descrever o escopo da melhoria em linguagem de negócio — sem "
                 "tabelas de campos, endpoints ou detalhe técnico, pois o "
                 "solicitante irá dar o aceite sobre este texto.")

    d.faixa("CRITÉRIOS DE ACEITE")
    d.bullets([
        "Funcionalidades entregues conforme escopo",
        "Testes validados",
        "Aprovação do solicitante para atualização em Produção",
    ])

    d.callout("A confirmar com a TI: itens sem definição fechada permanecem "
              "marcados aqui e são registrados em Pendências. Execução, "
              "publicação e homologação seguem pelo ServiceUP.")

    print(d.salvar(SAIDA))


if __name__ == "__main__":
    main()
