import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ObjectType, Field, ID, Float} from "@nestjs/graphql";
import {Pago} from "../pagos/pago.entity";

@ObjectType()
@Entity('conceptos_pago')
export class ConceptoPago {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_concepto: number;

  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => Float)
  @Column({type: "decimal"})
  monto: number;

  @Field(() => Boolean)
  @Column({type: "boolean"})
  es_recurrente: boolean;

  @OneToMany(() => Pago, pago => pago.concepto)
  pagos: Pago[];
}
