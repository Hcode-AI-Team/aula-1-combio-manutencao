import { StatusOrdem } from '../ordem-manutencao.entity';

// Regra de domínio pura: não depende de NestJS, TypeORM nem HTTP.
// Tabela de transições permitidas (skill regras-ordem-manutencao / ADR 0006).
// Mesmo status (diagonal) é idempotente e sempre permitido.
const TRANSICOES_PERMITIDAS: Readonly<
  Record<StatusOrdem, readonly StatusOrdem[]>
> = {
  aberta: ['em_execucao', 'concluida', 'cancelada'],
  em_execucao: ['aberta', 'concluida', 'cancelada'],
  concluida: [],
  cancelada: [],
};

export class TransicaoStatusInvalidaError extends Error {
  constructor(
    readonly de: StatusOrdem,
    readonly para: StatusOrdem,
  ) {
    super(`Transição de status inválida: ${de} → ${para}`);
    this.name = 'TransicaoStatusInvalidaError';
  }
}

export function validarTransicao(de: StatusOrdem, para: StatusOrdem): void {
  if (de === para) {
    return;
  }
  if (!TRANSICOES_PERMITIDAS[de].includes(para)) {
    throw new TransicaoStatusInvalidaError(de, para);
  }
}
