import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Equipamento } from '../equipamentos/equipamento.entity';

export type TipoOrdem = 'preventiva' | 'corretiva' | 'preditiva';
export type StatusOrdem = 'aberta' | 'em_execucao' | 'concluida' | 'cancelada';

@Entity()
export class OrdemManutencao {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numero!: string;

  @Column()
  descricao!: string;

  @Column()
  tipo!: TipoOrdem;

  @Column()
  status!: StatusOrdem;

  @Column('int')
  prioridade!: 1 | 2 | 3;

  @ManyToOne(() => Equipamento, (equipamento) => equipamento.ordens, {
    nullable: false,
  })
  equipamento!: Equipamento;

  @Column()
  criadaEm!: Date;

  @Column({ nullable: true })
  concluidaEm?: Date;

  @Column('float')
  custoEstimado!: number;
}
