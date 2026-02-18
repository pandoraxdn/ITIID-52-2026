import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, Float} from "@nestjs/graphql";
import {CicloEscolar} from "../ciclos-escolares/ciclo-escolar.entity";
import {ConsumoComedor} from "../consumos-comedor/consumo-comedor.entity";

@ObjectType()
@Entity('menus-comedor')
export class MenuComedor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_menu: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha: Date;

  @Field(() => String)
  @Column()
  titulo: string;

  @Field(() => String)
  @Column({type: "text"})
  descripcion: string;

  @Field(() => String)
  @Column({type: "text"})
  alergenos: string;

  @Field(() => Float)
  @Column({type: "decimal"})
  costo: number;

  @Field(() => Int)
  @Column({type: "int"})
  ciclo_id: number;

  @ManyToOne(() => CicloEscolar, ciclo => ciclo.menus, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'ciclo_id'})
  ciclo: CicloEscolar;

  @OneToMany(() => ConsumoComedor, consumo => consumo.menu)
  consumos: ConsumoComedor[];
}
