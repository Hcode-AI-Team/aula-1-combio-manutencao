import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Upv } from '../upvs/upv.entity';
import { OrdemManutencao } from '../ordens/ordem-manutencao.entity';

export type TipoEquipamento =
  'caldeira' | 'turbina' | 'esteira' | 'gerador' | 'bomba';

@Entity()
export class Equipamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tag!: string;

  @Column()
  tipo!: TipoEquipamento;

  @ManyToOne(() => Upv, (upv) => upv.equipamentos, { nullable: false })
  upv!: Upv;

  @OneToMany(() => OrdemManutencao, (ordem) => ordem.equipamento)
  ordens!: OrdemManutencao[];
}
