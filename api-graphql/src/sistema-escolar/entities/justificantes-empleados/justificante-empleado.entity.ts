import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Field, ID, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Empleado} from "../empleados/empleado.entity";

export enum TipoJustificante {
  ENFERMEDAD = 'ENFERMEDAD',
  VACACIONES = 'VACACIONES',
  PERSONAL = 'PERSONAL',
}

export enum EstadoAprobacion {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
}

registerEnumType(TipoJustificante, {
  name: 'TipoJustificante',
});

registerEnumType(EstadoAprobacion, {
  name: 'EstadoAprobacion',
});

@ObjectType()
@Entity('justificante-empleados')
export class JustificanteEmpleado {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_justificante_emp: number;

  @Field(() => Int)
  @Column({type: "int"})
  empleado_id: number;

  @Field(() => TipoJustificante)
  @Column({type: "enum", enum: TipoJustificante, default: TipoJustificante.PERSONAL})
  tipo_justificante: TipoJustificante;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_inicio: string;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_fin: string;

  @Field(() => String)
  @Column({type: "text"})
  motivo: string;

  @Field(() => EstadoAprobacion)
  @Column({type: "enum", enum: EstadoAprobacion, default: EstadoAprobacion.PENDIENTE})
  estado_aprobacion: EstadoAprobacion;

  @Field(() => String)
  @Column()
  documento_url: string;

  @ManyToOne(() => Empleado, empleado => empleado.justificantes, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'empleado_id'})
  empleado: Empleado;
}
