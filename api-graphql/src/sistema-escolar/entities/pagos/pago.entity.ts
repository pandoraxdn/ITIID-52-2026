import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Float, Int, registerEnumType} from "@nestjs/graphql";
import {Alumno} from "../alumnos/alumno.entity";
import {ConceptoPago} from "../conceptos-pago/concepto-pago.entity";

export enum TipoPago {
  EFECTIVO = 'EFECTIVO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA = 'TARJETA',
}

export enum EstadoPago {
  PAGADO = 'PAGADO',
  PENDIENTE = 'PENDIENTE',
  CANCELADO = 'CANCELADO',
}

registerEnumType(TipoPago, {
  name: 'TipoPago',
});

registerEnumType(EstadoPago, {
  name: 'EstadoPago',
});

@ObjectType()
@Entity('pagos')
export class Pago {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_pago: number;

  @Field(() => Int)
  @Column({type: "int"})
  alumno_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  concepto_id: number;

  @Field(() => Float)
  @Column({type: "decimal"})
  monto_pagado: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_pago: Date;

  @Field(() => TipoPago)
  @Column({type: "enum", enum: TipoPago, default: TipoPago.EFECTIVO})
  metodo_pago: TipoPago;

  @Field(() => EstadoPago)
  @Column({type: "enum", enum: EstadoPago, default: EstadoPago.PENDIENTE})
  estado: EstadoPago;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  referencia_bancaria?: string;

  @ManyToOne(() => Alumno, alumno => alumno.pagos, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'alumno_id'})
  alumno: Alumno;

  @ManyToOne(() => ConceptoPago, concepto => concepto.pagos, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'concepto_id'})
  concepto: ConceptoPago;
}
