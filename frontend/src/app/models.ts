export interface Upv {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
  capacidadeMw: number;
}

export interface Equipamento {
  id: number;
  tag: string;
  tipo: string;
  upv?: Upv;
}

export interface OrdemManutencao {
  id: number;
  numero: string;
  descricao: string;
  tipo: 'preventiva' | 'corretiva' | 'preditiva';
  status: 'aberta' | 'em_execucao' | 'concluida' | 'cancelada';
  prioridade: 1 | 2 | 3;
  equipamento?: Equipamento;
  criadaEm: string;
  concluidaEm?: string;
  custoEstimado: number;
}

export interface RelatorioUpv {
  nome: string;
  totalOrdens: number;
  ordensAbertas: number;
  custoEstimadoTotal: number;
}
