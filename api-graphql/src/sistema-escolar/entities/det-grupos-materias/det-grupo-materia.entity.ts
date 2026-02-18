import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Grupo} from "../grupos/grupo.entity";
import {Materia} from "../materias/materia.entity";
import {Profesor} from "../profesores/profesor.entity";
import {HorarioClase} from "../horarios-clase/horario-clase.entity";
import {Calificacion} from "../calificaciones/calificacion.entity";
import {AsistenciaAlumno} from "../asistencias-alumnos/asistencia-alumnos.entity";

@ObjectType()
@Entity('det_grupos_materias')
export class DetGrupoMateria {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_det_grupo_materia: number;

  @Field(() => Int)
  @Column({type: "int"})
  grupo_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  materia_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  profesor_id: number;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  salon_asignado?: string;

  @ManyToOne(() => Grupo, grupo => grupo.detGruposMaterias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'grupo_id'})
  grupo: Grupo;

  @ManyToOne(() => Materia, materia => materia.detGruposMaterias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'materia_id'})
  materia: Materia;

  @ManyToOne(() => Profesor, profesor => profesor.detGruposMaterias, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'profesor_id'})
  profesor: Profesor;

  @OneToMany(() => HorarioClase, horario => horario.detGrupoMateria)
  horarios: HorarioClase[];

  @OneToMany(() => Calificacion, cal => cal.detGrupoMateria)
  calificaciones: Calificacion[];

  @OneToMany(() => AsistenciaAlumno, a => a.detGrupoMateria)
  asistenciasAlumnos: AsistenciaAlumno[];
}
