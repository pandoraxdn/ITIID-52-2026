import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, Float} from "@nestjs/graphql";
import {Inscripcion} from "../inscripciones/inscripcion.entity";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";
import {Periodo} from "../periodos/periodo.entity";

@ObjectType()
@Entity('calificaciones')
export class Calificacion {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_calificacion: number;

  @Field(() => Int)
  @Column({type: "int"})
  inscripcion_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  det_grupo_materia_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  periodo_id: number;

  @Field(() => Float)
  @Column({type: "decimal"})
  valor: number;

  @Field(() => Int)
  @Column({type: "int"})
  faltas_periodo: number;

  @Field(() => String)
  @Column({type: "text"})
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Inscripcion, ins => ins.calificaciones, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'inscripcion_id'})
  inscripcion: Inscripcion;

  @ManyToOne(() => DetGrupoMateria, det => det.calificaciones, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'det_grupo_materia_id'})
  detGrupoMateria: DetGrupoMateria;

  @ManyToOne(() => Periodo, periodo => periodo.calificaciones, {nullable: true, onDelete: 'SET NULL'})
  @JoinColumn({name: 'periodo_id'})
  periodo: Periodo;
}
