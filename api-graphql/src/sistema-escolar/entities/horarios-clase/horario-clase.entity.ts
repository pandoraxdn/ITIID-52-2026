import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";

@ObjectType()
@Entity('horarios-clase')
export class HorarioClase {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_horario_clase: number;

  @Field(() => Int)
  @Column({type: "int"})
  det_grupo_materia_id: number;

  @Field(() => String)
  @Column()
  dia_semana: string;

  @Field(() => Date)
  @Column({type: "time"})
  hora_inicio: Date;

  @Field(() => Date)
  @Column({type: "time"})
  hora_fin: Date;

  @ManyToOne(() => DetGrupoMateria, det => det.horarios, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'det_grupo_materia_id'})
  detGrupoMateria: DetGrupoMateria;
}
