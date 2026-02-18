import {Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int, registerEnumType} from "@nestjs/graphql";
import {Empleado} from "../empleados/empleado.entity";
import {DetGrupoMateria} from "../det-grupos-materias/det-grupo-materia.entity";

export enum TipoNivelEstudio {
  LICENCIATURA = 'LICENCIATURA',
  MAESTRIA = 'MAESTRIA',
  DOCTORADO = 'DOCTORADO',
}

registerEnumType(TipoNivelEstudio, {
  name: 'TipoNivelEstudio',
});

@ObjectType()
@Entity('profesores')
export class Profesor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_profesor: number;

  @Field(() => Int)
  @Column({type: "int"})
  empleado_id: number;

  @Field(() => String)
  @Column()
  especialidad: string;

  @Field(() => TipoNivelEstudio)
  @Column({type: "enum", enum: TipoNivelEstudio, default: TipoNivelEstudio.LICENCIATURA})
  nivel_estudios: TipoNivelEstudio;

  @Field(() => String)
  @Column()
  cedula_profesional: string;

  @OneToOne(() => Empleado, empleado => empleado.profesor, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'empleado_id'})
  empleado: Empleado;

  @OneToMany(() => DetGrupoMateria, det => det.profesor)
  detGruposMaterias: DetGrupoMateria[];
}
