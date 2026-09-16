import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Equipamento } from '../equipamentos/equipamento.entity';

@Entity()
export class Upv {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  cidade!: string;

  @Column()
  estado!: string;

  @Column('float')
  capacidadeMw!: number;

  @OneToMany(() => Equipamento, (equipamento) => equipamento.upv)
  equipamentos!: Equipamento[];
}
