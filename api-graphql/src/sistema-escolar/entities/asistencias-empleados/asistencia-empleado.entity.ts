import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, Float, registerEnumType} from "@nestjs/graphql";
import {Empleado} from "../empleados/empleado.entity";

export enum EstadoAsistenciaEm {
  ASISTENCIA = 'ASISTENCIA',
  FALTA = 'FALTA',
  RETARDO = 'RETARDO',
  JUSTIFICADO = 'JUSTIFICADO',
}

registerEnumType(EstadoAsistenciaEm, {
  name: 'EstadoAsistencia',
});

@ObjectType()
@Entity('asistencia-empleados')
export class AsistenciaEmpleado {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_asistencia_emp: number;

  @Field(() => Int)
  @Column({type: "int"})
  empleado_id: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha: Date;

  @Field(() => Date)
  @Column({type: "time"})
  hora_entrada_real: Date;

  @Field(() => Date)
  @Column({type: "time"})
  hora_salida_real: Date;

  @Field(() => EstadoAsistenciaEm)
  @Column({type: "enum", enum: EstadoAsistenciaEm, default: EstadoAsistenciaEm.ASISTENCIA})
  estado_asistencia: EstadoAsistenciaEm;

  @Field(() => Int)
  @Column({type: "int", default: 0})
  minutos_retardo: number;

  @Field(() => String)
  @Column()
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Empleado, empleado => empleado.asistencias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'empleado_id'})
  empleado: Empleado;
}
