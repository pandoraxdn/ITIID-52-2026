import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {Field, Float, ID, Int, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Alumno} from "../alumnos/alumno.entity";
import {Grupo} from "../grupos/grupo.entity";
import {CicloEscolar} from "../ciclos-escolares/ciclo-escolar.entity";
import {Calificacion} from "../calificaciones/calificacion.entity";
import {AsistenciaAlumno} from "../asistencias-alumnos/asistencia-alumnos.entity";

export enum EstadoInscripcion {
  INSCRITO = 'INSCRITO',
  BAJA = 'BAJA',
  EGRESADO = 'EGRESADO',
}

registerEnumType(EstadoInscripcion, {
  name: 'EstadoInscripcion',
});

@ObjectType()
@Entity('inscripciones')
export class Inscripcion {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_inscripcion: number;

  @Field(() => Int)
  @Column({type: "int"})
  alumno_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  grupo_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  ciclo_id: number;

  @Field(() => Date)
  @Column()
  fecha_inscripcion: Date;

  @Field(() => Float)
  @Column({type: "decimal", default: 0})
  beca_porcentaje: number;

  @ManyToOne(() => Alumno, alumno => alumno.inscripciones, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'alumno_id'})
  alumno: Alumno;

  @ManyToOne(() => Grupo, grupo => grupo.inscripciones, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'grupo_id'})
  grupo: Grupo;

  @ManyToOne(() => CicloEscolar, ciclo => ciclo.inscripciones, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'ciclo_id'})
  ciclo: CicloEscolar;

  @OneToMany(() => Calificacion, cal => cal.inscripcion)
  calificaciones: Calificacion[];

  @OneToMany(() => AsistenciaAlumno, asis => asis.inscripcion)
  asistencias: AsistenciaAlumno[];
}
