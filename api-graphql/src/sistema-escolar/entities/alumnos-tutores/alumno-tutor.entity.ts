import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Alumno} from "../alumnos/alumno.entity";
import {Tutor} from "../tutores/tutor.entity";

@ObjectType()
@Entity('alumnos-tutores')
export class AlumnoTutor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_de_al_tutor: number;

  @Field(() => Int)
  @Column({type: "int"})
  alumno_id: number;

  @Field(() => Int)
  @Column({type: "int"})
  tutor_id: number;

  @Field(() => Boolean)
  @Column()
  es_tutor_financiero: boolean;

  @ManyToOne(() => Alumno, alumno => alumno.alumnosTutores, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'alumno_id'})
  alumno: Alumno;

  @ManyToOne(() => Tutor, tutor => tutor.alumnosTutores, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'tutor_id'})
  tutor: Tutor;
}
