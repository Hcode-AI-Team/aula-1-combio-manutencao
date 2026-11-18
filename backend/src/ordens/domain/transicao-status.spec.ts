import { StatusOrdem } from '../ordem-manutencao.entity';
import {
  TransicaoStatusInvalidaError,
  validarTransicao,
} from './transicao-status';

describe('validarTransicao', () => {
  const permitidas: [StatusOrdem, StatusOrdem][] = [
    ['aberta', 'em_execucao'],
    ['aberta', 'concluida'],
    ['aberta', 'cancelada'],
    ['em_execucao', 'aberta'],
    ['em_execucao', 'concluida'],
    ['em_execucao', 'cancelada'],
  ];

  const idempotentes: StatusOrdem[] = [
    'aberta',
    'em_execucao',
    'concluida',
    'cancelada',
  ];

  const proibidas: [StatusOrdem, StatusOrdem][] = [
    ['concluida', 'aberta'],
    ['concluida', 'em_execucao'],
    ['concluida', 'cancelada'],
    ['cancelada', 'aberta'],
    ['cancelada', 'em_execucao'],
    ['cancelada', 'concluida'],
  ];

  it.each(permitidas)('permite %s → %s', (de, para) => {
    expect(() => validarTransicao(de, para)).not.toThrow();
  });

  it.each(idempotentes)('permite manter o status %s (idempotente)', (s) => {
    expect(() => validarTransicao(s, s)).not.toThrow();
  });

  it.each(proibidas)('proíbe %s → %s', (de, para) => {
    expect(() => validarTransicao(de, para)).toThrow(
      TransicaoStatusInvalidaError,
    );
  });

  it('usa a mensagem padrão e expõe origem e destino', () => {
    let capturado: unknown;
    try {
      validarTransicao('cancelada', 'aberta');
    } catch (erro: unknown) {
      capturado = erro;
    }
    expect(capturado).toBeInstanceOf(TransicaoStatusInvalidaError);
    const e = capturado as TransicaoStatusInvalidaError;
    expect(e.message).toBe('Transição de status inválida: cancelada → aberta');
    expect(e.de).toBe('cancelada');
    expect(e.para).toBe('aberta');
    expect(e.name).toBe('TransicaoStatusInvalidaError');
  });
});
