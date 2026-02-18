import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, Float, registerEnumType} from "@nestjs/graphql";
import {Inscripcion} from "../inscripciones/inscripcion.entity";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";

export enum EstadoAsistenciaAl {
  ASISTENCIA = 'ASISTENCIA',
  FALTA = 'FALTA',
  RETARDO = 'RETARDO',
  JUSTIFICADO = 'JUSTIFICADO',
}

registerEnumType(EstadoAsistenciaAl, {
  name: 'EstadoAsistenciaAl',
});

@ObjectType()
@Entity('asistencia-alumnos')
export class AsistenciaAlumno {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_asistencia_al: number;

  @Field(() => Int)
  @Column({type: "int"})
  inscripcion_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  det_grupo_materia_id: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha: Date;

  @Field(() => EstadoAsistenciaAl)
  @Column({type: "enum", enum: EstadoAsistenciaAl, default: EstadoAsistenciaAl.ASISTENCIA})
  estado_asistencia: EstadoAsistenciaAl;

  @Field(() => String)
  @Column()
  observaciones: string;

  @ManyToOne(() => Inscripcion, ins => ins.asistencias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'inscripcion_id'})
  inscripcion: Inscripcion;

  @ManyToOne(() => DetGrupoMateria, det => det.asistenciasAlumnos, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'det_grupo_materia_id'})
  detGrupoMateria: DetGrupoMateria;
}
