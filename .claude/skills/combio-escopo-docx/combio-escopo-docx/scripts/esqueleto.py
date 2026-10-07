#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
esqueleto.py — emite um spec JSON ja com TODAS as secoes obrigatorias do tipo
escolhido, para voce so preencher. Garante que nenhuma secao seja esquecida.

    python3 scripts/esqueleto.py --tipo tecnico --titulo "Integracao X" > spec.json
    python3 scripts/esqueleto.py --tipo projeto --titulo "Custeio 2.0" --versao 3.1 > spec.json

Tipos: melhoria (3.1) · tecnico (3.2) · projeto (3.3) · entrega (3.4) ·
       entrega-curta (3.4 reduzido, para melhoria pequena: 1,2,4,7,9,11,12,18)

Regras que o esqueleto ja embute:
  - IDs sequenciais (RN01…, EP01…, ADR-01…) e estaveis entre versoes.
  - Exclusao com destino; dependencia com dono; premissa com marcador; risco
    com criticidade e mitigacao; fase com criterio mensuravel.
  - Aprovadores/aceite sempre "Pendente".
  - Nenhuma credencial; nenhuma afirmacao de producao/homologacao.
"""

from __future__ import annotations

import argparse
import json

ORIENT = "Preencher. Se faltar informação, escreva o melhor conteúdo possível, marque em callout como 'a confirmar com a TI' e registre em Pendências."


def _sec(faixa, blocos):
    return {"faixa": faixa, "blocos": blocos}


def _tab(cols, larg, linhas):
    return {"t": "tabela", "colunas": cols, "larguras": larg, "linhas": linhas}


def melhoria(t, v):
    return {
        "tipo": "melhoria", "cabecalho": "ESCOPO DE MELHORIA",
        "eyebrow": "SOLICITAÇÃO DE MELHORIA", "titulo": t or "Escopo de Melhoria",
        "secoes": [
            _sec("IDENTIFICAÇÃO", [{"t": "campos", "linhas": [
                ["Título da melhoria:", ""],
                ["Categoria:", "(Infraestrutura │ Sistema │ Dados │ Segurança)"],
                ["Sistema/Serviço afetado:", "(Datasul │ Fluig │ Rede │ Internet │ BI)"],
                ["Solicitante:", ""],
                ["Área de negócio:", "(Tesouraria │ Biomassa │ Manutenção │ TI)"]]}]),
            _sec("HISTÓRICO", [{"t": "campos", "colunas": 2, "linhas": [
                ["Criado por:", ""], ["Data criação:", ""],
                ["Atualizado por:", ""], ["Data última atualização:", ""],
                ["Aprovado por:", ""], ["Data aprovação:", "Pendente"]]}]),
            _sec("OBJETIVO", [{"t": "orientacao", "texto": "Oportunidade identificada, resultado esperado e benefício — com número sempre que houver."},
                              {"t": "bullets", "itens": ["", "", ""]}]),
            _sec("CENÁRIO ATUAL (AS-IS)", [{"t": "orientacao", "texto": "Fluxo atual, ferramentas, pontos de dor e impactos — quantificados."},
                                           {"t": "bullets", "itens": ["", "", ""]}]),
            _sec("CENÁRIO PROPOSTO (TO-BE)", [{"t": "bullets", "itens": ["", "", ""]}]),
            _sec("ESCOPO", [{"t": "orientacao", "texto": "Linguagem de negócio — sem tabela de campos nem endpoint: é sobre este texto que o solicitante dá o aceite."},
                            {"t": "paragrafo", "texto": ""}]),
            _sec("CRITÉRIOS DE ACEITE", [{"t": "bullets", "itens": [
                "Funcionalidades entregues conforme escopo",
                "Testes validados",
                "Aprovação do solicitante para atualização em Produção"]}]),
        ]}


def tecnico(t, v):
    return {
        "tipo": "tecnico", "cabecalho": "ESCOPO TÉCNICO", "eyebrow": "ESCOPO TÉCNICO",
        "titulo": t or "Escopo Técnico",
        "subtitulo": "Documento para validação interna e posterior encaminhamento à TI. Execução e publicação seguem pelo ServiceUP.",
        "secoes": [
            _sec("1. IDENTIFICAÇÃO E METADADOS", [{"t": "campos", "colunas": 2, "linhas": [
                ["Plataforma:", ""], ["Solicitante:", ""],
                ["Data:", ""], ["Versão:", v or "1.0"],
                ["Responsável Técnico TI:", ""], ["Anexos:", ""]]}]),
            _sec("2. INFORMAÇÕES DA DEMANDA", [
                {"t": "subtitulo", "texto": "2.1 Problema e causa"},
                {"t": "paragrafo", "texto": ORIENT},
                {"t": "subtitulo", "texto": "2.2 Objetivo"},
                {"t": "bullets", "itens": ["", ""]}]),
            _sec("3. PLANEJAMENTO E ARQUITETURA", [
                {"t": "subtitulo", "texto": "3.1 Escopo detalhado"},
                {"t": "bullets", "itens": ["", ""]},
                {"t": "subtitulo", "texto": "3.2 Endpoints"},
                _tab(["Sistema", "Finalidade", "Método / Endpoint", "Autenticação"],
                     [1.4, 2.4, 3.4, 1.8],
                     [["", "", "", "credenciais geridas pela TI em cofre de segredos"]]),
                {"t": "callout", "texto": "As credenciais de exemplo dos anexos são de teste e não devem ir para produção. Provisionamento e rotação ficam com a TI, via ServiceUP."}]),
            _sec("4. DESENVOLVIMENTO", [
                {"t": "subtitulo", "texto": "4.1 Funcionalidades"},
                {"t": "bullets", "itens": ["", ""]},
                {"t": "subtitulo", "texto": "4.2 Fluxo"},
                {"t": "numerado", "itens": ["Gatilho: ", "", "Erro: "]},
                {"t": "subtitulo", "texto": "4.3 Diagrama"},
                {"t": "imagem", "arquivo": "diagrama.png", "largura_px": 560, "legenda": ""},
                {"t": "subtitulo", "texto": "4.4 Integrações"},
                _tab(["Origem", "Destino", "Tipo", "Frequência", "Descrição"],
                     [1.4, 1.4, 1.2, 1.4, 3.6], [["", "", "", "", ""]])]),
            _sec("5. HOMOLOGAÇÃO E TESTES", [
                _tab(["Caso de teste", "Tipo", "Resultado esperado"], [3.2, 1.4, 4.4],
                     [["", "Unitário", ""], ["", "Integrado", ""],
                      ["<cenário de erro>", "Integrado", ""]])]),
            _sec("6. GOVERNANÇA", [{"t": "bullets", "itens": [
                "Documentação da arquitetura",
                "Manual de parametrização",
                "Relatório de testes",
                "Cronograma e status report",
                "Publicação, deploy e credenciais de produção: ServiceUP/TI — fora do escopo deste documento"]}]),
            _sec("7. GO LIVE E OPERAÇÃO ASSISTIDA", [
                {"t": "paragrafo", "texto": "Operação assistida de ___ dias corridos após o go live, com canal pelo ServiceUP."}]),
            _sec("8. PENDÊNCIAS", [
                _tab(["#", "Pendência", "Status"], [0.6, 6.4, 2.0],
                     [["1", "", "⚠ A definir"]])]),
        ]}


def projeto(t, v):
    s = []
    s.append(_sec("1. INFORMAÇÕES DO PROJETO", [
        {"t": "paragrafo", "texto": "Objetivo do projeto, com o risco quantificado (ex.: eliminar ajustes massivos como o ocorrido anteriormente, ~R$ 30 milhões)."},
        {"t": "campos", "colunas": 2, "linhas": [
            ["Código do Projeto:", ""], ["Nome:", t or ""],
            ["Dono do Projeto (PO):", ""], ["Sponsor:", ""],
            ["PMO:", ""], ["Responsável Técnico TI:", ""],
            ["Início Previsto:", ""], ["Investimento:", ""]]}]))
    s.append(_sec("2. REQUISITOS FUNCIONAIS", [
        _tab(["ID", "Regra de Negócio"], [0.9, 8.4],
             [["RN01", ""], ["RN02", ""]])]))
    s.append(_sec("3. REQUISITOS NÃO-FUNCIONAIS", [
        _tab(["ID", "Requisito"], [1.6, 7.7],
             [["Tempestividade", "critério mensurável (ex.: desvios sinalizados até D+1)"],
              ["Rastreabilidade", ""], ["Integridade", ""],
              ["Auditoria", ""], ["Desempenho", ""]])]))
    s.append(_sec("4. ESCOPO INCLUÍDO", [
        {"t": "subtitulo", "texto": "4.1 <frente>"},
        {"t": "bullets", "itens": ["O que será feito: ", "Premissas mantidas: ",
                                   "Resultado esperado: ",
                                   "Investimento/horas e objetos afetados: "]}]))
    s.append(_sec("5. FORA DO ESCOPO (EXPLICITAMENTE ALINHADO)", [
        _tab(["Item", "Descrição", "Destino"], [2.2, 4.6, 2.5], [["", "", ""]])]))
    s.append(_sec("6. DEPENDÊNCIAS ENTRE PROJETOS", [
        _tab(["Dependência", "Projeto Relacionado", "Impacto", "Status"],
             [2.4, 2.4, 2.5, 2.0], [["", "", "", "⚠ Dependente (<dono>)"]])]))
    s.append(_sec("7. ROADMAP — EVOLUÇÃO DA INFORMAÇÃO", [
        _tab(["Fase", "Período", "Escopo", "Projeto Responsável"],
             [1.8, 1.8, 3.7, 2.0], [["", "", "", ""]])]))
    s.append(_sec("8. PREMISSAS E DEPENDÊNCIAS", [
        _tab(["Premissa", "Status", "Impacto"], [4.2, 2.1, 3.0],
             [["", "✓ Confirmado", ""], ["", "⚠ A definir", ""]])]))
    s.append(_sec("9. PROCESSOS DE NEGÓCIO", [
        {"t": "subtitulo", "texto": "9.1 Situação Atual (AS-IS)"},
        {"t": "paragrafo", "texto": ""},
        {"t": "subtitulo", "texto": "9.2 Situação Futura (TO-BE)"},
        {"t": "paragrafo", "texto": ""}]))
    s.append(_sec("10. ARQUITETURA DA SOLUÇÃO", [
        {"t": "subtitulo", "texto": "10.1 Containers (C4)"},
        {"t": "bullets", "itens": ["<sistema> — papel. [Interface] quando a entrega é de outro projeto"]},
        {"t": "subtitulo", "texto": "10.2 Decisões Arquiteturais (ADR)"},
        {"t": "paragrafo", "texto": "**ADR-01 — <título>**"},
        {"t": "bullets", "itens": ["Contexto: ", "Decisão: ", "Consequências (incluindo as negativas aceitas): "]}]))
    s.append(_sec("11. INTEGRAÇÕES", [
        _tab(["Origem", "Destino", "Tipo", "Frequência", "Descrição"],
             [1.4, 1.4, 1.2, 1.4, 3.6], [["", "", "", "", ""]])]))
    s.append(_sec("12. DETALHAMENTO TÉCNICO", [
        {"t": "subtitulo", "texto": "12.1 <item técnico>"},
        {"t": "paragrafo", "texto": ""}]))
    s.append(_sec("13. SEGURANÇA, LGPD E COMPLIANCE", [{"t": "bullets", "itens": [
        "Classificação do dado: ",
        "Segregação de funções por perfil (quem aponta não aprova ajuste do próprio apontamento): ",
        "Trilha de auditoria (antes/depois, responsável, justificativa): ",
        "Base legal LGPD e finalidade declarada: ",
        "Revisão periódica de acessos — dono e cadência: "]}]))
    s.append(_sec("14. ESTRATÉGIA DE IMPLANTAÇÃO", [
        _tab(["Fase", "Período", "Escopo", "Critério de Sucesso"],
             [1.8, 1.8, 3.2, 2.5], [["Piloto", "", "", "<critério numérico>"]])]))
    s.append(_sec("15. RISCOS E MITIGAÇÕES", [
        _tab(["Risco", "Criticidade", "Mitigação"], [3.6, 1.6, 4.1],
             [["", "Alto", "<mitigação acionável + fallback quando depende de terceiro>"]])]))
    s.append(_sec("16. BACKLOG TÉCNICO", [
        {"t": "paragrafo", "texto": "**EP01 — <épico>**"},
        {"t": "bullets", "itens": ["[G] <ação> — <sistema/responsável>",
                                   "[M] <ação> — <sistema/responsável>"]}]))
    s.append(_sec("17. TAREFAS DE ACOMPANHAMENTO", [
        _tab(["Ação", "Responsável", "Prazo"], [5.3, 2.2, 1.8], [["", "", ""]])]))
    s.append(_sec("18. PENDÊNCIAS E DÚVIDAS", [
        _tab(["#", "Pendência", "Status"], [0.6, 6.7, 2.0], [["1", "", "⚠ A definir"]])]))
    s.append(_sec("19. APROVADORES", [
        _tab(["Nome", "Papel", "Status", "Data"], [3.0, 2.6, 1.9, 1.8],
             [["", "Sponsor", "Pendente", ""], ["", "PO", "Pendente", ""],
              ["", "Gerente TI", "Pendente", ""]])]))
    return {"tipo": "projeto", "cabecalho": "ESCOPO", "eyebrow": "ESCOPO",
            "titulo": t or "Escopo de Projeto", "sumario": True,
            "subtitulo": "COMBIO ENERGIA S.A. · Tecnologia da Informação · Programa: ___ · Data: ___ · Versão: %s" % (v or "1.0"),
            "secoes": s}


def entrega(t, v, curta=False):
    todas = {
        1: _sec("1. IDENTIFICAÇÃO DA ENTREGA", [{"t": "campos", "colunas": 2, "linhas": [
            ["Projeto/Demanda:", "<mesmo Código do escopo>"],
            ["Escopo de origem:", "<nome + versão>"],
            ["Solicitante/PO:", ""], ["Sponsor:", ""],
            ["Responsável Técnico TI:", ""], ["Período de execução:", "<início e fim reais>"],
            ["Data do relatório:", ""], ["Versão:", v or "1.0"]]}]),
        2: _sec("2. SUMÁRIO EXECUTIVO", [
            {"t": "orientacao", "texto": "5 a 8 linhas para quem lê só esta seção: o que foi entregue, o resultado medido, o que ficou pendente e qual decisão está sendo pedida (o aceite)."},
            {"t": "paragrafo", "texto": ""}]),
        3: _sec("3. RESULTADO VS. OBJETIVO", [
            _tab(["Objetivo declarado no escopo", "Resultado alcançado", "Evidência"],
                 [3.4, 3.0, 2.9], [["", "", ""]])]),
        4: _sec("4. ESCOPO ENTREGUE", [
            {"t": "orientacao", "texto": "Todo ID do escopo aparece aqui — nenhum desaparece. Sem evidência, o status é '⚠ Entregue com ressalva', não '✓'."},
            _tab(["ID", "Item", "Status", "Evidência"], [0.9, 3.8, 2.0, 2.6],
                 [["RN01", "", "✓ Entregue", ""],
                  ["RN02", "", "⚠ Entregue com ressalva", ""],
                  ["EP01", "", "✗ Não entregue", ""]])]),
        5: _sec("5. REQUISITOS NÃO-FUNCIONAIS — AFERIÇÃO", [
            _tab(["Requisito", "Critério do escopo", "Medido", "Situação"],
                 [2.0, 3.0, 2.0, 2.3], [["Tempestividade", "", "", "✓ Atingido"]])]),
        6: _sec("6. CRONOGRAMA: PLANEJADO VS. REALIZADO", [
            _tab(["Fase", "Planejado", "Realizado", "Critério de sucesso", "Atingido?"],
                 [1.6, 1.7, 1.7, 2.7, 1.6], [["", "", "", "", "✓ Sim (desvio: __ dias)"]])]),
        7: _sec("7. TESTES E HOMOLOGAÇÃO", [
            _tab(["Caso de teste", "Tipo", "Resultado", "Data", "Responsável"],
                 [3.0, 1.3, 1.8, 1.2, 2.0],
                 [["", "Unitário", "", "", ""], ["<cenário de erro>", "Integrado", "", "", ""]])]),
        8: _sec("8. DESVIOS EM RELAÇÃO AO ESCOPO", [
            _tab(["Item", "O que mudou", "Motivo", "Impacto", "Aprovado por / quando"],
                 [1.6, 2.2, 2.0, 1.7, 1.8], [["", "", "", "", ""]])]),
        9: _sec("9. ITENS NÃO ENTREGUES E DESTINO", [
            _tab(["Item", "Motivo", "Destino", "Prazo"], [2.4, 2.6, 2.6, 1.7],
                 [["", "", "<nova fase │ backlog │ outro projeto │ ServiceUP>", ""]])]),
        10: _sec("10. RISCOS MATERIALIZADOS", [
            _tab(["Risco (do escopo)", "Materializou?", "O que ocorreu", "Ação tomada", "Situação"],
                 [2.2, 1.4, 2.2, 2.0, 1.5], [["", "Não", "", "", ""]])]),
        11: _sec("11. PENDÊNCIAS ABERTAS", [
            _tab(["#", "Pendência", "Dono", "Prazo", "Criticidade"],
                 [0.6, 4.0, 1.8, 1.4, 1.5], [["1", "", "", "", "Média"]])]),
        12: _sec("12. OPERAÇÃO ASSISTIDA E SUPORTE", [
            {"t": "paragrafo", "texto": "Período de ___ dias (saída em __/__/____), canal **ServiceUP**. Coberto: ___. Não coberto: ___. Chamados no período: ___."}]),
        13: _sec("13. DOCUMENTAÇÃO E GOVERNANÇA ENTREGUES", [
            _tab(["Item", "Status"], [6.8, 2.5],
                 [["Documentação da arquitetura", "✓ Entregue"],
                  ["Manual de parametrização", "✓ Entregue"],
                  ["Relatório de testes", "✓ Entregue"],
                  ["Repasse/treinamento", "⚠ Parcial"],
                  ["ADRs atualizadas", "✓ Entregue"],
                  ["Perfis e acessos configurados", "✓ Entregue"],
                  ["Trilha de auditoria ativa", "✓ Entregue"]])]),
        14: _sec("14. SEGURANÇA E LGPD NA ENTREGA", [
            {"t": "orientacao", "texto": "Descreva o que foi configurado e quem validou. Nunca escreva 'seguro' nem 'homologado'."},
            {"t": "bullets", "itens": [
                "Perfis criados e segregação efetivada — validado por: ",
                "Trilha de auditoria ativa (antes/depois, responsável, justificativa): ",
                "Revisão de acessos agendada — dono e cadência: ",
                "Tratamento de dado pessoal conforme declarado no escopo: "]}]),
        15: _sec("15. INVESTIMENTO REALIZADO", [
            _tab(["Previsto", "Realizado", "Variação", "Observação"],
                 [2.0, 2.0, 1.6, 3.7], [["", "", "", ""]])]),
        16: _sec("16. LIÇÕES APRENDIDAS", [
            _tab(["O que funcionou", "O que repetir", "O que evitar"],
                 [3.1, 3.1, 3.1], [["", "", ""]])]),
        17: _sec("17. PRÓXIMOS PASSOS E FASES FUTURAS", [
            {"t": "bullets", "itens": ["<item> — fase futura (<ano>), pré-requisito: "]}]),
        18: _sec("18. ACEITE", [
            {"t": "orientacao", "texto": "Você nunca marca aceite: o status fica 'Pendente' até assinatura."},
            _tab(["Nome", "Papel", "Status", "Data"], [3.0, 2.6, 1.9, 1.8],
                 [["", "Solicitante/PO", "Pendente", ""],
                  ["", "Sponsor", "Pendente", ""],
                  ["", "Gerente TI", "Pendente", ""]])]),
    }
    ordem = [1, 2, 4, 7, 9, 11, 12, 18] if curta else list(range(1, 19))
    return {"tipo": "entrega", "cabecalho": "RELATÓRIO DE ENTREGA",
            "eyebrow": "RELATÓRIO DE ENTREGA", "titulo": t or "Relatório de Entrega",
            "sumario": not curta,
            "status_geral": {"texto": "Entregue com pendências", "cor": "warn"},
            "secoes": [todas[i] for i in ordem]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tipo", required=True,
                    choices=["melhoria", "tecnico", "projeto", "entrega", "entrega-curta"])
    ap.add_argument("--titulo", default=None)
    ap.add_argument("--versao", default="1.0")
    a = ap.parse_args()
    f = {"melhoria": melhoria, "tecnico": tecnico, "projeto": projeto}.get(a.tipo)
    if f:
        spec = f(a.titulo, a.versao)
    else:
        spec = entrega(a.titulo, a.versao, curta=(a.tipo == "entrega-curta"))
    print(json.dumps(spec, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
